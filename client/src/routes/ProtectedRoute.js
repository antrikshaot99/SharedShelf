import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute: Requires authentication
 * Redirects to /login if not authenticated
 */
export const ProtectedRoute = ({ children, isLoggedIn }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

/**
 * AdminRoute: Requires admin role
 * Redirects to /dashboard if not admin
 */
export const AdminRoute = ({ children, userRole }) => {
  if (userRole !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

/**
 * PublicRoute: Redirects authenticated users away from public pages
 * (e.g., redirect logged-in users away from /login)
 */
export const PublicRoute = ({ children, isLoggedIn, redirectTo = "/dashboard" }) => {
  if (isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
};
