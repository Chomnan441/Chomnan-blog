import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function RequireAdmin({ children }) {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RequireAdmin;
