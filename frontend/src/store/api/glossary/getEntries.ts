import radioApi from "..";

export type GlossaryEntry = {
  id: string;
  phrase: string;
  description: string;
  proposedTranslation?: string;
};

const getGlossaryEntriesExtension = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getGlossaryEntries: build.query<GlossaryEntry[], string>({
      query: (id) => ({
        url: `crud/glossary/${id}/entries`,
      }),
      //   providesTags: ["COMMENTS"],
      // providesTags: (comments) =>
      //   comments.map(({ id }) => ({ id, type: "COMMENTS" })),
    }),
  }),
  overrideExisting: false,
});

export const { useGetGlossaryEntriesQuery } = getGlossaryEntriesExtension;
