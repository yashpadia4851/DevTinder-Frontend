import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
  name: "connections",
  initialState: {
    data: [],
    error: null,
  },
  reducers: {
    setConnections: (state, action) => {
      state.data = Array.isArray(action.payload) ? action.payload : [];
      state.error = null;
    },
  },
});

export const { setConnections } = connectionsSlice.actions;

export default connectionsSlice.reducer;
