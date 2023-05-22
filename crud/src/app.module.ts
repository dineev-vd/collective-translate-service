import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from 'entities/action.entity';
import { Assembly } from 'entities/assembly.entity';
import { Comment } from 'entities/comment.entity';
import { File } from 'entities/file.entity';
import { Glossary } from 'entities/glossary.entity';
import { GlossaryEntry } from 'entities/glossaryEntry.entity';
import { JobResult } from 'entities/jobresult.entity';
import { NewsPost } from 'entities/newspost.entity';
import { Order } from 'entities/order.entity';
import { ProjectTag } from 'entities/projecttag.enity';
import { RegularExpression } from 'entities/regexp.entity';
import { Suggestion } from 'entities/suggestion.entity';
import { TranslationLanguage } from 'entities/translation-language.entity';
import { GlossaryModule } from 'glossary/glossary.module';
import { S3Module } from 'nestjs-s3';
import { NewsModule } from 'news/news.module';
import { OrderModule } from 'order/order.module';
import { TranslationInputterModule } from 'translationInputter/translationInputter.module';
import { ActionsModule } from './actions/actions.module';
import { AssemblyModule } from './assembly/assembly.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import Project from './entities/project.entity';
import SegmentTranslation from './entities/segment-translation.entity';
import User from './entities/user.entity';
import { FilesModule } from './files/files.module';
import { LanguageModule } from './language/language.module';
import { ProjectModule } from './project/project.module';
import { RegexpModule } from './regexp/regexp.module';
import { TagsModule } from './tags/tags.module';
import { TranslationModule } from './translation/translation.module';
import { UserModule } from './user/user.module';

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  POSTGRES_DB,
  S3_ENDPOINT,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
} = process.env;
//1

console.log(S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_ENDPOINT);
@Module({
  imports: [
    S3Module.forRootAsync({
      useFactory: async () => ({
        config: {
          credentials: {
            accessKeyId: S3_ACCESS_KEY_ID,
            secretAccessKey: S3_SECRET_ACCESS_KEY,
          },
          forcePathStyle: true,
          endpoint: S3_ENDPOINT,
          region: 'us-east-1',
        },
      }),
    }),
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 1,
      },
    }),
    TypeOrmModule.forRoot({
      logging: ['warn'],
      maxQueryExecutionTime: 1000,
      type: 'postgres',
      host: POSTGRES_HOST,
      port: +(POSTGRES_PORT ?? 5432),
      database: POSTGRES_DB,
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      dropSchema: true,
      synchronize: true,
      entities: [
        Project,
        SegmentTranslation,
        User,
        Action,
        File,
        Comment,
        TranslationLanguage,
        Assembly,
        RegularExpression,
        Suggestion,
        JobResult,
        NewsPost,
        Glossary,
        GlossaryEntry,
        Order,
        ProjectTag,
      ],
    }),
    ProjectModule,
    UserModule,
    TranslationModule,
    AuthModule,
    LanguageModule,
    ActionsModule,
    FilesModule,
    CommentModule,
    AssemblyModule,
    RegexpModule,
    NewsModule,
    TranslationInputterModule,
    GlossaryModule,
    OrderModule,
    TagsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
