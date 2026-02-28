import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../api/userApi";
import { clearUser, setUser } from "../store/slices/userSlice";
import { ROUTES } from "../config/constants";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [authStatus, setAuthStatus] = useState("idle"); // idle | loading | authenticated | unauthenticated

  const verifySession = useCallback(async () => {
    setAuthStatus("loading");

    if (user) {
      console.log("[useAuth] User already in Redux, skipping API verification", user._id);
      setAuthStatus("authenticated");
      return true;
    }

    try {
      console.log("[useAuth] No user in Redux, fetching profile from API");
      const profileData = await fetchProfile();
      if (profileData) {
        console.log("[useAuth] Profile fetched successfully", profileData._id);
        dispatch(setUser(profileData));
        setAuthStatus("authenticated");
        return true;
      }
    } catch (err) {
      const status = err?.response?.status;
      console.log("[useAuth] fetchProfile failed", { status, message: err?.message });
      if (status === 401) {
        dispatch(clearUser());
        setAuthStatus("unauthenticated");
        navigate(ROUTES.LOGIN);
        return false;
      }
    }
    setAuthStatus("unauthenticated");
    return false;
  }, [dispatch, navigate, user]);

  const signOut = useCallback(async () => {
    dispatch(clearUser());
    navigate(ROUTES.LOGIN);
  }, [dispatch, navigate]);

  return {
    user,
    authStatus,
    isAuthenticated: authStatus === "authenticated",
    isLoading: authStatus === "loading",
    verifySession,
    signOut,
  };
};
