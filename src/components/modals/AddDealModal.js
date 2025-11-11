// src/components/modals/AddDealModal.jsx
import React, { useState } from "react";
import { useCRM } from "../../context/CRMContext";
import CustomerSelectorModal from "./CustomerSelectorModal";
import "./AddDealModal.css";
import { FiX, FiCalendar, FiUpload, FiChevronDown } from "react-icons/fi";

const AddDealModal = ({ isOpen, onClose }) => {
  const { addDeal, customers } = useCRM();
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]); // Mặc định chọn khách đầu tiên

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    area: "",
    people: "",
    date: "Nov 14, 2021",
    instructions: "",
    access: "Keys with doorman",
    price: "",
    progress: "In Progress",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fullAddress = `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}`;
    const deal = {
      name: fullAddress,
      area: formData.area + "M²",
      date: `${formData.date} 07:00 AM`,
      price: `$${formData.price}`,
      status: formData.progress.toUpperCase().replace(" ", "_"),
      customer: selectedCustomer,
      avatar: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 10)}.jpg`,
    };

    addDeal(deal);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content add-deal-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Add New Deal</h3>
            <button className="close-btn" onClick={onClose}>
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="add-deal-form">
            {/* CUSTOMER SELECTOR - HIỂN THỊ KHÁCH THỰC TẾ */}
            <div className="customer-selector">
              <div className="customer-preview">
                <img
                  src={`https://randomuser.me/api/portraits/${selectedCustomer?.avatar || "men/1"}.jpg`}
                  alt={selectedCustomer?.name}
                  className="customer-avatar"
                  onError={(e) => e.target.src = "https://randomuser.me/api/portraits/men/1.jpg"}
                />
                <div>
                  <strong>Customer</strong>
                  <p>{selectedCustomer?.name || "Select a customer"}</p>
                </div>
              </div>
              <button
                type="button"
                className="change-customer-btn"
                onClick={() => setShowCustomerModal(true)}
              >
                Change Customer
              </button>
            </div>

            {/* === PHẦN CÒN LẠI GIỮ NGUYÊN === */}
            <div className="form-group">
              <label>Room Images</label>
              <div className="image-upload">
                <FiUpload />
                <span>ADD</span>
              </div>
            </div>

            <div className="form-group">
              <label>Address</label>
              <input name="street" value={formData.street} onChange={handleChange} placeholder="Street Address" required />
            </div>

            <div className="form-row">
              <input name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
              <input name="state" value={formData.state} onChange={handleChange} placeholder="State / Province" required />
              <input name="zip" value={formData.zip} onChange={handleChange} placeholder="Zip Code" required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Room Area (m²)</label>
                <input name="area" value={formData.area} onChange={handleChange} placeholder="100" required />
              </div>
              <div className="form-group">
                <label># of People</label>
                <input name="people" value={formData.people} onChange={handleChange} placeholder="10" required />
              </div>
            </div>

            <div className="form-group">
              <label>Appointment Date</label>
              <div className="date-input">
                <input name="date" value={formData.date} onChange={handleChange} placeholder="Nov 14, 2021" />
                <FiCalendar />
              </div>
            </div>

            <div className="form-group">
              <label>Special Instructions</label>
              <textarea name="instructions" value={formData.instructions} onChange={handleChange} rows="3" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Room Access</label>
                <div className="select-wrapper">
                  <select name="access" value={formData.access} onChange={handleChange}>
                    <option>Keys with doorman</option>
                    <option>Digital lock code</option>
                    <option>Meet at location</option>
                  </select>
                  <FiChevronDown className="select-icon" />
                </div>
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input name="price" value={formData.price} onChange={handleChange} placeholder="6000" required />
              </div>
            </div>

            <div className="form-group">
              <label>Progress</label>
              <div className="select-wrapper">
                <select name="progress" value={formData.progress} onChange={handleChange}>
                  <option>In Progress</option>
                  <option>Closed</option>
                  <option>Pending</option>
                </select>
                <FiChevronDown className="select-icon" />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="save-btn">Save Deal</button>
            </div>
          </form>
        </div>
      </div>

      {/* MODAL CHỌN KHÁCH HÀNG */}
      <CustomerSelectorModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        customers={customers}
        onSelect={(customer) => {
          setSelectedCustomer(customer);
          setShowCustomerModal(false);
        }}
      />
    </>
  );
};

export default AddDealModal;