// src/components/modals/CustomerSelectorModal.jsx
import React from "react";
import { FiX } from "react-icons/fi";
import "./CustomerSelectorModal.css";

const CustomerSelectorModal = ({ isOpen, onClose, customers, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select Customer</h3>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>
        <div className="customer-list">
          {customers.length === 0 ? (
            <p style={{ padding: "20px", textAlign: "center", color: "#999" }}>
              No customers available
            </p>
          ) : (
            customers.map((c) => (
              <div
                key={c.id}
                className="customer-item"
                onClick={() => onSelect(c)}
              >
                <img
                  src={`https://randomuser.me/api/portraits/${c.avatar}.jpg`}
                  alt={c.name}
                  onError={(e) => e.target.src = "https://randomuser.me/api/portraits/men/1.jpg"}
                />
                <div>
                  <strong>{c.name}</strong>
                  <small>{c.email}</small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSelectorModal;