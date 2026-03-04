import { createSlice } from "@reduxjs/toolkit";

const USER_STORAGE_KEY = "devtinder_user";

const getInitialUser = () => {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const userSlice = createSlice({
  name: "user",
  initialState: getInitialUser(),
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;
      try {
        if (user) {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } else {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      } catch (e) {
        console.warn("Failed to persist user", e);
      }
      return user;
    },
    clearUser: () => {
      try {
        localStorage.removeItem(USER_STORAGE_KEY);
      } catch (e) {
        console.warn("Failed to clear user", e);
      }
      return null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
