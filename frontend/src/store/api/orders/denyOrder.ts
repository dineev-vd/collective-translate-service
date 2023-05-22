import radioApi from "..";

type AcceptParams = {
  userId: string;
  orderId: string;
};

const applyOrderExtension = radioApi.injectEndpoints({
  endpoints: (build) => ({
    denyOrder: build.mutation<void, AcceptParams>({
      query: ({ orderId, userId }) => ({
        url: `crud/orders/${orderId}/deny/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["ORDERS"],
    }),
  }),
  overrideExisting: false,
});

export const { useDenyOrderMutation } = applyOrderExtension;
