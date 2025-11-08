// src/components/modals/AddTaskModal.jsx
import React, { useState } from "react";
import { useCRM } from "../../context/CRMContext";
import "./AddTaskModal.css";
import { FiX } from "react-icons/fi";

const AddTaskModal = ({ isOpen, onClose }) => {
  const { addTask } = useCRM();
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    addTask({ date: dueDate, task: description });
    setDueDate("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Task</h3>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="text"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="14 Nov 2021"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              placeholder="Task description..."
              required
            />
          </div>
          <div className="modal-footer">
            <button type="submit" className="save-btn">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;