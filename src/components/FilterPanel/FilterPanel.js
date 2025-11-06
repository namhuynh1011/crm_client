import React from "react";
import "./FilterPanel.css";

const FilterPanel = () => {
  return (
    <div className="filter-panel">
      <select>
        <option>Tất cả trạng thái</option>
        <option>Đang xử lý</option>
        <option>Hoàn thành</option>
        <option>Đã hủy</option>
      </select>

      <select>
        <option>Tất cả nhân viên</option>
        <option>Nguyễn Văn A</option>
        <option>Trần Thị B</option>
        <option>Lê Văn C</option>
      </select>

      <input type="text" placeholder="Tìm kiếm khách hàng..." />
    </div>
  );
};

export default FilterPanel;
