import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ProfileInfoCard from "../cards/ProfileInfoCard";
import DarkModeToggle from "./DarkModeToggle";
import { UserContext } from "../../context/userContext";

import { TbLayoutDashboardFilled } from "react-icons/tb";

// prev color #CDB4DB

const Navbar = ({ extraClassName, onOpenModal, textClassName }) => {
  const { user } = useContext(UserContext);

  return (
    <div
      className={`h-18 bg-[#CDB4DB] border border-b border-gray-200/50  background-blur-[2px] py-2.5 px-4 md:px-2 sticky top-0 z-30 flex items-center ${extraClassName}`}
    >
      <div className="container mx-auto flex items-center justify-between gap-5">
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/" className="flex">
            <h2
              className={`text-xl md:text-2xl font-semibold md:font-semibold leading5 font-sans ${textClassName}`}
            >
              Study Verse
            </h2>
          </Link>
          {user && (
            <Link to="/dashboard" className="flex items-center gap-1 mt-1.5">
              <h3 className="hidden md:block text-lg font-semibold">
                Dashboard
              </h3>
              <TbLayoutDashboardFilled className="text-2xl cursor-pointer" />
            </Link>
          )}
        </div>
        <div className="flex gap-4 items-center">
          <ProfileInfoCard onLoginClick={onOpenModal} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
