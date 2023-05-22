import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from 'entities/action.entity';
import { DeepPartial, ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(Action)
    private readonly actionsRepository: Repository<Action>,
  ) {}

  // async removeByFileId() {}

  // TODO

  async getActionsBySegment(textSegmentId: string) {
    return this.actionsRepository.find({
      where: {
        segment: { id: textSegmentId },
      },
      relations: ['author'],
    });
  }

  async insertActions(actions: DeepPartial<Action>[]) {
    const chunkSize = 1000;
    const arr: ObjectLiteral[] = [];
    for (let i = 0; i < actions.length; i += chunkSize) {
      const chunk = actions.slice(i, i + chunkSize);
      const { identifiers } = await this.actionsRepository
        .createQueryBuilder()
        .insert()
        .values(chunk)
        .execute();
      arr.push.apply(arr, identifiers);
      //arr = arr.concat(identifiers);
    }

    return arr;
  }

  async getActionsForProject(projectId: string) {
    return this.actionsRepository.find({
      order: { timestamp: 'DESC' },
      take: 30,
      where: { segment: { file: { project: { id: projectId } } } },
      relations: ['segment', 'segment.file', 'segment.file.project', 'author'],
    });
  }
}
