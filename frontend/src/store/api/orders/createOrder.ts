import radioApi from "..";

export type NewOrder = {
  projectId: string;
  description: string;
};

const createOrderExtension = radioApi.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation<void, NewOrder>({
      query: ({ projectId, ...body }) => ({
        url: `crud/project/${projectId}/order`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ORDERS"],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateOrderMutation } = createOrderExtension;
