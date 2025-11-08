import React from "react";
import { NavLink } from "react-router-dom";
import { FaUserFriends, FaHandshake, FaTasks, FaChartPie } from "react-icons/fa";
import "./Sidebar.css";
import logo from "../../assets/logo.png";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="CRM Logo" />
        <h2>CRM</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="nav-item">
          <FaChartPie /> Dashboard
        </NavLink>
        <NavLink to="/system/customers" className="nav-item">
          <FaUserFriends /> Customers
        </NavLink>
        <NavLink to="/system/deals" className="nav-item">
          <FaHandshake /> Deals
        </NavLink>
        <NavLink to="/system/tasks" className="nav-item">
          <FaTasks /> Tasks
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
