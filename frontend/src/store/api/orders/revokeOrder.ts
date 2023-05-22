import radioApi from "..";

const revokeOrderExtension = radioApi.injectEndpoints({
  endpoints: (build) => ({
    revokeOrder: build.mutation<void, string>({
      query: (orderId) => ({
        url: `crud/orders/${orderId}/revoke`,
        method: "POST",
      }),
      invalidatesTags: ["ORDERS"],
    }),
  }),
  overrideExisting: false,
});

export const { useRevokeOrderMutation } = revokeOrderExtension;
