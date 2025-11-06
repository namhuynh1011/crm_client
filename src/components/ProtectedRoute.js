import React from "react";
import { Navigate } from "react-router-dom";
import { getAccessToken, isTokenExpired, getCurrentUser } from "../services/Auth";

/**
 * ProtectedRoute (React Router v6)
 * - children: component sẽ render nếu user hợp lệ
 * - Nếu không có token / token hết hạn => redirect về /login
 */
const ProtectedRoute = ({ children }) => {
  const token = getAccessToken();
  const user = getCurrentUser();

  if (!token || !user || isTokenExpired(token)) {
    // có thể lưu redirectTo để quay lại trang yêu cầu sau khi login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;