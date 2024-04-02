import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TokenState {
  accessToken: null | string;
  refreshToken: null | string;
  expiredAt: null | number;
}

const initialState: TokenState = {
  accessToken: null,
  refreshToken: null,
  expiredAt: null,
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    saveToken: (state, action: PayloadAction<TokenState>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expiredAt = action.payload.expiredAt;
    },
    saveAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    removeToken: (state) => {
      (state.accessToken = null),
        (state.refreshToken = null),
        (state.expiredAt = null);
    },
  },
});

export const { saveToken, saveAccessToken, removeToken } = tokenSlice.actions;

export default tokenSlice.reducer;
