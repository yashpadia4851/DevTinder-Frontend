import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "request",
  initialState: [],
  reducers: {
    setRequests: (state, action) => action.payload,
    clearRequests: () => [],
  },
});

export const { setRequests, clearRequests } = requestSlice.actions;
export default requestSlice.reducer;
