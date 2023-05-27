import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionsService } from 'actions/actions.service';
import * as chardet from 'chardet';
import { FileStatus } from 'common/enums';
import * as crypto from 'crypto';
import { Action } from 'entities/action.entity';
import { Assembly } from 'entities/assembly.entity';
import { File } from 'entities/file.entity';
import SegmentTranslation from 'entities/segment-translation.entity';
import { TranslationLanguage } from 'entities/translation-language.entity';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { flatten, unflatten } from 'flat';
import * as iconv from 'iconv-lite';
import { LanguageService } from 'language/language.service';
import mammoth from 'mammoth';
import { InjectS3, S3 } from 'nestjs-s3';
import * as sbd from 'sbd';
import { TranslationService } from 'translation/translation.service';
import { DeepPartial, Repository } from 'typeorm';
import yauzl from 'yauzl';
import yazl from 'yazl';

function stream2buffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const _buf = [];

    stream.on('data', (chunk) => _buf.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(_buf)));
    stream.on('error', (err) => reject(err));
  });
}

@Injectable()
export class FilesService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Assembly)
    private readonly assemblyRepository: Repository<Assembly>,
    private readonly actionsService: ActionsService,
    private readonly translationsService: TranslationService,
    private readonly languageService: LanguageService,
    @InjectS3() private readonly s3: S3,
  ) {}

  async onApplicationBootstrap() {
    const buckets = await this.s3.listBuckets({});
    if (!buckets.Buckets.some((b) => b.Name === 'assemblies')) {
      await this.s3.createBucket({ Bucket: 'assemblies' });
    }
    if (!buckets.Buckets.some((b) => b.Name === 'uploads')) {
      await this.s3.createBucket({ Bucket: 'uploads' });
    }
  }

  async getFileById(id: string) {
    return this.fileRepository.findOne({ where: { id } });
  }

  async saveFileToStorage(buffer: Buffer) {
    const key = crypto.randomUUID();

    await this.s3.putObject({
      Bucket: 'uploads',
      Key: key,
      Body: buffer,
    });

    return key;
  }

  async insertFiles(
    projectId: string,
    filePaths: { name: string; path: string }[],
  ) {
    const files = await Promise.all(
      filePaths.map(async (path) => {
        const file: DeepPartial<File> = {};
        const fileBytes = await (
          await this.s3.getObject({ Bucket: 'uploads', Key: path.path })
        ).Body.transformToByteArray();
        const encoding = (await chardet.detect(fileBytes)).toString();
        file.name = path.name ?? 'Без названия';
        file.path = path.path;
        file.encoding = encoding;
        file.project = {
          id: projectId,
        };

        return file;
      }),
    );

    return this.fileRepository.save(files);
  }

  async peekFileById(id: string, charsFromStart: number, regexp?: string) {
    const file = await this.fileRepository.findOne({ where: { id } });
    const kkk = await this.s3.getObject({ Bucket: 'uploads', Key: file.path });

    // const stream = createReadStream(file.path, {
    //   start: 0,
    //   end: charsFromStart,
    // });

    const stream = await kkk.Body.transformToByteArray();

    const buffer = Buffer.from(stream);
    const re = regexp
      ? new RegExp(`${decodeURI(regexp)}`, 'g')
      : /(\s+[^.!?]*[.!?])/g;

    if (file.name.endsWith('.docx')) {
      const buf = await kkk.Body.transformToByteArray();
      const awfa = Buffer.from(buf);
      // const buf = await fs.readFile(file.path);

      const fileString = (await mammoth.extractRawText({ buffer: awfa })).value;

      return {
        text: fileString
          .split(re)
          .map((value, index) => ({ marked: index % 2 !== 0, text: value }))
          .filter((t) => t.text.length > 0),
      };
    }

    const fileString = iconv.decode(buffer, file.encoding);

    return {
      text: fileString
        .split(re)
        .map((value, index) => ({ marked: index % 2 !== 0, text: value }))
        .filter((t) => t.text.length > 0),
    };
  }

  async getFirstSegment(fileId: string) {
    const file = await this.fileRepository.findOne({ where: { id: fileId } });
    const languages =
      await this.languageService.getTranslationLanguagesByProjectId(
        file.projectId,
      );
    const originalLanguage = languages.find((l) => l.original);

    return this.translationsService.getFirstByFileAndLanguage(
      file.id,
      originalLanguage.id,
    );
  }

  async formTextSegments(
    re: RegExp,
    completeText: string,
    file: File,
    original: TranslationLanguage,
  ): Promise<SegmentTranslation[]> {
    let count = 0;
    sbd.sentences(completeText, {});
    const array = completeText
      .split(re)
      .reduce((previous, splitPart, index) => {
        if (splitPart.length === 0) return previous;
        sbd;
        const textSegment = new SegmentTranslation();
        textSegment.shouldTranslate = index % 2 !== 0;
        textSegment.translationText = splitPart;
        textSegment.order = count++;
        textSegment.file = file;
        textSegment.translationLanguage = original;

        return [...previous, textSegment];
      }, []);

    return array;
  }

  async getFilesByProject(projectId: string) {
    return this.fileRepository.find({
      where: { project: { id: projectId } },
    });
  }

  async assembleDocxFile(id: string, languageId: string) {
    const file = await this.getFileById(id);

    const newzip = new yazl.ZipFile();

    const fileBuffer = Buffer.from(
      await (
        await this.s3.getObject({ Bucket: 'uploads', Key: file.path })
      ).Body.transformToByteArray(),
    );

    yauzl.fromBuffer(fileBuffer, { lazyEntries: true }, (err, zipfile) => {
      zipfile.readEntry();
      zipfile.on('entry', (entry) => {
        zipfile.openReadStream(entry, (err, readstream) => {
          stream2buffer(readstream).then(async (buffer) => {
            let newbuffer;

            if (entry.fileName.endsWith('document.xml')) {
              const parser = new XMLParser({
                ignoreAttributes: false,
              });

              const parserWOAttr = new XMLParser({
                ignoreAttributes: true,
              });

              const parsedDocument = parser.parse(buffer);
              const documentWOAttr = parserWOAttr.parse(buffer);

              const flattenedDocument = flatten(parsedDocument);
              const flattenedWOAttr = flatten(documentWOAttr);

              ///

              const bulkSize = 1000;
              let offset = 1;
              const params = {
                languageId: languageId,
                fileId: id,
                take: bulkSize,
              };

              const first = await this.getFirstSegment(id);

              let currentBulk =
                await this.translationsService.getSegmentWithNeighbours(
                  first.id,
                  {
                    next: bulkSize * offset,
                    toLanguageId: languageId,
                    withOriginal: true,
                    include: true,
                  },
                );

              let segments: string[] = [];

              while (currentBulk.length > 0) {
                const curSegments = currentBulk.map((segment) => {
                  if (segment.id) {
                    return segment.translationText;
                  }

                  return segment.original.translationText;
                });

                segments = segments.concat(curSegments);

                currentBulk =
                  await this.translationsService.getSegmentWithNeighbours(
                    currentBulk[currentBulk.length - 1].id
                      ? currentBulk[currentBulk.length - 1].id
                      : currentBulk[currentBulk.length - 1].original.id,
                    {
                      next: bulkSize * offset,
                      toLanguageId: languageId,
                      withOriginal: true,
                    },
                  );
              }

              Object.entries(flattenedWOAttr)
                .filter(([key, value]) => value)
                .forEach(
                  ([key, value], index) =>
                    (flattenedDocument[key] = segments[index]),
                );

              const unflattened = unflatten(flattenedDocument);

              const builder = new XMLBuilder({
                ignoreAttributes: false,
              });
              const xmlContent = builder.build(unflattened);
              newbuffer = Buffer.from(xmlContent, 'utf8');
            } else {
              newbuffer = buffer;
            }

            newzip.addBuffer(newbuffer, entry.fileName);

            zipfile.readEntry();
          });
        });
      });

      zipfile.on('end', async () => {
        console.log('Completed extracting all files');

        // all files added
        newzip.end();

        const fileName = crypto.randomUUID();

        const newbuffer = await stream2buffer(newzip.outputStream);

        await this.s3.putObject({
          Bucket: 'assemblies',
          Key: fileName,
          Body: newbuffer,
        });

        const language = await this.languageService.getTranslationLanguageById(
          languageId,
        );
        this.createAssembly(file, fileName, language);

        // store on s3
      });
    });
  }

  async assembleFile(id: string, languageId: string) {
    const file = await this.getFileById(id);

    if (file.name.endsWith('.docx')) {
      return this.assembleDocxFile(id, languageId);
    }

    const bulkSize = 1000;
    let offset = 1;
    const params = { languageId: languageId, fileId: id, take: bulkSize };

    const first = await this.getFirstSegment(id);

    let currentBulk = await this.translationsService.getSegmentWithNeighbours(
      first.id,
      {
        next: bulkSize * offset,
        toLanguageId: languageId,
        withOriginal: true,
        include: true,
      },
    );

    const fileName = crypto.randomUUID();
    let buffer = Buffer.from([]);

    while (currentBulk.length > 0) {
      const stringToWrite = currentBulk
        .map((segment) => {
          if (segment.id) {
            return segment.translationText;
          }

          return segment.original.translationText;
        })
        .join('');

      buffer = Buffer.concat([
        buffer,
        iconv.encode(stringToWrite, file.encoding),
      ]);

      currentBulk = await this.translationsService.getSegmentWithNeighbours(
        currentBulk[currentBulk.length - 1].id
          ? currentBulk[currentBulk.length - 1].id
          : currentBulk[currentBulk.length - 1].original.id,
        {
          next: bulkSize * offset,
          toLanguageId: languageId,
          withOriginal: true,
        },
      );
    }

    await this.s3.putObject({
      Bucket: 'assemblies',
      Key: fileName,
      Body: buffer,
    });

    const language = await this.languageService.getTranslationLanguageById(
      languageId,
    );
    return this.createAssembly(file, fileName, language);
  }

  async createAssembly(
    file: File,
    filePath: string,
    language: TranslationLanguage,
  ) {
    const assembly = new Assembly();
    assembly.path = filePath;
    assembly.language = language;
    assembly.name = `${
      language.language
    }_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}_${
      file.name
    }`;
    return this.assemblyRepository.save(assembly);
  }

  async splitDocxFile(id: string) {
    return new Promise<void>(async (resolve) => {
      const file = await this.fileRepository.findOne({ where: { id } });
      await this.fileRepository.save({
        id,
        status: FileStatus.PROCESSING,
      });

      const fileBuffer = Buffer.from(
        await (
          await this.s3.getObject({ Bucket: 'uploads', Key: file.path })
        ).Body.transformToByteArray(),
      );

      const original = await this.languageService.getOriginalLanguage(
        file.projectId,
      );

      yauzl.fromBuffer(fileBuffer, { lazyEntries: true }, (err, zipfile) => {
        zipfile.readEntry();
        zipfile.on('entry', (entry) => {
          zipfile.openReadStream(entry, (err, readstream) => {
            stream2buffer(readstream).then(async (buffer) => {
              if (entry.fileName.endsWith('document.xml')) {
                const parser = new XMLParser({
                  ignoreAttributes: true,
                });

                const parsedDocument = parser.parse(buffer);
                const flattenedDocument = flatten(parsedDocument);

                console.log(flattenedDocument);

                const filteredDocument = Object.values(
                  flattenedDocument,
                ).filter((v) => v);

                let count = 0;
                const segments = filteredDocument.map((text, index) => {
                  //make segments
                  const textSegment = new SegmentTranslation();
                  textSegment.shouldTranslate = true;
                  textSegment.translationText = text;
                  textSegment.order = count++;
                  textSegment.file = file;
                  textSegment.translationLanguage = original;

                  return textSegment;
                });

                const identifiers =
                  await this.translationsService.insertTextSegments(segments);
                //console.log(identifiers)

                const actions = identifiers.map((i) => {
                  const action: DeepPartial<Action> = {};
                  action.change = '';
                  action.comment = 'Сегмент создан';
                  action.segment = { id: i.id };

                  return action;
                });

                console.log('fileSplit');
                await this.actionsService.insertActions(actions);
                console.log('actions inserted');

                await this.fileRepository.update(Number(id), {
                  status: FileStatus.SPLITTED,
                });
                console.log('text segments saved');

                resolve();
              }

              zipfile.readEntry();
            });
          });
        });
      });
    });
  }

  async splitFile(id: string, regexp?: string) {
    const file = await this.fileRepository.findOne({ where: { id } });
    await this.fileRepository.save({
      id,
      status: FileStatus.PROCESSING,
    });

    if (file.name.endsWith('.docx')) {
      return this.splitDocxFile(id);
    }

    try {
      let rawText: string;

      console.log('started');
      // const fileBuffer = await fs.readFile(file.path);
      console.log(file.path);
      const fileBuffer = Buffer.from(
        await (
          await this.s3.getObject({ Bucket: 'uploads', Key: file.path })
        ).Body.transformToByteArray(),
      );
      console.log('fileRead');
      const decoded = iconv.decode(fileBuffer, file.encoding);
      console.log('fileDecoded');

      rawText = decoded;

      const reg = regexp
        ? new RegExp(`${decodeURI(regexp)}`, 'g')
        : /(\s+[^.!?]*[.!?])/g;
      await this.translationsService.removeSegmentsFromFile(file.id);

      const original = await this.languageService.getOriginalLanguage(
        file.projectId,
      );

      const segments = await this.formTextSegments(
        reg,
        rawText,
        file,
        original,
      );

      const identifiers = await this.translationsService.insertTextSegments(
        segments,
      );
      //console.log(identifiers)

      const actions = identifiers.map((i) => {
        const action: DeepPartial<Action> = {};
        action.change = '';
        action.comment = 'Сегмент создан';
        action.segment = { id: i.id };

        return action;
      });

      console.log('fileSplit');
      await this.actionsService.insertActions(actions);
      console.log('actions inserted');

      await this.fileRepository.update(Number(id), {
        status: FileStatus.SPLITTED,
      });
      console.log('text segments saved');
    } catch (e) {
      console.log(e);
      await this.fileRepository.save({
        id,
        status: FileStatus.NEW,
      });
    }
  }

  async processFile(job: {
    id: string;
    data: {
      shouldTranslate: boolean;
      order: number;
      translationText: string;
    }[];
  }) {
    const file = await this.fileRepository.findOne({ where: { id: job.id } });

    await this.translationsService.removeSegmentsFromFile(file.id);

    const original = await this.languageService.getOriginalLanguage(
      file.projectId,
    );

    const segments: Partial<SegmentTranslation>[] = job.data.map((s) => ({
      ...s,
      translationLanguage: original,
      file,
    }));

    const identifiers = await this.translationsService.insertTextSegments(
      segments,
    );
    //console.log(identifiers)

    const actions = identifiers.map((i) => {
      const action: DeepPartial<Action> = {};
      action.change = '';
      action.comment = 'Сегмент создан';
      action.segment = { id: i.id };

      return action;
    });

    console.log('fileSplit');
    await this.actionsService.insertActions(actions);
    console.log('actions inserted');

    await this.fileRepository.update(file.id, {
      status: FileStatus.SPLITTED,
    });
    console.log('text segments saved');
  }
}
