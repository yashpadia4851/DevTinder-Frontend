import io from "socket.io-client";
import { APP_URL } from "./constants";

export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    return io(APP_URL);
  } else {
    return io("/", { path: "/api/socket.io" });
  }
};
