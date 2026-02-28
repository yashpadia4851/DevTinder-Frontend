// src/utils/requestSlice.js
import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "request",
  initialState: [],
  reducers: {
    setRequest: (state, action) => {
      return action.payload;
    },
    clearRequest: () => {
      return [];
    },
  },
});

export const { setRequest, clearRequest } = requestSlice.actions;
export default requestSlice.reducer;