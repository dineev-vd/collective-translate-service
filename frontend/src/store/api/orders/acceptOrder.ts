import radioApi from "..";

type AcceptParams = {
  userId: string;
  orderId: string;
};

const applyOrderExtension = radioApi.injectEndpoints({
  endpoints: (build) => ({
    acceptOrder: build.mutation<void, AcceptParams>({
      query: ({ orderId, userId }) => ({
        url: `crud/orders/${orderId}/accept/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["ORDERS"],
    }),
  }),
  overrideExisting: false,
});

export const { useAcceptOrderMutation } = applyOrderExtension;
