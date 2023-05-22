import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  GetTranslationDto,
  PostTranslationDto,
} from "common/dto/translate-piece.dto";
import { RootState } from "./store";

export interface TranslationState {
  id: string;
  translationText: string;
  order: number;
  translationLanguageId: string;
  originalSegmentId?: string;
}

interface TranslationsState {
  translations: { [key: string]: TranslationState };
  changes: { [key: string]: PostTranslationDto };
}

const initialState: TranslationsState = {
  translations: {},
  changes: {},
};

export const translationsSlice = createSlice({
  name: "translations",
  initialState,
  reducers: {
    putTranslations: (state, action: PayloadAction<GetTranslationDto[]>) => {
      action.payload.forEach((translation) => {
        if (translation.original) {
          const { original, ...withoutOriginal } = translation;
          state.translations[original.id] = original;
          if (Object.keys(withoutOriginal).length > 0) {
            state.translations[translation.id] = {
              ...withoutOriginal,
              originalSegmentId: original.id,
            };
          }
          return;
        }

        state.translations[translation.id] = translation;
      });
    },
    clearTranslations: (state) => {
      state.translations = {};
    },
    putTranslationChanges: (
      state,
      action: PayloadAction<PostTranslationDto[]>
    ) => {
      action.payload.forEach((piece) => {
        state.changes[piece.id] = piece;
      });
    },
  },
});

export const selectTranslations = (state: RootState) =>
  state.translationsReducer.translations;
export const selectTranslationChanges = (state: RootState) =>
  state.translationsReducer.changes;

export const { putTranslations, clearTranslations, putTranslationChanges } =
  translationsSlice.actions;

export default translationsSlice.reducer;
