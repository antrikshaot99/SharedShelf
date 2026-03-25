import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const authContext = useContext(AuthContext);
  
  // Still loading auth state
  if (authContext?.isLoading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>Loading...</div>;
  }

  // User not authenticated
  if (!authContext?.isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
}