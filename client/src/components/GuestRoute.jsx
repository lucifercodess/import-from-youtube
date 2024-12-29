import { useUser } from "@/context/authContext";
import React from "react";
import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const { user } = useUser();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default GuestRoute;
