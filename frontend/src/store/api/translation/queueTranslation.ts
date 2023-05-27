import radioApi from "..";

export type JobResult = {
  id: string;
  status: number;
  text: string;
};

const queueTranslationEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    queueTranslation: build.mutation<
      void,
      { translationId: string; type: string }
    >({
      query: ({ translationId, type }) => ({
        url: `scheduler/translate/${translationId}/queueTranslation`,
        method: "POST",
        params: { type },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useQueueTranslationMutation } = queueTranslationEndpoint;
