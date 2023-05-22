import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetUserDto } from "common/dto/user.dto";
import { RootState } from "./store";

interface UserState {
  user: GetUserDto;
  shouldLogin: Boolean;
}

const initialState: UserState = {
  user: null,
  shouldLogin: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    setUser: (state, action: PayloadAction<GetUserDto>) => {
      state.user = action.payload;
    },
    setShouldLogin: (state, action: PayloadAction<Boolean>) => {
      state.shouldLogin = action.payload;
    },
  },
});

export const selectUser = (state: RootState) => state.userReducer.user;
export const selectShouldLogin = (state: RootState) =>
  state.userReducer.shouldLogin;

export const { logout, setUser, setShouldLogin } = userSlice.actions;

export default userSlice.reducer;
