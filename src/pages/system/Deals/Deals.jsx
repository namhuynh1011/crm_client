// src/pages/system/Deals/Deals.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Header from "../../../components/Header/Header";
import { useCRM } from "../../../context/CRMContext";
import AddDealModal from "../../../components/modals/AddDealModal";
import EditDealModal from "../../../components/modals/EditDealModal";
import "./Deals.css";
import { FiFilter, FiPlus, FiChevronDown, FiSearch } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";

const Deals = () => {
  const { deals } = useCRM();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  const handleEdit = (deal) => {
    setSelectedDeal(deal);
    setShowEditModal(true);
  };

  return (
    <div className="deals-page">
      <Sidebar />
      <div className="deals-main">
        <Header />

        <div className="deals-container">
          {/* HEADER */}
          <div className="deals-header">
            <div className="header-left">
              <h2>Deals</h2>
              <span className="total-deals">Total: {deals.length} deals</span>
            </div>
            <div className="header-right">
              <button className="add-deal-btn" onClick={() => setShowAddModal(true)}>
                <FiPlus /> Add New Deal
              </button>
              <div className="search-bar">
                <FiSearch />
                <input type="text" placeholder="Search..." />
              </div>
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User"
                className="user-avatar"
              />
            </div>
          </div>

          {/* FILTER & SORT */}
          <div className="filter-bar">
            <button className="sort-btn">
              Sort by: Date Created <FiChevronDown />
            </button>
            <button className="filter-btn">
              <FiFilter /> Filter
            </button>
          </div>

          {/* TABLE */}
          <div className="table-wrapper">
            <table className="deals-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Area</th>
                  <th>Appointment Date</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {deals.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">No deals available</td>
                  </tr>
                ) : (
                  deals.map((deal) => {
                    const shortName = deal.name.split(",")[0];
                    return (
                      <tr key={deal.id}>
                        <td className="deal-name-cell">
                          <div className="deal-name">
                            <img
                              src={deal.avatar}
                              alt="Property"
                              onError={(e) => e.target.src = "https://via.placeholder.com/36"}
                            />
                            <div className="deal-name-text">
                              <Link to={`/system/deals/${deal.id}`} className="deal-link">
                                {shortName}
                              </Link>
                              <div className="tooltip">{deal.name}</div>
                            </div>
                          </div>
                        </td>
                        <td>{deal.area}</td>
                        <td>{deal.date}</td>
                        <td>{deal.price}</td>
                        <td>
                          <span className={`status-badge ${deal.status.toLowerCase().replace('_', '-')}`}>
                            {deal.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          <button className="edit-icon" onClick={() => handleEdit(deal)}>
                            <FaEdit />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* LOAD MORE */}
          <div className="load-more">
            <button>Load More</button>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AddDealModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      <EditDealModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} deal={selectedDeal} />
    </div>
  );
};

export default Deals;