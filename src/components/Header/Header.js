import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/logo.png";
import { getCurrentUser } from "../../services/Auth"; // dùng getCurrentUser thay vì đọc token

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

function nameFromUser(user) {
  if (!user) return "Người dùng";
  if (user.fullName) return user.fullName;
  if (user.name) return user.name;
  if (user.email) {
    const local = user.email.split("@")[0];
    return local
      .replace(/[._]/g, " ")
      .split(" ")
      .map((s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : ""))
      .join(" ");
  }
  return user.id ? String(user.id).slice(0, 8) : "Người dùng";
}

const Header = () => {
  const [pageTitle, setPageTitle] = useState("CRM");
  const [displayName, setDisplayName] = useState("Người dùng");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const title = deriveTitleFromPath(location.pathname);
    setPageTitle(title);
    document.title = `${title} - CRM`;
  }, [location.pathname]);

  // Lấy user dùng service getCurrentUser() (thay vì parse token trực tiếp)
  useEffect(() => {
    let mounted = true;
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        if (!mounted) return;
        if (user) {
          const name = nameFromUser(user);
          setDisplayName(name);
          setAvatarUrl(user.avatar || null);
        }
      } catch (err) {
        // nếu lỗi, giữ giá trị mặc định; có thể log để debug
        console.warn("Header: getCurrentUser error", err);
      }
    };
    loadUser();

    // lắng nghe event tuỳ ý khi profile update (ProfilePage dispatch userUpdated)
    const onUserUpdated = async () => {
      try {
        const user = await getCurrentUser();
        if (!mounted) return;
        if (user) {
          setDisplayName(nameFromUser(user));
          setAvatarUrl(user.avatar || null);
        }
      } catch (e) {
        console.warn("Header: userUpdated handler error", e);
      }
    };
    window.addEventListener("userUpdated", onUserUpdated);

    return () => {
      mounted = false;
      window.removeEventListener("userUpdated", onUserUpdated);
    };
  }, []);

  return (
    <header className="header">
      <div className="logo-box" aria-hidden>
        <img src={logo} alt="Logo" style={{ width: 28, height: 28 }} />
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

          <div className="user-avatar" title={displayName} onClick={() => navigate("/profile")}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
            ) : (
              displayName ? displayName.charAt(0).toUpperCase() : "N"
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;