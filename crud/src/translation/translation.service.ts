import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { PagedResponseDto } from 'common/dto/response.dto';
import { PostTranslationDto } from 'common/dto/translate-piece.dto';
import { SegmentStatus } from 'common/enums';
import { Action } from 'entities/action.entity';
import { Comment } from 'entities/comment.entity';
import { JobResult } from 'entities/jobresult.entity';
import SegmentTranslation from 'entities/segment-translation.entity';
import { Suggestion } from 'entities/suggestion.entity';
import User from 'entities/user.entity';
import { LanguageService } from 'language/language.service';
import {
  Between,
  DeepPartial,
  FindOptionsWhere,
  In,
  ObjectLiteral,
  Repository,
} from 'typeorm';

//
@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(SegmentTranslation)
    private pieceRepository: Repository<SegmentTranslation>,
    // TODO: Replace with service
    private languageService: LanguageService,
    @InjectQueue('pendingSegments')
    private audioQueue: Queue,
    @InjectRepository(JobResult)
    private jobResultsRepository: Repository<JobResult>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async getJobResults(segmentId: string) {
    return this.jobResultsRepository.find({
      where: { textSegment: { id: segmentId } },
    });
  }

  async queuePieces(languageId: string) {
    const translations = await this.getTranslationsByLanguage({
      languageId,
      take: 10000000,
    });
    console.log(`total to insert: ${translations.data.length}`);

    return this.audioQueue.addBulk(
      translations.data.map(({ id, translationText }) => ({
        data: { id, translationText },
        opts: {
          removeOnComplete: true,
          attempts: +Infinity,
          removeOnFail: true,
        },
      })),
    );
  }

  getFirstByFileAndLanguage(fileId: string, languageId: string) {
    return this.pieceRepository.findOne({
      where: {
        file: { id: fileId },
        translationLanguage: { id: languageId },
        order: 0,
      },
    });
  }

  getOne(id: string) {
    return this.pieceRepository.findOne({ where: { id } });
  }

  getPieces(ids: string[]): Promise<SegmentTranslation[]> {
    return this.pieceRepository.findByIds(ids);
  }

  async getTranslationsByLanguage(params: {
    languageId: string;
    fileId?: string;
    take?: number;
    page?: number;
    shouldTranslate?: boolean;
    withOriginal?: boolean;
    status?: SegmentStatus;
    hasSuggestions?: string;
  }): Promise<PagedResponseDto<SegmentTranslation[]>> {
    const filter: FindOptionsWhere<SegmentTranslation> = {};

    if (params.languageId) {
      filter.translationLanguage = { id: params.languageId };
    }
    //awd

    if (params.fileId) {
      filter.file = { id: params.fileId };
    }

    if (
      params.shouldTranslate !== null &&
      params.shouldTranslate !== undefined
    ) {
      filter.shouldTranslate = params.shouldTranslate;
    }

    if (params.status !== undefined && params.status !== null) {
      filter.status = params.status;
    }

    // if(params.hasSuggestions !== undefined && params.hasSuggestions !== null) {
    //   filter.suggestions = In([]);
    // }

    const query = this.pieceRepository
      .createQueryBuilder()
      .leftJoin(
        Suggestion,
        'suggestions',
        'SegmentTranslation.id = suggestions.segmentId',
      )
      .where(filter);

    const queryWithSuggestionFilter =
      params.hasSuggestions !== undefined && params.hasSuggestions !== null
        ? query.andWhere(
            `suggestions.id IS ${
              params.hasSuggestions === 'true' ? 'NOT' : ''
            } NULL`,
          )
        : query;

    const [result, count] = await queryWithSuggestionFilter
      .take(params.take | 10)
      .skip(((params.page - 1) * (params.take | 10)) | 0)
      .getManyAndCount();

    if (params.withOriginal && result.length > 0) {
      const project = await this.getProjectBySegment(result[0].id);
      const languages =
        await this.languageService.getTranslationLanguagesByProjectId(
          project.id,
        );

      const originalLanguage = languages.find((l) => l.original);

      if (originalLanguage.id !== params.languageId) {
        const originalArray = await this.pieceRepository.find({
          where: {
            translationLanguage: { id: originalLanguage.id },
            order: In(result.map((s) => s.order)),
          },
        });

        return {
          data: result.map((segment) => {
            const originalSegment = originalArray.find(
              (originalSegment) =>
                segment.order === originalSegment.order &&
                segment.fileId === originalSegment.fileId,
            );

            return {
              ...segment,
              original: originalSegment,
            };
          }),
          meta: { totalReacords: count },
        };
      }
    }

    return { data: result, meta: { totalReacords: count } };
  }

  updatePieces(pieces: { piece: PostTranslationDto; id: string }[]) {
    return pieces.map((piece) => {
      if (piece.piece.translationText) {
        return this.pieceRepository.update(piece.id, {
          translationText: piece.piece.translationText,
        });
      } else {
      }
    });
  }

  async savePiece(piece: Partial<SegmentTranslation>) {
    return this.pieceRepository.save(piece);
  }

  async generateTranslationForFile(
    languageId: string,
    fileId: string,
    fromLanguageId: string,
  ) {
    let page = 1;
    let { data: currentBulk } = await this.getTranslationsByLanguage({
      languageId: fromLanguageId,
      fileId: fileId,
      take: 1000,
      page: page++,
    });

    console.log(`saving translations for ${languageId}`);

    while (currentBulk.length > 0) {
      const translations = currentBulk.reduce((previous, piece) => {
        if (piece.shouldTranslate) {
          const translation: DeepPartial<SegmentTranslation> = {};
          translation.translationLanguage = { id: languageId };
          translation.translationText = piece.translationText;
          translation.order = piece.order;
          translation.shouldTranslate = piece.shouldTranslate;
          translation.file = { id: fileId };

          return previous.concat(translation);
        }

        return previous;
      }, []);
      // const translations = currentBulk.map((piece) => {
      //   const translation: DeepPartial<SegmentTranslation> = {};
      //   translation.translationLanguage = { id: Number(languageId) };
      //   translation.translationText = piece.translationText;
      //   translation.order = piece.order;
      //   translation.shouldTranslate = piece.shouldTranslate;
      //   translation.file = { id: Number(fileId) }

      //   return translation;
      // });

      await this.pieceRepository
        .createQueryBuilder()
        .insert()
        .values(translations)
        .execute();

      const { data } = await this.getTranslationsByLanguage({
        languageId: fromLanguageId,
        fileId: fileId,
        take: 1000,
        page: page++,
      });
      currentBulk = data;
    }

    console.log('saved');

    // console.log('inserting in queue');
    // await this.queuePieces(languageId);
    // console.log('done inserting in queue');

    return 'saved';
  }

  async removeSegmentsFromFile(fileId: string) {
    //await this.actionsRepository.delete({ segment: { file: { id: fileId } } });
    return this.pieceRepository.delete({ file: { id: fileId } });
  }

  async savePieces(pieces: PostTranslationDto[]) {
    return this.pieceRepository.save(pieces);
  }

  async getSegmentWithNeighbours(
    segmentId: string,
    params?: {
      prev?: number;
      next?: number;
      toLanguageId?: string;
      withOriginal?: boolean;
      include?: boolean;
    },
  ): Promise<(SegmentTranslation & { original?: SegmentTranslation })[]> {
    const segment = await this.pieceRepository.findOne({
      where: { id: segmentId },
    });

    if (!segment) {
      return [];
    }

    const filterLanguageId =
      params.toLanguageId ?? segment.translationLanguageId;
    const filter: FindOptionsWhere<SegmentTranslation> = {
      translationLanguage: { id: filterLanguageId },
      order: segment.order,
      file: { id: segment.fileId },
    };

    if (params.next && params.prev) {
      filter.order = Between(
        +filter.order - +params.prev,
        +filter.order + +params.next,
      );
    } else if (params.next) {
      filter.order = Between(
        +filter.order + 1 - (params.include ? 1 : 0),
        +filter.order + +params.next,
      );
    } else if (params.prev) {
      filter.order = Between(
        +filter.order - +params.prev,
        +filter.order - 1 + (params.include ? 1 : 0),
      );
    }

    const result = await this.pieceRepository.find({
      where: filter,
      order: { order: 'ASC' },
    });

    if (params.withOriginal) {
      const project = await this.getProjectBySegment(segmentId);
      const languages =
        await this.languageService.getTranslationLanguagesByProjectId(
          project.id,
        );
      const originalLanguage = languages.find((l) => l.original);

      if (originalLanguage.id !== filterLanguageId) {
        const originalArray = await this.pieceRepository.find({
          where: {
            ...filter,
            translationLanguage: { id: originalLanguage.id },
          },
          order: { order: 'ASC' },
        });
        return originalArray.map((originalSegment) => ({
          ...result.find((segment) => segment.order === originalSegment.order),
          original: originalSegment,
        }));
      }
    }

    return result;
  }

  async insertTextSegments(segments: DeepPartial<SegmentTranslation>[]) {
    const chunkSize = 1000;
    const arr: ObjectLiteral[] = [];
    for (let i = 0; i < segments.length; i += chunkSize) {
      const chunk = segments.slice(i, i + chunkSize);
      const { identifiers } = await this.pieceRepository
        .createQueryBuilder()
        .insert()
        .values(chunk)
        .execute();
      arr.push.apply(arr, identifiers);
      //arr = arr.concat(identifiers);
    }

    return arr;
  }

  async getTranslationsByOrder(languageId: string, orders: number[]) {
    return this.pieceRepository.find({
      where: { translationLanguage: { id: languageId }, order: In(orders) },
      order: { order: 'ASC' },
    });
  }

  async getProjectBySegment(segmentId: string) {
    return (
      await this.pieceRepository.findOne({
        where: { id: segmentId },
        relations: ['translationLanguage', 'translationLanguage.project'],
      })
    ).translationLanguage.project;
  }

  async getLanguageBySegment(segmentId: string) {
    return (
      await this.pieceRepository.findOne({
        where: { id: segmentId },
        relations: ['translationLanguage'],
      })
    ).translationLanguage;
  }

  async getOriginalBySegment(segmentId: string): Promise<SegmentTranslation> {
    const project = await this.getProjectBySegment(segmentId);
    const languages =
      await this.languageService.getTranslationLanguagesByProjectId(project.id);
    const orig = languages.find((l) => l.original);
    const [originalSegment] = await this.getSegmentWithNeighbours(segmentId, {
      toLanguageId: orig.id,
    });
    return originalSegment;
  }

  async putTranslations(translations: PostTranslationDto[], user: User) {
    return Promise.all(
      translations.map(async (translation) => {
        const changeAction = new Action();
        changeAction.author = user;
        changeAction.change = translation.translationText;
        changeAction.comment = translation.comment;

        const segment = await this.pieceRepository.findOne({
          where: { id: translation.id },
          relations: ['actions'],
        });
        segment.actions.push(changeAction);
        segment.translationText = translation.translationText;
        segment.status = SegmentStatus.TRANSLATED;

        return this.pieceRepository.save(segment);
      }),
    );
  }

  async countSegmentsByProject(projectId: string) {
    return {
      all: await this.pieceRepository.count({
        relations: ['file', 'file.project'],
        where: { file: { project: { id: projectId } } },
      }),
      translated: await this.pieceRepository.count({
        relations: ['file', 'file.project'],

        where: {
          status: SegmentStatus.TRANSLATED,
          file: { project: { id: projectId } },
        },
      }),
    };
  }
  async countSegmentsByLanguage(languageId: string) {
    return {
      all: await this.pieceRepository.count({
        relations: ['translationLanguage'],
        where: { translationLanguage: { id: languageId } },
      }),
      translated: await this.pieceRepository.count({
        relations: ['translationLanguage'],
        where: {
          status: SegmentStatus.TRANSLATED,
          translationLanguage: { id: languageId },
        },
      }),
    };
  }

  async countSegmentsByFile(fileId: string) {
    return {
      all: await this.pieceRepository.count({
        relations: ['file'],
        where: { file: { id: fileId } },
      }),
      translated: await this.pieceRepository.count({
        relations: ['file'],
        where: {
          status: SegmentStatus.TRANSLATED,
          file: { id: fileId },
        },
      }),
    };
  }

  async updateStatus(segmentId: string, status: SegmentStatus) {
    return this.pieceRepository.update(segmentId, { status: status });
  }

  async getComments(segmentId: string) {
    return (
      await this.pieceRepository.findOne({
        where: { id: segmentId },
        relations: { comments: true },
      })
    ).comments;
  }

  async postComment(
    newsPostId: string,
    comment: Pick<Comment, 'author' | 'comment'>,
  ) {
    return this.commentsRepository.save({
      ...comment,
      textSegment: { id: newsPostId },
    });
  }

  async getSimilarPieces(segmentId: string) {
    const segment = await this.pieceRepository.findOne({
      where: { id: segmentId },
      relations: { translationLanguage: true },
    });

    const project = await this.getProjectBySegment(segmentId);
    const languages =
      await this.languageService.getTranslationLanguagesByProjectId(project.id);
    const origLng = languages.find((l) => l.original);

    const original = await this.getOriginalBySegment(segmentId);

    const pieces: {
      translatedText: string;
      originalText: string;
      l2: number;
      originalLng: string;
      translatedLng: string;
    }[] = await this.pieceRepository.manager
      .query(`SELECT t."translationText" as translatedText, original."translationText" as originalText, levenshtein(original."translationText", '${original.translationText}') as l2,
      tl.language as originalLng, tl2.language as translatedLng

from segment_translation as t
        INNER JOIN segment_translation as original on t."order" = original."order" AND t."fileId" = original."fileId" AND t.id != original.id
INNER JOIN translation_language tl on tl.id = original."translationLanguageId"
INNER JOIN translation_language tl2 on tl2.id = t."translationLanguageId"

WHERE tl.language='${origLng.language}' AND tl2.language='${segment.translationLanguage.language}' AND (t.status='translated' AND (original.status='translated' OR tl.original=true))
ORDER BY l2 DESC`);

    return pieces;
  }
}
