import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    setFeed: (state, action) => action.payload,
    removeFeedUser: (state, action) => {
      if (!state?.usersData) return state;
      return {
        ...state,
        usersData: state.usersData.filter((u) => u._id !== action.payload),
      };
    },
  },
});

export const { setFeed, removeFeedUser } = feedSlice.actions;
export default feedSlice.reducer;
