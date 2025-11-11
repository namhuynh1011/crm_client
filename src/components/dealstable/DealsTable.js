import React from "react";
import "./DealsTable.css";

const deals = [
  {
    name: "475 Spruce Drive, Pittsburgh, PA 23592",
    area: "100M²",
    date: "Nov 14, 2021 07:00 AM",
    price: "$6000",
    status: "IN PROGRESS",
  },
  {
    name: "1952 Chicago Avenue, Fresno, CA 93711",
    area: "100M²",
    date: "Nov 15, 2021 08:00 AM",
    price: "$6000",
    status: "CLOSED",
  },
  // thêm dữ liệu khác...
];

const DealsTable = () => {
  return (
    <div className="deals-table-container">
      <p className="total">Total: {deals.length} deals</p>
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
          {deals.map((d, i) => (
            <tr key={i}>
              <td>{d.name}</td>
              <td>{d.area}</td>
              <td>{d.date}</td>
              <td>{d.price}</td>
              <td>
                <span
                  className={`status ${d.status === "CLOSED" ? "closed" : "progress"}`}
                >
                  {d.status}
                </span>
              </td>
              <td>
                <button className="edit-btn">✏️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="load-more">Load More</button>
    </div>
  );
};

export default DealsTable;
