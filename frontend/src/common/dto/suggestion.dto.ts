import { GetUserDto } from "./user.dto";

export class GetSuggestionDto {
  id: string;
  suggestion: string;
  author: GetUserDto;
  votersIds: string[];
}
