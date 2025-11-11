import React from "react";
import "./Home.css";
import logo from "../../assets/logo.png";
const Home = () => {
  return (
    <div className="basecrm-root">
      <header className="basecrm-header">
        <img
          src={logo}
          alt="CRM Logo"
          className="basecrm-logo"
        />
        <nav>
          <a href="#" className="basecrm-nav-link">Hỗ Trợ</a>
          <a href="#" className="basecrm-nav-link">Tra Cứu</a>
          <a href="/login" className="basecrm-nav-link basecrm-login-btn">Đăng nhập
          </a>
        </nav>
      </header>

      <main className="basecrm-main">
        <section className="basecrm-info">
          <h1 className="basecrm-title">
            CRM Blockchain<br />Quản lý khách hàng hiện đại
          </h1>
          <p className="basecrm-desc">
            Gia tăng doanh số, tối ưu quy trình bán hàng và chăm sóc khách hàng với giải pháp CRM bảo mật, minh bạch trên nền tảng Blockchain.
          </p>
          <p className="basecrm-note">Trải nghiệm giải pháp quản lý khách hàng thông minh, an toàn, hiện đại.</p>
        </section>

      </main>

      <section className="basecrm-benefits">
        <h2>Tại sao chọn CRM Blockchain?</h2>
        <ul>
          <li>🔒 Bảo mật và minh bạch nhờ công nghệ Blockchain</li>
          <li>🚀 Quản lý khách hàng, giao dịch, hợp đồng tập trung</li>
          <li>🤝 Nâng cao trải nghiệm khách hàng và hiệu quả bán hàng</li>
          <li>📈 Phân tích dữ liệu, báo cáo thông minh</li>
        </ul>
      </section>
    </div>
  );
};

export default Home;