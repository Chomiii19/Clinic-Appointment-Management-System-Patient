import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

type Role = "user" | "admin";

interface Props {
  allowedRoles: Role[];
  children: ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: Props) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle unauthorized access (go back)
  useEffect(() => {
    if (loading) return;

    if (currentUser && !allowedRoles.includes(currentUser.role as Role)) {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/");
      }
    }
  }, [currentUser, loading, allowedRoles, navigate]);

  if (loading) return null;

  // Not logged in → login (remember previous page)
  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Prevent flash while redirecting
  if (currentUser && !allowedRoles.includes(currentUser.role as Role)) {
    return null;
  }

  return children;
}
