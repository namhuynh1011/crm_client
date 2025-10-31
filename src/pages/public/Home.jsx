import React from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";


const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Nếu bạn lưu thông tin người dùng trong localStorage, xóa nó
    localStorage.removeItem("user");

    alert("Đăng xuất thành công!");
    navigate("/login");
  };

  return (
    <div className="home-container">
      <div className="navbar">
        <h2 className="logo">CRM Dashboard</h2>
        <button className="btn-logout" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>

      <div className="content">
        <h1>Chào mừng bạn đến với hệ thống CRM</h1>
        <p>Đây là trang chính sau khi đăng nhập.</p>
      </div>
    </div>
  );
};

export default Home;
