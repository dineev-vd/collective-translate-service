import { Controller, Get } from '@nestjs/common';
import { RegexpService } from './regexp.service';

@Controller('regexp')
export class RegexpController {
    constructor(
        private readonly regexpService: RegexpService
    ) { }

    @Get('/')
    async getAll() {
        return this.regexpService.getAll();
    }
}
