import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = () => {
  const { authStatus, verifySession } = useAuth();

  useEffect(() => {
    console.log("[ProtectedRoute] Mounted, calling verifySession");
    verifySession();
  }, [verifySession]);

  if (authStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
