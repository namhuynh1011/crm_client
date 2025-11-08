// src/pages/system/Dashboard/Dashboard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import Sidebar from "../../../components/Sidebar/Sidebar";
import Header from "../../../components/Header/Header";
import { useCRM } from "../../../context/CRMContext";
import AddCustomerModal from "../../../components/modals/AddCustomerModal";
import AddDealModal from "../../../components/modals/AddDealModal";
import "./Dashboard.css";
import { FiSearch, FiChevronRight } from "react-icons/fi";

const Dashboard = () => {
  const { customers, deals } = useCRM();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Header />

        {/* TOP BAR */}
        <div className="dashboard-topbar">
          <div className="topbar-left">
            <div className="add-new-wrapper">
              <button
                className="add-new-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Add New +
              </button>

              {/* DROPDOWN */}
              {showDropdown && (
                <div className="add-new-dropdown">
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setShowDealModal(true);
                      setShowDropdown(false);
                    }}
                  >
                    <span className="icon deal-icon" />
                    Deal
                    <FiChevronRight />
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setShowCustomerModal(true);
                      setShowDropdown(false);
                    }}
                  >
                    <span className="icon customer-icon" />
                    Customer
                    <FiChevronRight />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="topbar-right">
            <button className="search-btn">
              <FiSearch />
            </button>
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User"
              className="user-avatar"
            />
          </div>
        </div>

        {/* BODY GRID */}
        <div className="dashboard-grid">
          {/* CỘT 1 */}
          <div className="col">
            {/* Next Appointment */}
            <div className="card appointment-card">
              <div className="appointment-header">
                <h3>Next Appointment</h3>
                <div className="dot" />
              </div>
              <div className="appointment-address">
                <div className="circle">319 Haul Road</div>
                <p className="city">Glenrock, WY 12345</p>
              </div>
              <p className="date-line">
                Appointment Date: <strong>Nov 18 2021, 17:00</strong>
              </p>
              <div className="appointment-details">
                <div>
                  <p>Room Area</p>
                  <strong>100 m²</strong>
                </div>
                <div>
                  <p>People</p>
                  <strong>10</strong>
                </div>
              </div>
              <div className="appointment-footer">
                <span className="price">$5750</span>
                <button className="see-detail">See Detail</button>
              </div>
            </div>

            {/* Customers */}
            <div className="card stat-card customers">
              <h4>Customers</h4>
              <div className="stat-number">{customers.length}</div>
              <div className="stat-icon customers-icon" />
            </div>

            {/* Deals */}
            <div className="card stat-card deals">
              <h4>Deals</h4>
              <div className="stat-number">{deals.length}</div>
              <div className="stat-icon deals-icon" />
            </div>
          </div>

          {/* CỘT 2 */}
          <div className="col">
            {/* Recent Deals */}
            <div className="card">
              <div className="card-header">
                <h4>Recent Deals</h4>
                <Link to="/system/deals" className="view-all-link">
                  View All
                </Link>
              </div>
              <ul className="deals-list">
                {deals.slice(0, 4).map((d) => {
                  const addressParts = d.name.split(",");
                  const street = addressParts[0];
                  const cityState = addressParts[1]?.trim() || "";
                  return (
                    <li key={d.id}>
                      <img src={d.avatar} alt="property" />
                      <div>
                        <p>{street}</p>
                        <small>{cityState}</small>
                      </div>
                      <div className="deal-right">
                        <strong>{d.price}</strong>
                        <small>{d.date}</small>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* In Progress */}
            <div className="card progress-card">
              <img src="https://randomuser.me/api/portraits/lego/5.jpg" alt="" />
              <div>
                <p>1824 Turkey Pen Road</p>
                <small>Cleveland, OH 12345</small>
              </div>
              <span className="in-progress">IN PROGRESS</span>
            </div>

            <div className="load-more-center">
              <button>Load More</button>
            </div>
          </div>

          {/* CỘT 3 */}
          <div className="col">
            {/* Customers List */}
            <div className="card">
              <div className="card-header">
                <h4>Customers</h4>
                <Link to="/system/customers" className="view-all-link">
                  View All
                </Link>
              </div>
              <ul className="customers-list">
                {customers.slice(0, 3).map((c) => (
                  <li key={c.id}>
                    <img
                      src={`https://randomuser.me/api/portraits/${c.avatar || "men/1"}.jpg`}
                      alt={c.name}
                    />
                    <div>
                      <p>{c.name}</p>
                      <small>{c.email}</small>
                    </div>
                    <FiSearch className="view-icon" />
                  </li>
                ))}
              </ul>
            </div>

            {/* Tasks To Do */}
            <div className="card">
              <div className="card-header">
                <h4>Tasks To Do</h4>
                <a href="#">View All</a>
              </div>
              <ul className="tasks-list">
                {[
                  { date: "30 Nov 2021", task: "Meeting with partners", overdue: true },
                  { date: "24 Dec 2021", task: "Web conference agenda", overdue: true },
                  { date: "24 Oct 2022", task: "Lunch with Steve", overdue: false },
                  { date: "24 Nov 2022", task: "Meeting with partners", overdue: false },
                  { date: "24 Nov 2022", task: "Weekly meeting", overdue: false },
                  { date: "24 Nov 2022", task: "Add new services", overdue: false },
                ].map((t, i) => (
                  <li key={i}>
                    <span className={`task-date ${t.overdue ? "overdue" : ""}`}>
                      {t.date}
                    </span>
                    {t.task}
                  </li>
                ))}
              </ul>
              <div className="add-task">
                <input type="text" placeholder="Add new task" />
                <button>→</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AddCustomerModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
      />
      <AddDealModal
        isOpen={showDealModal}
        onClose={() => setShowDealModal(false)}
      />
    </div>
  );
};

export default Dashboard;