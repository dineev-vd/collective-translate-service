import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AssemblyService } from 'assembly/assembly.service';
import { PagedResponseDto } from 'common/dto/response.dto';
import { SegmentStatus } from 'common/enums';
import SegmentTranslation from 'entities/segment-translation.entity';
import { FilesService } from 'files/files.service';
import { TranslationService } from 'translation/translation.service';
import { LanguageService } from './language.service';

@Controller('language')
export class LanguageController {
  constructor(
    private readonly languageService: LanguageService,
    private readonly translationsService: TranslationService,
    private readonly filesService: FilesService,
    private readonly assemblyService: AssemblyService,
  ) {}

  @Get(':id/glossary') async getGlossary(@Param('id') id: string) {
    return this.languageService.getGlossary(id);
  }

  @Get(':id')
  async getLanguageById(@Param('id') id: string) {
    return this.languageService.getTranslationLanguageById(id);
  }

  @Get(':id/translations-orders')
  async getTranslationsByOrder(
    @Param('id') languageId: string,
    @Query('orders') orders: string,
  ) {
    return this.translationsService.getTranslationsByOrder(
      languageId,
      orders.split(',').map((o) => Number(o)),
    );
  }

  @Get(':id/translations')
  async getTranslationsByLanguage(
    @Param('id') languageId: string,
    @Query('fileId') fileId?: string,
    @Query('take') take?: number,
    @Query('page') page?: number,
    @Query('shouldTranslate') shouldTranslate?: boolean,
    @Query('withOriginal') withOriginal?: boolean,
    @Query('status') status?: SegmentStatus,
    @Query('hasSuggestions') hasSuggestions?: string,
  ): Promise<PagedResponseDto<SegmentTranslation[]>> {
    return this.translationsService.getTranslationsByLanguage({
      languageId: languageId,
      withOriginal: withOriginal,
      fileId: fileId,
      take: take,
      page: page,
      shouldTranslate: shouldTranslate,
      status: status,
      hasSuggestions: hasSuggestions,
    });
  }

  @Post(':id/assemble')
  async assembleFiles(@Param('id') languageId: string) {
    const language = await this.languageService.getTranslationLanguageById(
      languageId,
    );
    await this.assemblyService.deleteAssembliesByLanguage(languageId);
    const files = await this.filesService.getFilesByProject(language.projectId);
    return Promise.all(
      files.map((file) => this.filesService.assembleFile(file.id, languageId)),
    );
  }

  @Get(`:id/assemblies`)
  async getAssemblies(@Param('id') languageId: string) {
    return this.assemblyService.getAssembliesByLanguageId(languageId);
  }
}
