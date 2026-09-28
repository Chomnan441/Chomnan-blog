import { Navigate, useLocation } from "react-router-dom";
import AuthLoadingScreen from "@/components/AuthLoadingScreen";
import { useAuth } from "@/context/AuthContext";

function RequireAuth({ children }) {
  const { user, authStatus } = useAuth();
  const location = useLocation();

  if (authStatus === "loading") {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default RequireAuth;
