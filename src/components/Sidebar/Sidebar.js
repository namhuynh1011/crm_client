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
import { logout, getCurrentUser } from "../../services/Auth";

/* helpers */
function titleCaseRole(role) {
  if (!role) return "Người dùng";
  const roleStr = String(role).replace(/[-_]+/g, " ").trim();
  return roleStr
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
    .join(" ");
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
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [roleLabel, setRoleLabel] = useState("Người dùng");

  useEffect(() => {
    try {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
      if (collapsed) document.body.classList.add("sidebar-collapsed");
      else document.body.classList.remove("sidebar-collapsed");
    } catch {}
  }, [collapsed]);

  // Load user once and listen for updates from other parts of the app
  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        if (!mounted) return;
        if (user) {
          const name = user.fullName || user.name || (user.email ? user.email.split("@")[0] : "Người dùng");
          const formattedName = String(name)
            .replace(/[._]/g, " ")
            .split(" ")
            .map((s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : ""))
            .join(" ");
          setDisplayName(formattedName || "Người dùng");
          setAvatarInitial(formattedName ? formattedName.charAt(0).toUpperCase() : "U");
          setAvatarUrl(user.avatar || null);
          setRoleLabel(titleCaseRole(user.role));
        }
      } catch (e) {
        // fallback: try read cached currentUser from localStorage
        try {
          const raw = localStorage.getItem("currentUser");
          if (raw) {
            const user = JSON.parse(raw);
            const name = user.fullName || user.name || (user.email ? user.email.split("@")[0] : "Người dùng");
            const formattedName = String(name)
              .replace(/[._]/g, " ")
              .split(" ")
              .map((s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : ""))
              .join(" ");
            setDisplayName(formattedName || "Người dùng");
            setAvatarInitial(formattedName ? formattedName.charAt(0).toUpperCase() : "U");
            setAvatarUrl(user.avatar || null);
            setRoleLabel(titleCaseRole(user.role));
          }
        } catch {}
      }
    };

    loadUser();

    const onUserUpdated = () => {
      loadUser();
    };
    window.addEventListener("userUpdated", onUserUpdated);

    return () => {
      mounted = false;
      window.removeEventListener("userUpdated", onUserUpdated);
    };
  }, []);

  const toggleCollapsed = () => setCollapsed((c) => !c);

  const handleLogout = () => {
    try {
      logout();
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

      <nav className="sidebar-nav" aria-label="Main navigation">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="nav-icon" aria-hidden><MdSpaceDashboard /></span>
          <span className="nav-label">Dashboard</span>
        </NavLink>

        <NavLink to="/customers" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="nav-icon" aria-hidden><FaUserFriends /></span>
          <span className="nav-label">Customers</span>
        </NavLink>

        <NavLink to="/deals" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="nav-icon" aria-hidden><FaHandshake /></span>
          <span className="nav-label">Deals</span>
        </NavLink>

        <NavLink to="/tasks" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="nav-icon" aria-hidden><FaTasks /></span>
          <span className="nav-label">Tasks</span>
        </NavLink>
        <NavLink to="/empployee" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="nav-icon" aria-hidden><FaUserFriends /></span>
          <span className="nav-label">Employee</span>
        </NavLink>
      </nav>

      {/* Footer: top row (avatar + name/role) ; bottom row (logout) */}
      <div className="sidebar-footer" role="contentinfo">
        <button
          className="footer-top"
          onClick={goToProfile}
          title={`Profile: ${displayName}`}
          aria-label={`Xem hồ sơ ${displayName}`}
        >
          {avatarUrl ? (
            <img className="user-avatar-sm-img" src={avatarUrl} alt={displayName} />
          ) : (
            <div className="user-avatar-sm" aria-hidden>{avatarInitial}</div>
          )}

          <div className="footer-info" aria-hidden={collapsed}>
            <div className="user-name">{displayName}</div>
            <div className="user-role">{roleLabel}</div>
          </div>
        </button>

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