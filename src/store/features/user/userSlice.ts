import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  id: null | string;
  nickname: null | string;
}

const initialState: UserState = {
  id: null,
  nickname: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.nickname = action.payload.nickname;
    },
    removeUser: (state) => {
      (state.id = null), (state.nickname = null);
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
