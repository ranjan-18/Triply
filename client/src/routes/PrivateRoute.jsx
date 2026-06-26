// src/routes/PrivateRoute.jsx

import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

/**
 * Route guard component.
 * Reads auth state from the persisted Zustand store.
 * Redirects to /login if no access token is present.
 *
 * @param {{ children: React.ReactNode }} props
 */
const PrivateRoute = ({ children }) => {
  const { accessToken } = useAuthStore();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;