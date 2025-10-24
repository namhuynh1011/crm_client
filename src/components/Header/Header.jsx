import React from "react";
import "./Header.css";
import { FaBell } from "react-icons/fa";

const Header = () => {
  return (
    <header className="header">
      <h1>Dashboard</h1>
      <div className="header-actions">
        <FaBell className="icon" />
        <div className="user-avatar">N</div>
      </div>
    </header>
  );
};

export default Header;
