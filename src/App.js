// src/App.js (khi dùng ProtectedRoute)
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Deals from "./pages/system/Deals/Deals";
import Customers from "./pages/system/Customers/Customers";
import Tasks from "./pages/system/Tasks/Tasks";
import DealDetail from "./pages/system/DealDetail/DealDetail";
import { CRMProvider } from "./context/CRMContext";
import { Login, Dashboard, Home, ProfilePage } from "./pages";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <CRMProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/deals/:id" element={<DealDetail />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path='/profile' element={
          <ProtectedRoute requireAuth={true}>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute requireAuth={true}>
            <Dashboard />
          </ProtectedRoute>
        } />
        

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </CRMProvider>
  );
}

export default App;