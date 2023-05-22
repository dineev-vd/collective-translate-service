import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegularExpression } from 'entities/regexp.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RegexpService implements OnApplicationBootstrap {
    /**
     *
     */
    constructor(
        @InjectRepository(RegularExpression)
        private readonly regexpRepository: Repository<RegularExpression>
    ) { }
    onApplicationBootstrap() {
        const defaultExpressions: Partial<RegularExpression>[] = [
            {name: "Субтитры", regexp: "(?<=\\d+[\\n\\r]{1,2}[\\d:,]+\\s+-{2}\\>\\s+[\\d:,]+[\\n\\r]{1,2})([\\s\\S]+?(?=\\n\\r))"},
            {name: "По абзацам", regexp: "([^\\n\\r]+)"}
        ]

        this.regexpRepository.save(defaultExpressions);
    }

    async getAll() {
        return this.regexpRepository.find();
    }
}
