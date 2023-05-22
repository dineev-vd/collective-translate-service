import { configureStore } from "@reduxjs/toolkit";
import radioApi from "./api";
import translationsReducer from "./translate-piece-reducer";
import userReducer from "./userReducer";

export const store = configureStore({
  reducer: {
    userReducer,
    translationsReducer,
    [radioApi.reducerPath]: radioApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(radioApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
