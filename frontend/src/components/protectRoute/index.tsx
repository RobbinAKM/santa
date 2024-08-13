// ProtectedRoute.tsx
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../../context/userContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute component wraps its children and ensures that only authenticated users can access them.
 * If the user is not authenticated (i.e., no user ID is present in context), it redirects to the homepage.
 * @param {ProtectedRouteProps} props - The properties passed to the component, including children elements.
 * @returns {JSX.Element} - Renders children if authenticated, otherwise redirects to the homepage.
 */

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { userContext } = useUserContext();
  if (!userContext?.id) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
