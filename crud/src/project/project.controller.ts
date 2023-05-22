import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ActionsService } from 'actions/actions.service';
import {
  FILE_ENDPOINT,
  LANGUAGE_ENDPOINT,
  PROJECT_ENDPOINT,
} from 'common/constants';
import { PostTranslateLanguage } from 'common/dto/language.dto';
import {
  ChangeProjectDto,
  GetProjectDto,
  PostProjectDto,
} from 'common/dto/project.dto';
import { Order } from 'entities/order.entity';
import { TranslationLanguage } from 'entities/translation-language.entity';
import { FilesService } from 'files/files.service';
import { JwtAuthGuard } from 'guards/simple-guards.guard';
import { LanguageService } from 'language/language.service';
import { TranslationService } from 'translation/translation.service';
import { ExtendedRequest } from 'util/ExtendedRequest';
import { ProjectService } from './project.service';

@Controller(PROJECT_ENDPOINT)
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly filesService: FilesService,
    private readonly languageService: LanguageService,
    private readonly actionsService: ActionsService,
    private readonly translationsService: TranslationService,
  ) {}

  @Get(':id/order')
  async getProjectOrder(@Param('id') projectId: string) {
    return this.projectService.getProjectOrder(projectId);
  }

  @Get(':id/glossaries')
  async getProjectGlossaries(@Param('id') projectId: string) {
    return this.projectService.getProjectGlossaries(projectId);
  }

  @Get()
  async getProjectsByQuery(
    @Query('query') query: string,
    @Query('tags', { transform: (v) => (v ? v.split(',') : []) })
    tags: string[],
  ): Promise<GetProjectDto[]> {
    console.log(tags);

    return this.projectService.findProjectsByQuery(query, tags);
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string): Promise<GetProjectDto> {
    return {
      ...(await this.projectService.findProjectById(id)),
      ...(await this.translationsService.countSegmentsByProject(id)),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async postProjectById(
    @Param('id') id: string,
    @Body() projectChange: ChangeProjectDto,
    @Req() { user }: ExtendedRequest,
  ) {
    const project = await this.projectService.findProjectById(id);

    if (!(project.ownerId == user.id)) {
      throw new ForbiddenException();
    }

    return this.projectService.updateProject(id, projectChange);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async insertProject(
    @Body() project: PostProjectDto,
    @Req() { user }: ExtendedRequest,
  ) {
    const { language, tags, ...rest } = project;
    const originalLanguage = new TranslationLanguage();
    originalLanguage.language = language;
    originalLanguage.original = true;

    return this.projectService.createProject({
      ...rest,
      owner: user,
      translateLanguage: [{ ...originalLanguage, glossary: { entries: [] } }],
      tags: tags.map((tag) => ({ id: tag })),
    });
  }

  @Get(`:id/${FILE_ENDPOINT}`)
  async getFiles(@Param('id') id: string) {
    const files = await this.filesService.getFilesByProject(id);
    return Promise.all(
      files.map(async (file) => {
        const counts = await this.translationsService.countSegmentsByFile(
          file.id,
        );
        return { ...file, ...counts };
      }),
    );
  }

  @Post(`:id/${FILE_ENDPOINT}`)
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id') id: string,
  ) {
    const filesSaved = await Promise.all(
      files.map(async (file) => {
        const fileBuf = file.buffer;
        return {
          name: file.fieldname ?? file.originalname,
          path: await this.filesService.saveFileToStorage(fileBuf),
        };
      }),
    );

    return this.filesService.insertFiles(id, filesSaved);
  }

  @Get(`:id/${LANGUAGE_ENDPOINT}`)
  async getProjectLanguages(@Param('id') projectId: string) {
    const languages =
      await this.languageService.getTranslationLanguagesByProjectId(projectId);
    return Promise.all(
      languages.map(async (language) => {
        const counts = await this.translationsService.countSegmentsByLanguage(
          language.id,
        );
        return { ...language, ...counts };
      }),
    );
  }

  @Post(`:id/${LANGUAGE_ENDPOINT}`)
  async createTranslation(
    @Param('id') id: string,
    @Body() language: PostTranslateLanguage,
  ) {
    if (!language['language']) throw new BadRequestException();

    return this.projectService.createTranslation(id, language);
  }

  @Get(':id/actions')
  async getAllActions(@Param('id') id: string) {
    return this.actionsService.getActionsForProject(id);
  }

  @Post(':id/order')
  async createOrder(
    @Param('id') id: string,
    @Body() order: Pick<Order, 'description'>,
  ) {
    return this.projectService.createOrder(id, order);
  }
}
