import axiosInstance from "./axiosInstance";

export const fetchReceivedRequests = async () => {
  const { data } = await axiosInstance.get("/user/requests/received");
  return data?.data ?? data ?? [];
};

export const reviewRequest = async (status, requestId) => {
  await axiosInstance.post(`/request/review/${status}/${requestId}`, {});
};
