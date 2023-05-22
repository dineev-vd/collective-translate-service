import { GetShortUserDto } from "common/dto/user.dto";
import radioApi from "..";

export type Comment = {
  id: string;
  comment: string;
  createdDate: string;
  updatedDate: string;
  author: GetShortUserDto;
};

export type GetCommentsParams = {
  type: "news" | "translation" | "glossary";
  id: string;
};

const getNewsPostEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getComments: build.query<Comment[], GetCommentsParams>({
      query: ({ id, type }) => ({
        url: `crud/${type}/${id}/comments`,
      }),
      providesTags: ["COMMENTS"],
      // providesTags: (comments) =>
      //   comments.map(({ id }) => ({ id, type: "COMMENTS" })),
    }),
  }),
  overrideExisting: false,
});

export const { useGetCommentsQuery } = getNewsPostEndpoint;
