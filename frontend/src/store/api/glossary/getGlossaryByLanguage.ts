import radioApi from "..";

export type Glossary = {
  id: string;
  entries: GlossaryEntry[];
};

export type GlossaryEntry = {
  id: string;
  phrase: string;
  description: string;
  proposedTranslation?: string;
};

const getGlossaryEntriesExtension = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getGlossaryByLanguage: build.query<Glossary, string>({
      query: (id) => ({
        url: `crud/language/${id}/glossary`,
      }),
      //   providesTags: ["COMMENTS"],
      // providesTags: (comments) =>
      //   comments.map(({ id }) => ({ id, type: "COMMENTS" })),
    }),
  }),
  overrideExisting: false,
});

export const { useGetGlossaryByLanguageQuery } = getGlossaryEntriesExtension;
