import { Test, TestingModule } from '@nestjs/testing';
import { RegexpController } from './regexp.controller';

describe('RegexpController', () => {
  let controller: RegexpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegexpController],
    }).compile();

    controller = module.get<RegexpController>(RegexpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
