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

const getNewsEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getNews: build.query<NewsPost[], void>({
      query: () => ({
        url: `crud/news`,
      }),
      providesTags: ["NEWS"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetNewsQuery } = getNewsEndpoint;
