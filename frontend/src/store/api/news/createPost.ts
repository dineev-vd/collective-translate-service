import radioApi from "..";

export type NewNewsPost = {
  content: Object;
  title: string;
};

const createPostEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    createPost: build.mutation<void, NewNewsPost>({
      query: ({ content, ...rest }) => ({
        url: `crud/news`,
        method: "POST",
        body: { content: JSON.stringify(content), ...rest },
      }),
      invalidatesTags: ["NEWS"],
    }),
  }),
  overrideExisting: false,
});

export const { useCreatePostMutation } = createPostEndpoint;
