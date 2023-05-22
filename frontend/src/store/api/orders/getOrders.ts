import { GetProjectDto } from "common/dto/project.dto";
import radioApi from "..";

export type Order = {
  id: string;
  description: string;
  projectId: string;
  applied: boolean;
  project: GetProjectDto;
};

const getOrdersEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query<Order[], { query: string; tags: string[] }>({
      query: ({ query, tags }) => ({
        url: `crud/orders`,
        params: {
          query: query || undefined,
          tags: tags.length ? tags : undefined,
        },
      }),
      providesTags: ["ORDERS"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetOrdersQuery } = getOrdersEndpoint;
