import radioApi from "..";

export type Glossary = {
  id: string;
  language: {
    language: string;
  };
};

const getGlossariesExtension = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getGlossariesByProject: build.query<Glossary[], string>({
      query: (id) => ({
        url: `crud/project/${id}/glossaries`,
      }),
      //   providesTags: ["COMMENTS"],
      // providesTags: (comments) =>
      //   comments.map(({ id }) => ({ id, type: "COMMENTS" })),
    }),
  }),
  overrideExisting: false,
});

export const { useGetGlossariesByProjectQuery } = getGlossariesExtension;
