import { Navigate, useLocation } from "react-router-dom";
import AuthLoadingScreen from "@/components/AuthLoadingScreen";
import { useAuth } from "@/context/AuthContext";

function RequireAdmin({ children }) {
  const { user, isAdmin, authStatus } = useAuth();
  const location = useLocation();

  if (authStatus === "loading") {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RequireAdmin;
