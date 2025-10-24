import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";
import logo from "../../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // 👈 Hook điều hướng

  const handleSubmit = (e) => {
    e.preventDefault();

    // Giả lập kiểm tra đăng nhập
    if (email === "admin@crm.com" && password === "123456") {
      setError("");
      navigate("/dashboard"); // ✅ chuyển hướng
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
      </div>
    </div>
  );
};

export default Login;
