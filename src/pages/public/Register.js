import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserAlt, FaLock, FaEnvelope } from "react-icons/fa";
import "../../index.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Kiểm tra nhập thiếu
    if (!name || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    // Lấy danh sách người dùng cũ (nếu có)
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Kiểm tra trùng email
    const userExists = users.find((u) => u.email === email);
    if (userExists) {
      setError("Email này đã được đăng ký!");
      return;
    }

    // Thêm người dùng mới vào mảng
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("✅ Đăng ký thành công!");
    navigate("/login");
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <img src="/logo192.png" alt="Logo" className="logo" />
        <h2>Đăng ký tài khoản</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Họ và tên</label>
            <div className="input-icon">
              <FaUserAlt className="icon" />
              <input
                type="text"
                placeholder="Nhập họ và tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email</label>
            <div className="input-icon">
              <FaEnvelope className="icon" />
              <input
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <div className="input-icon">
              <FaLock className="icon" />
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Xác nhận mật khẩu</label>
            <div className="input-icon">
              <FaLock className="icon" />
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-register">
            Đăng ký
          </button>
        </form>

        <p className="text-note">
          Đã có tài khoản?{" "}
          <Link to="/login" className="link">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
