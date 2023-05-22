import radioApi from "..";

export type JobResult = {
  id: string;
  status: number;
  text: string;
};

const jobResultsEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getJobResults: build.query<JobResult[], string>({
      query: (id) => ({
        url: `crud/translation/${id}/jobresults`,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetJobResultsQuery } = jobResultsEndpoint;
