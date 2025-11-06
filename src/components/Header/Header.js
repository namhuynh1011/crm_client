import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { logout as authLogout } from "../../services/Auth"; // optional: nếu có services/Auth.js

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      // Nếu bạn có function logout trong services/Auth, gọi nó để backend revoke token nếu cần
      if (typeof authLogout === "function") {
        // Nếu authLogout trả về Promise thì await, nếu không thì ok
        await authLogout();
      } else {
        // fallback: nothing
      }
    } catch (err) {
      // không block logout UI nếu revoke lỗi
      console.warn("Logout error (ignored):", err);
    } finally {
      // Xoá mọi key token/user có thể dùng trong project để đảm bảo logout thật sự
      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("access_token");
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("user");
        // nếu bạn dùng các key khác, thêm vào đây
      } catch (e) {
        console.warn("Error clearing localStorage during logout:", e);
      }

      setIsOpen(false);
      // điều hướng về trang đăng nhập
      navigate("/login", { replace: true });
    }
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
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={20} />
        </button>

        <button
          className="user-avatar"
          onClick={toggleDropdown}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          N
        </button>

        {isOpen && (
          <div className="dropdown-menu" role="menu">
            <p className="user-name">Nguyễn Văn</p>
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