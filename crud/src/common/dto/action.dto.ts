import { GetTranslationDto } from "./translate-piece.dto";
import { GetUserDto } from "./user.dto";

export class PostActionDto {
  textSegmentId: string;
  change: string;
  comment?: string;
}

export class GetActionDto {
  id: string;
  textSegmentId: string;
  change: string;
  comment?: string;
  author: GetUserDto;
  segment?: GetTranslationDto;
  timestamp: Date;
}
