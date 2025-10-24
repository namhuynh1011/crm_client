import React from "react";
import "./DataTable.css";

const data = [
  { id: 1, name: "Nguyễn Văn A", status: "Đang xử lý", deal: "Deal #123", owner: "Minh" },
  { id: 2, name: "Trần Thị B", status: "Hoàn thành", deal: "Deal #124", owner: "Huyền" },
  { id: 3, name: "Lê Văn C", status: "Đã hủy", deal: "Deal #125", owner: "Nam" },
];

const DataTable = () => {
  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>Tên khách hàng</th>
            <th>Trạng thái</th>
            <th>Deal</th>
            <th>Người phụ trách</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.status}</td>
              <td>{row.deal}</td>
              <td>{row.owner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
