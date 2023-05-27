import { Body, Controller, Param, Post } from '@nestjs/common';
import { SplitService } from './split.service';

@Controller('files')
export class SplitController {
  constructor(private readonly splitService: SplitService) {}

  @Post(`:id/split`)
  async splitFile(@Param('id') id: string, @Body('regexp') regexp?: string) {
    return this.splitService.queueSplit(id, regexp);
  }
}
