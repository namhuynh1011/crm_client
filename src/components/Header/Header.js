import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/logo.png";
/**
 * Giải mã payload JWT (browser safe). Trả về object payload hoặc null.
 */
function parseJwt(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const jsonPayload = decodeURIComponent(
      atob(payload)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    // nếu parse lỗi thì trả null
    return null;
  }
}

/**
 * Tạo tên hiển thị từ payload JWT
 */
function displayNameFromPayload(payload) {
  if (!payload) return "Người dùng";
  // ưu tiên các trường tên phổ biến
  if (payload.name) return payload.name;
  if (payload.fullName) return payload.fullName;
  if (payload.username) return payload.username;
  if (payload.email) {
    const local = payload.email.split("@")[0];
    return local
      .replace(/[._]/g, " ")
      .split(" ")
      .map((s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : ""))
      .join(" ");
  }
  return payload.id ? String(payload.id).slice(0, 8) : "Người dùng";
}

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

const deriveTitleFromPath = (pathname) => {
  const path = pathname.split("?")[0].split("#")[0];
  const segments = path.split("/").filter(Boolean);

  if (path === "/" || path === "" || path === "/dashboard") return "Dashboard";
  if (segments[0] === "system" && segments[1] === "deals") {
    if (segments.length === 2) return "Deals";
    return "Deal Details";
  }
  if (segments[0] === "system" && segments[1] === "customers") {
    if (segments.length === 2) return "Customers";
    return "Customer Details";
  }
  if (segments[0] === "system" && segments[1] === "tasks") return "Tasks";
  if (segments[0] === "settings") return "Settings";
  if (segments[0] === "profile") return "Profile";

  if (segments.length > 0) {
    return segments.map((s) => capitalize(s.replace(/[-_]/g, " "))).join(" / ");
  }

  return "CRM";
};

const Header = () => {
  const [pageTitle, setPageTitle] = useState("CRM");
  const [displayName, setDisplayName] = useState("Người dùng");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const title = deriveTitleFromPath(location.pathname);
    setPageTitle(title);
    document.title = `${title} - CRM`;
  }, [location.pathname]);

  useEffect(() => {
    // đọc token từ localStorage (hỗ trợ nhiều key tên khác nhau)
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("token") ||
      null;

    const payload = parseJwt(token);
    const name = displayNameFromPayload(payload);
    setDisplayName(name);
  }, []);

  return (
    <header className="header">
      <div className="logo-box" aria-hidden>
        <span className="logo-icon">🌿</span>
      </div>

      <div className="header-inner">
        <div className="header-left">
          <div className="title-area">
            <h2 className="page-title">{pageTitle}</h2>
          </div>
        </div>

        <div className="header-right">
          <button
            className="icon-btn"
            aria-label="Notifications"
            title="Notifications"
            onClick={() => {
              /* nếu cần mở panel thông báo, handle ở đây */
            }}
          >
            <Bell size={20} />
          </button>

          {/* tên hiển thị giữa notification và avatar */}
          <div className="user-name">{displayName}</div>

          <div
            className="user-avatar"
          >
            {displayName ? displayName.charAt(0).toUpperCase() : "N"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;