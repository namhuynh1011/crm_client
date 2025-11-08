// src/pages/system/Tasks/Tasks.jsx
import React, { useState } from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Header from "../../../components/Header/Header";
import AddTaskModal from "../../../components/modals/AddTaskModal";
import EditTaskModal from "../../../components/modals/EditTaskModal";
import "./Tasks.css";
import { FiEdit2, FiCheck, FiSquare } from "react-icons/fi";

const Tasks = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const tasks = [
    { id: 1, date: "14 Nov 2021", task: "Description goes here", completed: false, overdue: false },
    { id: 2, date: "24 Dec 2021", task: "Web conference agenda (overdue)", completed: false, overdue: true },
    { id: 3, date: "24 Nov 2022", task: "Meeting with partners", completed: true, overdue: false },
    { id: 4, date: "24 Nov 2022", task: "Add new services", completed: false, overdue: false },
    { id: 5, date: "24 Nov 2022", task: "Upload new legals (terms & conditions)", completed: true, overdue: false },
    { id: 6, date: "24 Nov 2022", task: "Sales report due", completed: false, overdue: false },
    { id: 7, date: "24 Nov 2022", task: "Description goes here", completed: false, overdue: false },
  ];

  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  return (
    <div className="tasks-layout">
      <Sidebar />
      <div className="tasks-main">
        <Header />

        <div className="tasks-container">
          <div className="tasks-header">
            <h2>Tasks</h2>
            <div className="tasks-actions">
              <button className="add-task-btn" onClick={() => setShowAddModal(true)}>
                Add New Task
              </button>
              <button className="sort-btn">Sort by: Due Date</button>
              <button className="filter-btn">Filter</button>
            </div>
          </div>

          <p className="total-tasks">Total: {tasks.length} tasks</p>

          <table className="tasks-table">
            <thead>
              <tr>
                <th></th>
                <th>Due Date</th>
                <th>Task</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="checkbox-cell">
                    {task.completed ? (
                      <FiCheck className="check-icon completed" />
                    ) : (
                      <FiSquare className="check-icon" />
                    )}
                  </td>
                  <td>
                    <span className={`due-date ${task.overdue ? "overdue" : ""}`}>
                      {task.date}
                    </span>
                  </td>
                  <td className="task-description">
                    {task.task}
                    {task.overdue && <span className="overdue-tag">(overdue)</span>}
                  </td>
                  <td>
                    <FiEdit2 className="edit-icon" onClick={() => handleEdit(task)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="load-more">
            <button>Load More</button>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AddTaskModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      {selectedTask && (
        <EditTaskModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          task={selectedTask}
        />
      )}
    </div>
  );
};

export default Tasks;