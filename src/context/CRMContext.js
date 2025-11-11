// src/context/CRMContext.jsx
import React, { createContext, useContext, useState } from "react";

const CRMContext = createContext();

export const useCRM = () => useContext(CRMContext);

export const CRMProvider = ({ children }) => {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Nguyen Van A",
      company: "ABC Corp",
      email: "nguyenvana@example.com",
      phone: "0901 234 567",
      status: "Active",
      avatar: "men/32",
    },
    {
      id: 2,
      name: "Tran Thi B",
      company: "GreenZone Ltd",
      email: "tranthib@example.com",
      phone: "0987 654 321",
      status: "Inactive",
      avatar: "women/44",
    },
    {
      id: 3,
      name: "Le Van C",
      company: "TravelSmart Inc",
      email: "levanc@example.com",
      phone: "0938 222 111",
      status: "Active",
      avatar: "men/65",
    },
  ]);

 const [tasks, setTasks] = useState([
    { id: 1, date: "14 Nov 2021", task: "Description goes here", completed: false, overdue: false },
    { id: 2, date: "24 Dec 2021", task: "Web conference agenda", completed: false, overdue: true },
    { id: 3, date: "24 Nov 2022", task: "Meeting with partners", completed: true, overdue: false },
    { id: 4, date: "24 Nov 2022", task: "Add new services", completed: false, overdue: false },
  ]);

  const [deals, setDeals] = useState([
    {
      id: 1,
      name: "475 Spruce Drive, Pittsburgh, PA 23592",
      area: "100M²",
      date: "Nov 14, 2021 07:00 AM",
      price: "$6000",
      status: "IN_PROGRESS",
      avatar: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=100",
    },
    {
      id: 2,
      name: "1952 Chicago Avenue, Fresno, CA 93711",
      area: "100M²",
      date: "Nov 15, 2021 08:00 AM",
      price: "$6000",
      status: "CLOSED",
      avatar: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=100",
    },
    {
      id: 3,
      name: "4409 Haul Road, Saint Paul, MN 55102",
      area: "100M²",
      date: "Nov 16, 2021 09:00 AM",
      price: "$6000",
      status: "IN_PROGRESS",
      avatar: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=100",
    },
  ]);

  // THÊM TASK
  const addTask = (newTask) => {
    const task = {
      ...newTask,
      id: Date.now(),
    };
    setTasks((prev) => [task, ...prev]);
  };

  // SỬA TASK
  const updateTask = (id, updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedTask } : t))
    );
  };

  // XÓA TASK (TÙY CHỌN)
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // THÊM CUSTOMER + TỰ ĐỘNG AVATAR
  const addCustomer = (newCustomer) => {
    const customer = {
      ...newCustomer,
      id: Date.now(),
      avatar: Math.random() > 0.5
        ? `men/${Math.floor(Math.random() * 99) + 1}`
        : `women/${Math.floor(Math.random() * 99) + 1}`,
    };
    setCustomers((prev) => [customer, ...prev]);
  };

  // THÊM DEAL + TỰ ĐỘNG AVATAR
  const addDeal = (newDeal) => {
    const deal = {
      ...newDeal,
      id: Date.now(),
      avatar: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 10)}.jpg`,
    };
    setDeals((prev) => [deal, ...prev]);
  };

  // CẬP NHẬT DEAL (CHO EDIT)
  const updateDeal = (id, updatedDeal) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updatedDeal } : d))
    );
  };

  // XÓA DEAL (TÙY CHỌN)
  const deleteDeal = (id) => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <CRMContext.Provider
      value={{
        customers,
        deals,
        addCustomer,
        addDeal,
        updateDeal,
        deleteDeal,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};