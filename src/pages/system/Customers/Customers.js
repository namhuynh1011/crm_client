// src/pages/system/Customers/Customers.jsx
import React, { useState } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Header from "../../../components/Header/Header";
import { useCRM } from "../../../context/CRMContext";
import AddCustomerModal from "../../../components/modals/AddCustomerModal";
import "./Customers.css";

const Customers = () => {
  const { customers } = useCRM();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header title="Customers" />
        <div className="page-content">
          <div className="customers-header">
            <p>Total: {customers.length} customers</p>
            <button className="add-customer-btn" onClick={() => setShowAddModal(true)}>
              Add Customer
            </button>
          </div>

          <div className="table-container">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="name-cell">
                        <img
                          src={`https://randomuser.me/api/portraits/${c.avatar}.jpg`}
                          alt={c.name}
                          className="customer-avatar"
                          onError={(e) => {
                            e.target.src = "https://randomuser.me/api/portraits/men/1.jpg";
                          }}
                        />
                        <div className="name-info">
                          <strong>{c.name}</strong>
                          <small>{c.company}</small>
                        </div>
                      </div>
                    </td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>{c.company}</td>
                    <td>
                      <span className={`status ${c.status.toLowerCase()}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn edit">Edit</button>
                      <button className="action-btn delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="load-more-center">
            <button>Load More</button>
          </div>
        </div>
      </div>

      <AddCustomerModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
};

export default Customers;