import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import feedReducer from "./feedSlice";
import connectionsReducer from "./connectionsSlice";
import requestReducer from "./requestSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionsReducer,
    request: requestReducer,
  },
});

export default appStore;