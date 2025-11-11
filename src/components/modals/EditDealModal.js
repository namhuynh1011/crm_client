// src/components/modals/EditDealModal.jsx
import React, { useState, useEffect } from "react";
import { useCRM } from "../../context/CRMContext";
import "./EditDealModal.css";
import { FiX, FiCalendar, FiUpload, FiChevronDown } from "react-icons/fi";

const EditDealModal = ({ isOpen, onClose, deal }) => {
  const { updateDeal } = useCRM();

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    area: "",
    people: "",
    date: "",
    instructions: "",
    access: "Keys with doorman",
    price: "",
    progress: "In Progress",
  });

  // TÁCH DỮ LIỆU KHI MỞ MODAL
  useEffect(() => {
    if (deal) {
      const addressParts = deal.name.split(", ");
      const street = addressParts[0] || "";
      const city = addressParts[1] || "";
      const stateZip = addressParts[2]?.split(" ") || [];
      const state = stateZip[0] || "";
      const zip = stateZip[1] || "";

      setFormData({
        street,
        city,
        state,
        zip,
        area: deal.area?.replace("M²", "") || "",
        people: "",
        date: deal.date?.split(" ")[0] || "",
        instructions: "",
        access: "Keys with doorman",
        price: deal.price?.replace("$", "") || "",
        progress: deal.status?.replace("_", " ") || "In Progress",
      });
    }
  }, [deal]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fullAddress = `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}`;
    const updatedDeal = {
      ...deal,
      name: fullAddress,
      area: formData.area + "M²",
      date: `${formData.date} 07:00 AM`,
      price: `$${formData.price}`,
      status: formData.progress.toUpperCase().replace(" ", "_"),
    };

    updateDeal(deal.id, updatedDeal);
    onClose();
  };

  if (!isOpen || !deal) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content edit-deal-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Edit Deal</h3>
            <button className="close-btn" onClick={onClose}>
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="edit-deal-form">
            {/* ROOM IMAGES */}
            <div className="form-group">
              <label>Room Images</label>
              <div className="image-upload">
                <FiUpload />
                <span>ADD</span>
              </div>
            </div>

            {/* ADDRESS TITLE */}
            <div className="section-title">Address</div>

            {/* STREET */}
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
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State / Province"
                required
              />
              <input
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="Zip Code"
                required
              />
            </div>

            {/* AREA & PEOPLE */}
            <div className="form-row">
              <div className="form-group">
                <label>Room Area (m²)</label>
                <input
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="25"
                  required
                />
              </div>
              <div className="form-group">
                <label># of People</label>
                <input
                  name="people"
                  value={formData.people}
                  onChange={handleChange}
                  placeholder="4"
                  required
                />
              </div>
            </div>

            {/* APPOINTMENT DATE */}
            <div className="form-group">
              <label>Appointment Date</label>
              <div className="date-input">
                <input
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="Nov 14, 2021"
                />
                <FiCalendar />
              </div>
            </div>

            {/* SPECIAL INSTRUCTIONS */}
            <div className="form-group">
              <label>Special Instructions</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows="3"
                placeholder="Leave a special instructions"
              />
            </div>

            {/* ROOM ACCESS & PRICE */}
            <div className="form-row">
              <div className="form-group">
                <label>Room Access</label>
                <div className="select-wrapper">
                  <select
                    name="access"
                    value={formData.access}
                    onChange={handleChange}
                  >
                    <option>Keys with doorman</option>
                    <option>Digital lock code</option>
                    <option>Meet at location</option>
                  </select>
                  <FiChevronDown className="select-icon" />
                </div>
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="5000"
                  required
                />
              </div>
            </div>

            {/* PROGRESS */}
            <div className="form-group">
              <label>Progress</label>
              <div className="select-wrapper">
                <select
                  name="progress"
                  value={formData.progress}
                  onChange={handleChange}
                >
                  <option>In Progress</option>
                  <option>Closed</option>
                  <option>Pending</option>
                </select>
                <FiChevronDown className="select-icon" />
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button type="submit" className="done-btn">
                Done
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditDealModal;