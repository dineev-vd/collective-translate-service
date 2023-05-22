import { GetSuggestionDto } from "common/dto/suggestion.dto";
import radioApi from "..";

const getSuggestionsEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getSuggestions: build.query<GetSuggestionDto[], string>({
      query: (segmentId) => ({
        url: `crud/translation/${segmentId}/suggestions`,
      }),
      providesTags: ["SUGGESTIONS"],
    }),
    suggest: build.mutation<void, { suggestion: string; segmentId: string }>({
      query: ({ suggestion, segmentId }) => ({
        url: `crud/translation/${segmentId}/suggest`,
        method: "POST",
        body: { suggestion },
      }),
      invalidatesTags: ["SUGGESTIONS"],
    }),
    approveSuggestion: build.mutation<void, string>({
      query: (suggestionId) => ({
        url: `crud/suggestions/${suggestionId}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["SUGGESTIONS"],
    }),
    denySuggestion: build.mutation<void, string>({
      query: (suggestionId) => ({
        url: `crud/suggestions/${suggestionId}/deny`,
        method: "POST",
      }),
      invalidatesTags: ["SUGGESTIONS"],
    }),
    voteForSuggestion: build.mutation<void, string>({
      query: (suggestionId) => ({
        url: `crud/suggestions/${suggestionId}/vote`,
        method: "POST",
      }),
      invalidatesTags: ["SUGGESTIONS"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSuggestionsQuery,
  useApproveSuggestionMutation,
  useDenySuggestionMutation,
  useSuggestMutation,
  useVoteForSuggestionMutation,
} = getSuggestionsEndpoint;
