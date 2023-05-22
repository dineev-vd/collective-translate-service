import { Language } from "../enums";
import { GetProjectDto } from "./project.dto";
import { GetTranslationDto } from "./translate-piece.dto";

export class GetTranslateLanguage {
  id: string;
  name: string;
  language: Language;
  translationSegments: GetTranslationDto[];
  original: boolean;
  all?: number;
  translated?: number;
}

export class PostTranslateLanguage {
  language: Language;
}

export class GetTranslateLanguageWithProject extends GetTranslateLanguage {
  project: GetProjectDto;
}
