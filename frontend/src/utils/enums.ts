export enum Language {
  RUSSIAN = "ru",
  ENGLISH = "en",
  GERMAN = "de",
}

export enum FileStatus {
  PROCESSING,
  SPLITTED,
  NEW,
}

export enum SegmentStatus {
  NEW = "new",
  TRANSLATED = "translated",
  // LOCKED = 'locked',
}

export function segmentStatusToText(status: SegmentStatus) {
  switch (status) {
    // case SegmentStatus.LOCKED:
    //   return "Заблокирован";

    case SegmentStatus.NEW:
      return "Новый";

    case SegmentStatus.TRANSLATED:
      return "Переведен";

    default:
      return "";
  }
}
