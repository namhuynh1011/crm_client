// src/components/modals/RecordActivityModal.jsx
import React from "react";
import "./RecordActivityModal.css";
import { FiX } from "react-icons/fi";

const RecordActivityModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Activity Recorded</h3>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <p className="modal-message">
          Your activity has been successfully recorded.
        </p>
        <div className="modal-footer">
          <button className="ok-btn" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordActivityModal;