import React, { useState } from "react";
import Header from "../../../components/Header/Header";
import Sidebar from "../../../components/Sidebar/Sidebar";
import "./Employee.css";
import defaultAvatar from "../../../assets/default-avatar.png";
import { FaSearch, FaSortAmountDown, FaPencilAlt, FaLock, FaLockOpen } from "react-icons/fa";

/* Sample data now includes isBlocked flag */
const SAMPLE_EMPLOYEES = [
  { id: 1, fullName: "Deanna Annis", email: "deannannis@gmail.com", role: "Admin", avatar: "", isBlocked: false },
  { id: 2, fullName: "George Gamble", email: "georgegamble@gmail.com", role: "Manager", avatar: "", isBlocked: false },
  { id: 3, fullName: "Andrea Willis", email: "andreawillis@gmail.com", role: "Employee", avatar: "", isBlocked: false },
  { id: 4, fullName: "Tran Van A", email: "trana@example.com", role: "Employee", avatar: "", isBlocked: true },
  { id: 5, fullName: "Le Thi B", email: "lethi@example.com", role: "Employee", avatar: "", isBlocked: false },
  { id: 6, fullName: "Pham C", email: "phamc@example.com", role: "Employee", avatar: "", isBlocked: false },
  { id: 7, fullName: "Nguyen D", email: "nguyend@example.com", role: "Employee", avatar: "", isBlocked: true },
];

const Avatar = ({ name, src }) => {
  if (src) return <img src={src} alt={name} className="emp-avatar" />;
  const initial = (name || "U").charAt(0).toUpperCase();
  return <div className="emp-avatar emp-avatar--initial">{initial}</div>;
};

const EmployeeRow = ({ emp, onToggleBlock }) => {
  return (
    <tr className={`emp-row ${emp.isBlocked ? "emp-row--blocked" : ""}`}>
      <td className="emp-cell emp-cell--avatar">
        <div className="avatar-wrap">
          <Avatar name={emp.fullName} src={emp.avatar || defaultAvatar} />
        </div>
      </td>

      <td className="emp-cell emp-cell--name">{emp.fullName}</td>

      <td className="emp-cell emp-cell--email">{emp.email}</td>

      <td className="emp-cell emp-cell--role">{emp.role}</td>

      <td className="emp-cell emp-cell--status">
        {emp.isBlocked ? <span className="badge badge--blocked">Blocked</span> : <span className="badge badge--active">Active</span>}
      </td>

      <td className="emp-cell emp-cell--edit">
        <button
          className={`icon-btn icon-btn--lock ${emp.isBlocked ? "unblock" : "block"}`}
          title={emp.isBlocked ? "Unblock user" : "Block user"}
          onClick={() => onToggleBlock(emp.id)}
        >
          {emp.isBlocked ? <FaLockOpen /> : <FaLock />}
        </button>

        <button className="icon-btn" title="Edit" style={{ marginLeft: 8 }}>
          <FaPencilAlt />
        </button>
      </td>
    </tr>
  );
};

const EmployeePage = () => {
  const [employees, setEmployees] = useState(SAMPLE_EMPLOYEES);
  const [query, setQuery] = useState("");

  const filtered = employees.filter(
    (e) =>
      e.fullName.toLowerCase().includes(query.toLowerCase()) ||
      e.email.toLowerCase().includes(query.toLowerCase()) ||
      e.role.toLowerCase().includes(query.toLowerCase())
  );

  const onToggleBlock = (id) => {
    setEmployees((prev) => prev.map((u) => (u.id === id ? { ...u, isBlocked: !u.isBlocked } : u)));
  };

  return (
    <div className="app-layout">
      <Header />
      <Sidebar />

      <main className="main-with-header">
        <div className="employee-page">
          <div className="employee-header">
            <div>
              <h2 className="page-title">Employees</h2>
              <div className="subtle">Total: {employees.length} employees</div>
            </div>

            <div className="controls">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input placeholder="Search name, email, role..." value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>

              <button className="btn-outline">
                <FaSortAmountDown /> Sort
              </button>

              <button className="btn-primary">Add New Employee</button>
            </div>
          </div>

          <div className="employee-table-wrap">
            <table className="employee-table">
              <thead>
                <tr>
                  <th className="th-avatar" />
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="th-edit" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <EmployeeRow key={emp.id} emp={emp} onToggleBlock={onToggleBlock} />
                ))}
              </tbody>
            </table>

            <div className="load-more-wrap">
              <button className="btn-load-more">Load More</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeePage;