import { FileStatus } from "common/enums";

export class ShortFileDto {
  id: string;
  name: string;
  status: FileStatus;
  all?: number;
  translated?: number;
}

export type PeekFileDto = {
  text: { marked: boolean; text: string }[];
};
