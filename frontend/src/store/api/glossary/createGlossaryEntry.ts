import radioApi from "..";

export type NewGlossaryEntry = {
  glossaryId: string;
  phrase: string;
  description: string;
  proposedTranslation?: string;
};

const createGlossaryEntryEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    createGlossaryEntry: build.mutation<void, NewGlossaryEntry>({
      query: ({ glossaryId, ...body }) => ({
        url: `crud/glossary/${glossaryId}/entries`,
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useCreateGlossaryEntryMutation } = createGlossaryEntryEndpoint;
