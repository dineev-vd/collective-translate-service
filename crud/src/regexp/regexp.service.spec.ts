import { Test, TestingModule } from '@nestjs/testing';
import { RegexpService } from './regexp.service';

describe('RegexpService', () => {
  let service: RegexpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegexpService],
    }).compile();

    service = module.get<RegexpService>(RegexpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
