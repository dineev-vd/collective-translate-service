import { Language } from "common/enums";
import radioApi from "..";

const getSimilarEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getSimilar: build.query<
      {
        translatedtext: string;
        originaltext: string;
        l2: number;
        originallng: Language;
        translatedlng: Language;
      }[],
      string
    >({
      query: (segmentId) => ({
        url: `crud/translation/${segmentId}/similar`,
      }),
      keepUnusedDataFor: 0,
    }),
  }),
  overrideExisting: false,
});

export const { useGetSimilarQuery } = getSimilarEndpoint;
