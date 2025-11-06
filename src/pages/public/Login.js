import React, { useEffect, useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import "../../index.css";
import logo from "../../assets/logo.png";
import { login, getCurrentUser, isTokenExpired } from "../../services/Auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Nếu đã đăng nhập và token còn hiệu lực -> redirect sang /dashboard
  useEffect(() => {
    const user = getCurrentUser();
    const token = localStorage.getItem("accessToken");
    if (user && token && !isTokenExpired(token)) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("handleSubmit called", { email });
    try {
      const result = await login({ email, password });
      console.log("login result:", result);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = err?.message || err?.raw?.msg || "Đăng nhập thất bại. Vui lòng thử lại.";
      setError(msg);
    } finally {
      setLoading(false);
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

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        {/* <div className="login-help">
          <p>
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Login;