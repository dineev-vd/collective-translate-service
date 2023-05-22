import { GetProjectDto } from "common/dto/project.dto";
import radioApi from "..";

const getNewsEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query<
      GetProjectDto[],
      { query: string; tags: string[] }
    >({
      query: ({ query, tags }) => ({
        url: `crud/project`,
        params: {
          query: query ? query : undefined,
          tags: tags.length ? tags : undefined,
        },
      }),
      keepUnusedDataFor: 0,
    }),
  }),
  overrideExisting: false,
});

export const { useGetProjectsQuery } = getNewsEndpoint;
