import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../index.css";
import logo from "../../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Lấy danh sách user từ LocalStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Tìm người dùng khớp email và password
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      setError("");
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      alert("Đăng nhập thành công!");
      navigate("/dashboard");
    } else {
      setError("❌ Email hoặc mật khẩu không đúng!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="CRM Logo" className="logo" />
        <h2>Đăng nhập hệ thống CRM</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn-login">
            Đăng nhập
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
