import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => action.payload,
    removeFeed: (state, action) => null,
    removeFeedUser: (state, action) => {
      if (!state?.usersData) return state;
      return {
        ...state,
        usersData: state.usersData.filter((u) => u._id !== action.payload),
      };
    },
  },
});

export const { addFeed, removeFeedUser } = feedSlice.actions;

export default feedSlice.reducer;
