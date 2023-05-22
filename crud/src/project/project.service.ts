import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostTranslateLanguage } from 'common/dto/language.dto';
import { ChangeProjectDto } from 'common/dto/project.dto';
import { Language } from 'common/enums';
import { File } from 'entities/file.entity';
import { Glossary } from 'entities/glossary.entity';
import { Order } from 'entities/order.entity';
import Project from 'entities/project.entity';
import { ProjectTag } from 'entities/projecttag.enity';
import { TranslationLanguage } from 'entities/translation-language.entity';
import User from 'entities/user.entity';
import { FilesService } from 'files/files.service';
import * as fs from 'fs/promises';
import { LanguageService } from 'language/language.service';
import { InjectS3, S3 } from 'nestjs-s3';
import { TranslationService } from 'translation/translation.service';
import { And, DeepPartial, Equal, ILike, Repository } from 'typeorm';

const { PRODUCTION } = process.env;
//1
@Injectable()
export class ProjectService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    // if (PRODUCTION) return;

    console.log('kek');

    if ((await this.projectRepository.findOne({ where: { id: '1' } })) != null)
      return;

    const user = new User();
    user.email = 'admin@admin.com';
    user.password = 'admin';
    user.name = 'Владислав Динеев';
    user.refreshToken = '';

    const editorUser = new User();
    editorUser.email = 'editor@editor.com';
    editorUser.password = 'editor';
    editorUser.name = 'Редактор Тест';
    editorUser.refreshToken = '';

    console.log('1');

    for (let i = 0; i < 3; i++) {
      const project = new Project();
      project.name = `Проект ${i}`;
      project.description = `Это описание проекта с номером ${i}`;

      const file = new File();
      const tag = new ProjectTag();
      file.name = 'Субтитры.srt';
      file.path = 'test';
      file.encoding = 'utf-8';
      project.files = [file];
      project.owner = user;
      project.editors = i < 2 ? [editorUser] : [];
      project.private = i === 1;
      tag.id = `test${i}`;
      project.tags = [tag];

      const translateLanguage = new TranslationLanguage();
      translateLanguage.language = Language.ru;
      translateLanguage.original = true;
      translateLanguage.name = 'Русский';
      translateLanguage.glossary = new Glossary();
      project.translateLanguage = [translateLanguage];
      const insertedProject = await this.projectRepository.save(project);

      console.log(insertedProject);

      const testFile = await fs.readFile('test.txt');

      await this.s3.putObject({
        Bucket: 'uploads',
        Key: 'test',
        Body: testFile,
      });

      await this.fileService.splitFile(insertedProject.files[0].id);
      await this.createTranslation(insertedProject.id, {
        language: Language.en,
      });
    }
  }

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Glossary)
    private glossaryRepository: Repository<Glossary>,
    private fileService: FilesService,
    private languageService: LanguageService,
    private translationsService: TranslationService,
    @InjectS3() private readonly s3: S3,
  ) {}

  //2

  async getProjectOrder(id: string) {
    return (
      await this.projectRepository.findOne({
        where: { id },
        relations: { order: { applicants: true } },
      })
    ).order;
  }

  async getProjectGlossaries(id: string) {
    return this.glossaryRepository.find({
      where: { language: { project: { id } } },
      relations: { language: { project: true } },
    });
  }

  async createTranslation(id: string, language: PostTranslateLanguage) {
    const originalLanguage = await this.languageService.getOriginalLanguage(id);
    const createdLanguage = await this.languageService.saveLanguage({
      ...language,
      project: { id },
      glossary: { entries: [] },
    });

    const files = await this.fileService.getFilesByProject(id);
    return Promise.all(
      files.map((file) =>
        this.translationsService.generateTranslationForFile(
          createdLanguage.id,
          file.id,
          originalLanguage.id,
        ),
      ),
    );
  }

  async findProjectsByUser(
    userId: string,
    params: { withPrivate?: Boolean } = {},
  ) {
    if (params.withPrivate)
      return this.projectRepository.find({ where: { owner: { id: userId } } });

    return this.projectRepository.find({
      where: { owner: { id: userId }, private: false },
    });
  }

  async findProjectsByQuery(query: string, tags: string[]) {
    if (tags && tags.length) {
      return this.projectRepository.find({
        where: {
          name: query && ILike(`%${query}%`),
          tags: { id: And(...tags.map((t) => Equal(t))) },
        },
        select: ['id', 'name', 'description'],
      });
    }

    return this.projectRepository.find({
      where: { name: query && ILike(`%${query}%`) },
      select: ['id', 'name', 'description'],
    });
  }

  async findProjectById(id: string) {
    return this.projectRepository.findOne({
      where: { id },
      relations: ['owner', 'translateLanguage'],
    });
  }

  async createProject(project: DeepPartial<Project>) {
    return this.projectRepository.save(project);
  }

  async updateProject(projectId: string, project: ChangeProjectDto) {
    const { tags, ...rest } = project;

    return this.projectRepository.save({
      ...rest,
      id: projectId,
      tags: tags.map((tag) => ({ id: tag })),
    });
  }

  async findProjectByLanguage(languageId: string) {
    return this.projectRepository.findOne({
      where: { translateLanguage: { id: languageId } },
    });
  }

  async createOrder(projectId: string, order: Pick<Order, 'description'>) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    return this.projectRepository.save({ ...project, order });
  }
}
