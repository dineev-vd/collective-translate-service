import {
  BaseQueryFn,
  QueryReturnValue,
} from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
// import { setIsAuthenticated } from "../slices/authSlice";

export const API_URL =
  process.env.REACT_APP_API_ENDPOINT || "http://localhost:5000/api";

// const API_URL = "";
const baseQuery = fetchBaseQuery({ baseUrl: API_URL });

export const getAccessToken = () => localStorage.getItem("access_token");
export const setAccessToken = (token: string) => {
  localStorage.setItem("access_token", token);
};
export const clearAccessToken = () => localStorage.removeItem("access_token");

const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let response: QueryReturnValue<
    unknown,
    FetchBaseQueryError,
    FetchBaseQueryMeta
  >;

  const authHeader = getAccessToken()
    ? {
        Authorization: `Bearer ${getAccessToken()}`,
      }
    : {};

  if (typeof args === "string") {
    response = await baseQuery(
      { headers: authHeader, url: args },
      api,
      extraOptions
    );
  } else {
    response = await baseQuery(
      { ...args, headers: { ...args.headers, ...authHeader } },
      api,
      extraOptions
    );
  }

  if (response.error && response.error.status === 401) {
    // api.dispatch(setIsAuthenticated(false));
  }

  return response;
};

const radioApi = createApi({
  reducerPath: "radioApi",
  baseQuery: customBaseQuery,
  endpoints: () => ({}),
  tagTypes: ["COMMENTS", "NEWS", "ORDERS", "SUGGESTIONS", "TAGS"],
});

export default radioApi;
