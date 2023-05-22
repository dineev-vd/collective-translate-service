import radioApi from "..";

export type Tag = {
  id: string;
};

const getTagsEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getTags: build.query<Tag[], string>({
      query: (query) => ({
        url: `crud/tags`,
        params: { query },
      }),
      providesTags: ["TAGS"],
      keepUnusedDataFor: 0,
    }),
  }),
  overrideExisting: false,
});

export const { useGetTagsQuery } = getTagsEndpoint;
