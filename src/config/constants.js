export const APP_URL =
  location.hostname === "localhost" ? "http://localhost:3000" : "/api";

export const ROUTES = {
  LOGIN: "/login",
  FEED: "/feed",
  PROFILE: "/profile",
  CONNECTIONS: "/connections",
  REQUESTS: "/request",
};
