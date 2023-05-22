import { GetShortUserDto } from "common/dto/user.dto";
import radioApi from "..";

export type NewsPost = {
  id: string;
  content: string;
  title: string;
  createdDate: string;
  updatedDate: string;
  author: GetShortUserDto;
};

const getNewsPostEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getNewsPost: build.query<NewsPost, string>({
      query: (id) => ({
        url: `crud/news/${id}`,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetNewsPostQuery } = getNewsPostEndpoint;
