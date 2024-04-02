import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UuidState {
  uuid: string | null;
}

const initialState: UuidState = {
  uuid: null,
};

export const UuidSlice = createSlice({
  name: "uuid",
  initialState,
  reducers: {
    saveUUID: (state, action: PayloadAction<string>) => {
      state.uuid = action.payload;
    },
    removeUUID: (state) => {
      state.uuid = null;
    },
  },
});

export const { saveUUID, removeUUID } = UuidSlice.actions;

export default UuidSlice.reducer;
