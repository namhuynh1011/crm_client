// src/App.js (khi dùng ProtectedRoute)
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login, Dashboard, Home } from "./pages";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard không yêu cầu auth */}
        <Route path="/dashboard" element={
          <ProtectedRoute requireAuth={false}>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Một route được bảo vệ ví dụ */}
        <Route path="/private" element={
          <ProtectedRoute requireAuth={true}>
            {/* component private */}
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;