import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import FilterPanel from "../../components/FilterPanel/FilterPanel";
import DataTable from "../../components/DataTable/DataTable";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <div className="dashboard-content">
          <FilterPanel />
          <DataTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
