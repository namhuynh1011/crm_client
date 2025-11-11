// src/components/modals/EditTaskModal.jsx
import React, { useState, useEffect } from "react";
import { useCRM } from "../../context/CRMContext";
import "./EditTaskModal.css";
import { FiX, FiTrash2 } from "react-icons/fi";

const EditTaskModal = ({ isOpen, onClose, task }) => {
  const { updateTask, deleteTask } = useCRM();
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (task) {
      setCompleted(task.completed);
      setDueDate(task.date);
      setDescription(task.task.replace(" (overdue)", ""));
    }
  }, [task]);

  const handleSave = () => {
    const updated = {
      completed,
      date: dueDate,
      task: description + (task.overdue ? " (overdue)" : ""),
    };
    updateTask(task.id, updated);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Delete this task?")) {
      deleteTask(task.id);
      onClose();
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Task</h3>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            Complete?
          </label>
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            type="text"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="14 Nov 2021"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            placeholder="Task description..."
          />
        </div>

        <div className="modal-footer">
          <button type="button" className="delete-btn" onClick={handleDelete}>
            <FiTrash2 /> Delete
          </button>
          <button type="button" className="save-btn" onClick={handleSave}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;