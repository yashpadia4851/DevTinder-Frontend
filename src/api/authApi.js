import axiosInstance from "./axiosInstance";

function extractUser(data) {
  if (!data || typeof data !== "object") return null;
  if (data._id) return data;
  if (data.data && typeof data.data === "object" && data.data._id) return data.data;
  if (data.user && typeof data.user === "object" && data.user._id) return data.user;
  if (Array.isArray(data) && data[0]?._id) return data[0];
  if (Array.isArray(data.data) && data.data[0]?._id) return data.data[0];
  return null;
}

export const login = async (emailId, password) => {
  const { data } = await axiosInstance.post("/login", { emailId, password });
  return extractUser(data) ?? data?.data ?? data;
};

export const signup = async (formData) => {
  const { data } = await axiosInstance.post("/signup", formData);
  let user = extractUser(data);
  if (!user && data) {
    user = data?.data ?? data?.user ?? (typeof data === "object" && data._id ? data : null);
  }
  if (!user) {
    console.warn("[authApi] signup: could not extract user from response", {
      type: typeof data,
      keys: data && typeof data === "object" ? Object.keys(data) : null,
      sample: data && typeof data === "object" ? JSON.stringify(data).slice(0, 200) : data,
    });
    return null;
  }
  return user;
};

export const signupAndLogin = async (formData) => {
  await axiosInstance.post("/signup", formData);
  const user = await login(formData.emailId, formData.password);
  return user;
};

export const logout = async () => {
  await axiosInstance.post("/logout", {});
};
