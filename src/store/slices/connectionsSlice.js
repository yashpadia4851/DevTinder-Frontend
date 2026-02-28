import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
  name: "connections",
  initialState: null,
  reducers: {
    setConnections: (state, action) => action.payload,
  },
});

export const { setConnections } = connectionsSlice.actions;
export default connectionsSlice.reducer;
