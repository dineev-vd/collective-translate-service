import { Language } from 'common/enums';
import { GetShortUserDto } from './user.dto';

export class PostProjectDto {
  name: string;
  description: string;
  language: Language;
  tags: string[];
}

export class GetProjectDto {
  id: string;
  name: string;
  description: string;
  owner: GetShortUserDto;
  private?: boolean;
  all?: number;
  translated?: number;
  editorsId: string[];
  ownerId: string;
}

export class ChangeProjectDto {
  name: string;
  description: string;
  tags: string[];
}
