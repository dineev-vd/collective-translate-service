import radioApi from "..";
import { GetCommentsParams } from "./getNewsComments";

export type NewNewsPost = GetCommentsParams & {
  text: string;
};

const createPostEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    postComment: build.mutation<void, NewNewsPost>({
      query: ({ id, type, ...body }) => ({
        url: `crud/${type}/${id}/comments`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["COMMENTS"],
    }),
  }),
  overrideExisting: false,
});

export const { usePostCommentMutation } = createPostEndpoint;
