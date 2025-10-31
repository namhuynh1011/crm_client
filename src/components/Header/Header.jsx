import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Đăng xuất thành công!");
    navigate("/login");
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <h2 className="crm-title">CRM</h2>
      </div>

      <div className="header-right" ref={menuRef}>
        <button className="icon-btn">
          <Bell size={20} />
        </button>

        <div className="user-avatar" onClick={toggleDropdown}>
          N
        </div>

        {isOpen && (
          <div className="dropdown-menu">
            <p className="user-name">Nguyễn Văn </p>
            <hr />
            <button className="logout-btn" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
