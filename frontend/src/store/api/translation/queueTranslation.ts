import radioApi from "..";

export type JobResult = {
  id: string;
  status: number;
  text: string;
};

const queueTranslationEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    queueTranslation: build.mutation<void, string>({
      query: (id) => ({
        url: `scheduler/translate/${id}/queueTranslation`,
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useQueueTranslationMutation } = queueTranslationEndpoint;
