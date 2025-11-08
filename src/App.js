import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Dashboard from "./pages/system/Dashboard/Dashboard";
import Deals from "./pages/system/Deals/Deals";
import Customers from "./pages/system/Customers/Customers";
import Tasks from "./pages/system/Tasks/Tasks";
import DealDetail from "./pages/system/DealDetail/DealDetail";
import { CRMProvider } from "./context/CRMContext";
function App() {
  return (
    <CRMProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/system/deals" element={<Deals />} />
        <Route path="/system/deals/:id" element={<DealDetail />} />
        <Route path="/system/customers" element={<Customers />} />
        <Route path="/system/tasks" element={<Tasks />} />
      </Routes>
    </Router>
    </CRMProvider>
  );
}

export default App;
