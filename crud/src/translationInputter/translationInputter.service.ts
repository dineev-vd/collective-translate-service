import { InjectRepository } from '@nestjs/typeorm';
import SegmentTranslation from 'entities/segment-translation.entity';
import { Repository } from 'typeorm';
//
export class TranslationInputterService {
  constructor(
    @InjectRepository(SegmentTranslation)
    private pieceRepository: Repository<SegmentTranslation>,
  ) {}

  async putTranslations(
    translations: { id: string; translationText: string; type: string }[],
  ) {
    const res = await this.pieceRepository.save(
      translations.map((t) => ({
        id: t.id,
        translationText: t.translationText,
      })),
    );

    console.log(res);

    return res;
  }
}
