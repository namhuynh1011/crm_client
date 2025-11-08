// src/components/modals/AddCustomerModal.jsx
import React, { useState } from "react";
import { useCRM } from "../../context/CRMContext";
import "./AddCustomerModal.css";
import { FiX, FiUpload } from "react-icons/fi";

const AddCustomerModal = ({ isOpen, onClose }) => {
  const { addCustomer } = useCRM();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const customer = {
      name: fullName,
      email: formData.email,
      phone: formData.phone,
      company: "N/A", // có thể thêm field sau
      status: "Active",
      avatar: "men/1", // sẽ random sau
    };
    addCustomer(customer);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content add-customer-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Add New Customer</h3>
            <button className="close-btn" onClick={onClose}>
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="add-customer-form">
            {/* AVATAR UPLOAD */}
            <div className="form-group avatar-group">
              <label>Avatar</label>
              <div className="avatar-upload">
                <FiUpload />
                <span>ADD</span>
              </div>
            </div>

            {/* FIRST & LAST NAME */}
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            {/* EMAIL & PHONE */}
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0901234567"
                  required
                />
              </div>
            </div>

            {/* ADDRESS TITLE */}
            <div className="address-title">Address</div>

            {/* STREET ADDRESS */}
            <div className="form-group">
              <input
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street Address"
                required
              />
            </div>

            {/* CITY, STATE, ZIP */}
            <div className="form-row">
              <div className="form-group">
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State / Province"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  placeholder="Zip Code"
                  required
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="save-btn">
                Save Customer
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddCustomerModal;