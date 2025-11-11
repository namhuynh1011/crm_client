import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUserFriends,
  FaHandshake,
  FaTasks,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { MdSpaceDashboard, MdOutlineLogout } from "react-icons/md";
import "./Sidebar.css";

/* parse jwt payload */
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
  } catch {
    return null;
  }
}

function displayRoleFromPayload(payload) {
  if (!payload) return "Người dùng";
  const role = payload.role;
  if (!role) return "Người dùng";

  const roleStr = String(role).replace(/[-_]+/g, " ").trim();

  const titled = roleStr
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
    .join(" ");

  return titled || "Người dùng";
}
function displayNameFromPayload(payload) {
  if (!payload) return "Người dùng";
  if (payload.fullName) return payload.fullName;
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

const Sidebar = () => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(() => {
    try {
      const raw = localStorage.getItem("sidebarCollapsed");
      return raw ? JSON.parse(raw) : false;
    } catch {
      return false;
    }
  });

  const [displayName, setDisplayName] = useState("Người dùng");
  const [avatarInitial, setAvatarInitial] = useState("U");
  const [role, setRole] = useState("Người dùng");

  useEffect(() => {
    try {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
      if (collapsed) document.body.classList.add("sidebar-collapsed");
      else document.body.classList.remove("sidebar-collapsed");
    } catch {}
  }, [collapsed]);

  useEffect(() => {
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("token") ||
      null;
    const payload = parseJwt(token);
    const name = displayNameFromPayload(payload);
    const role = displayRoleFromPayload(payload);
    setRole(role);
    setDisplayName(name);
    setAvatarInitial(name ? name.charAt(0).toUpperCase() : "U");
  }, []);

  const toggleCollapsed = () => setCollapsed((c) => !c);

  const handleLogout = () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("user");
    } catch {}
    document.body.classList.remove("sidebar-collapsed");
    navigate("/login", { replace: true });
  };

  const goToProfile = () => navigate("/profile");

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`} role="navigation" aria-expanded={!collapsed}>
      <button
        className="collapse-handle"
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Mở sidebar" : "Thu gọn sidebar"}
        title={collapsed ? "Mở" : "Thu gọn"}
      >
        {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
      </button>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="nav-icon" aria-hidden><MdSpaceDashboard /></span>
          <span className="nav-label">Dashboard</span>
        </NavLink>

        <NavLink to="/system/customers" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="nav-icon" aria-hidden><FaUserFriends /></span>
          <span className="nav-label">Customers</span>
        </NavLink>

        <NavLink to="/system/deals" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="nav-icon" aria-hidden><FaHandshake /></span>
          <span className="nav-label">Deals</span>
        </NavLink>

        <NavLink to="/system/tasks" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="nav-icon" aria-hidden><FaTasks /></span>
          <span className="nav-label">Tasks</span>
        </NavLink>
      </nav>

      {/* Footer: top row (avatar + name/role) ; bottom row (logout) */}
      <div className="sidebar-footer" role="contentinfo">
        <div className="footer-top" onClick={goToProfile} title={`Profile: ${displayName}`}>
          <div className="user-avatar-sm" aria-hidden>{avatarInitial}</div>
          <div className="footer-info">
            <div className="user-name">{displayName}</div>
            <div className="user-role">{role}</div>
          </div>
        </div>

        <div className="footer-bottom">
          <button className="logout-btn-sidebar" onClick={handleLogout} title="Đăng xuất" aria-label="Đăng xuất">
            <MdOutlineLogout className="logout-icon" />
            <span className="logout-label">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;