// src/pages/system/Deals/DealDetail.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Header from "../../../components/Header/Header";
import "./DealDetail.css";
import { FiSearch, FiCopy, FiEdit2, FiCalendar } from "react-icons/fi";

const DealDetail = () => {
  const { id } = useParams(); // LẤY ID TỪ URL
  const [showRecordModal, setShowRecordModal] = useState(false);

  // DỮ LIỆU MẪU THEO ID
  const dealData = {
    1: {
      customer: "Deanna Annis",
      email: "brodrigues@gmail.com",
      phone: "617-952-4069",
      address: "2893 Austin Secret Lane, Parowan, UT 12413",
      progress: "In Progress",
      appointmentDate: "Nov 17, 2021 08:00",
      roomArea: "25 M²",
      people: 10,
      price: "$6000",
      roomAccess: "Keys with doorman",
      specialInstructions:
        "At risus viverra adipiscing at in tellus. Blandit massa enim nec dui nunc mattis. Lacus vel facilisis volutpat est velit.",
    },
    2: {
      customer: "John Doe",
      email: "john@example.com",
      phone: "555-123-4567",
      address: "123 Main St, New York, NY 10001",
      progress: "CLOSED",
      appointmentDate: "Nov 18, 2021 09:00",
      roomArea: "30 M²",
      people: 8,
      price: "$7500",
      roomAccess: "Smart lock",
      specialInstructions: "Leave package at front desk.",
    },
    3: {
      customer: "Jane Smith",
      email: "jane@example.com",
      phone: "555-987-6543",
      address: "456 Oak Ave, Los Angeles, CA 90210",
      progress: "IN PROGRESS",
      appointmentDate: "Nov 19, 2021 10:00",
      roomArea: "40 M²",
      people: 12,
      price: "$9000",
      roomAccess: "Key under mat",
      specialInstructions: "Call before arrival.",
    },
  };

  const deal = dealData[id] || dealData[1]; // MẶC ĐỊNH ID 1

  const activities = [
    { date: "17 Nov 2021", description: "Installation or inspection of your thermostat" },
    { date: "16 Nov 2021", description: "Installation of the new air conditioning system" },
    { date: "16 Nov 2021", description: "Evaluation and removal of the old system" },
  ];

  return (
    <div className="deal-detail-layout">
      <Sidebar />
      <div className="deal-detail-main">
        <Header title="Deal Detail" />

        <div className="deal-detail-container">
          {/* LEFT COLUMN */}
          <div className="deal-info">
            <div className="deal-header">
              <h2>Deal Details</h2>
              <div className="header-actions">
                <button className="search-btn">
                  <FiSearch />
                </button>
                <img
                 // src="https://randomuser.me/api/portraits/men/32.jpg"
                 // alt="User"
                  //className="user-avatar"
                />
              </div>
            </div>

            <div className="info-row">
              <div className="icon customer-icon" />
              <div className="info-content">
                <p>Customer</p>
                <strong>{deal.customer}</strong>
              </div>
              <div className="info-content">
                <p>Email</p>
                <strong>{deal.email}</strong>
              </div>
              <div className="info-content">
                <p>Phone</p>
                <strong>{deal.phone}</strong>
              </div>
            </div>

            <div className="address-row">
              <div className="icon address-icon" />
              <div className="address-text">
                <strong>{deal.address}</strong>
              </div>
              <div className="address-actions">
                <FiCopy className="copy-icon" />
                <FiEdit2 className="edit-icon" />
              </div>
            </div>

            <div className="info-row">
              <div className="icon progress-icon" />
              <div className="info-content">
                <p>Progress</p>
                <span className={`status-badge ${deal.progress.toLowerCase().replace(" ", "")}`}>
                  {deal.progress}
                </span>
              </div>
              <div className="info-content">
                <p>Appointment Date</p>
                <strong>{deal.appointmentDate}</strong>
              </div>
            </div>

            <div className="info-row">
              <div className="icon room-icon" />
              <div className="info-content">
                <p>Room Area</p>
                <strong>{deal.roomArea}</strong>
              </div>
              <div className="info-content">
                <p>Number of people</p>
                <strong>{deal.people}</strong>
              </div>
            </div>

            <div className="info-row">
              <div className="icon price-icon" />
              <div className="info-content">
                <p>Price</p>
                <strong>{deal.price}</strong>
              </div>
              <div className="info-content">
                <p>Room Access</p>
                <strong>{deal.roomAccess}</strong>
              </div>
            </div>

            <div className="special-instructions">
              <div className="icon instructions-icon" />
              <div>
                <p>Special instructions</p>
                <p className="instructions-text">{deal.specialInstructions}</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="activity-section">
            <div className="record-card">
              <h3>Record Activity</h3>
              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Write your notes" rows="3" />
              </div>
              <div className="form-group date-group">
                <FiCalendar />
                <input type="text" value="Nov 14 2021, 10:00" readOnly />
              </div>
              <div className="form-group">
                <label>Images</label>
                <button className="add-image-btn">ADD</button>
              </div>
              <button className="save-activity-btn" onClick={() => setShowRecordModal(true)}>
                Save
              </button>
            </div>

            <div className="activity-log">
              <h3>Activity Log</h3>
              {activities.map((act, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-date">
                    <div className="dot" />
                    {act.date}
                  </div>
                  <div className="activity-desc">{act.description}</div>
                </div>
              ))}
              <div className="load-more">
                <button>Load More</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetail;