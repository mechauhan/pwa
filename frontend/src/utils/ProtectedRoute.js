import React from "react";
import { Navigate, Outlet } from "react-router";
const ProtectedRoute = ({ authToken, children }) => {
  if (authToken) {
    return children ? children : <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};
export default ProtectedRoute;
