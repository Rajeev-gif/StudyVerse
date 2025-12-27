import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext);
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {user && <div className="flex justify-evenly">{children}</div>}
    </div>
  );
};

export default DashboardLayout;
