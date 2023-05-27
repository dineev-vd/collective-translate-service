import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { XMLParser } from 'fast-xml-parser';
import { flatten } from 'flat';
import * as iconv from 'iconv-lite';
import { InjectS3, S3 } from 'nestjs-s3';
import * as yauzl from 'yauzl';

function stream2buffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const _buf = [];

    stream.on('data', (chunk) => _buf.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(_buf)));
    stream.on('error', (err) => reject(err));
  });
}

@Processor('files_to_parse')
export class AppService {
  constructor(
    @InjectQueue('ready_files')
    private readyFilesQueue: Queue,
    @InjectS3() private readonly s3: S3,
  ) {}

  @Process({ concurrency: 1 })
  async processFile(
    file: Job<{
      id: string;
      name: string;
      key: string;
      bucket: string;
      encoding: string;
      regexp?: string;
    }>,
  ) {
    console.log(file);

    const fileBuffer = Buffer.from(
      await (
        await this.s3.getObject({ Bucket: 'uploads', Key: file.data.key })
      ).Body.transformToByteArray(),
    );

    if (file.data.name.endsWith('.docx')) {
      const parsed = await this.splitDocxFile(fileBuffer);

      const res = await this.readyFilesQueue.add({
        id: file.data.id,
        data: parsed,
      });

      console.log(res);

      file.finished();

      return;
    }

    const parsed = await this.splitFile(
      fileBuffer,
      file.data.encoding,
      file.data.regexp,
    );

    const res = await this.readyFilesQueue.add({
      id: file.data.id,
      data: parsed,
    });

    console.log(res);

    file.finished();
  }

  async splitDocxFile(buffer: Buffer) {
    return new Promise<
      { shouldTranslate: boolean; translationText: string; order: number }[]
    >(async (resolve) => {
      yauzl.fromBuffer(buffer, { lazyEntries: true }, (err, zipfile) => {
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

                const segments = filteredDocument.map((text, index) => {
                  //make segments
                  const textSegment = {
                    shouldTranslate: true,
                    translationText: text,
                    order: index,
                  };
                  return textSegment;
                });

                resolve(segments);
              }

              zipfile.readEntry();
            });
          });
        });
      });
    });
  }

  async formTextSegments(re: RegExp, completeText: string) {
    let count = 0;
    const array = completeText
      .split(re)
      .reduce((previous, splitPart, index) => {
        if (splitPart.length === 0) return previous;

        const textSegment = {
          shouldTranslate: index % 2 !== 0,
          translationText: splitPart,
          order: count++,
        };

        return [...previous, textSegment];
      }, []);

    return array;
  }

  async splitFile(fileBuffer: Buffer, encoding: string, regexp?: string) {
    console.log('started');
    // const fileBuffer = await fs.readFile(file.path);

    console.log('fileRead');
    const rawText = iconv.decode(fileBuffer, encoding);
    console.log('fileDecoded');

    const reg = regexp
      ? new RegExp(`${decodeURI(regexp)}`, 'g')
      : /(\s+[^.!?]*[.!?])/g;

    const segments = await this.formTextSegments(reg, rawText);

    //console.log(identifiers)

    return segments;
  }
}
