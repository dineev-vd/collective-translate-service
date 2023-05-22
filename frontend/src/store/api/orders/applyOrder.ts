import radioApi from "..";

const applyOrderExtension = radioApi.injectEndpoints({
  endpoints: (build) => ({
    applyOrder: build.mutation<void, string>({
      query: (orderId) => ({
        url: `crud/orders/${orderId}/apply`,
        method: "POST",
      }),
      invalidatesTags: ["ORDERS"],
    }),
  }),
  overrideExisting: false,
});

export const { useApplyOrderMutation } = applyOrderExtension;
