import radioApi from "..";

export type Order = {
  id: string;
  description: string;
  applicants: { name: string; email: string; id: string }[];
};

const getOrdersEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getOrderByProject: build.query<Order, string>({
      query: (projectId) => ({
        url: `crud/project/${projectId}/order`,
      }),
      providesTags: ["ORDERS"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetOrderByProjectQuery } = getOrdersEndpoint;
