import React from "react";
import { Link } from "react-router-dom";
import ProfileInfoCard from "../cards/ProfileInfoCard";

// prev color #CDB4DB

const Navbar = ({ extraClassName }) => {
  return (
    <div
      className={`h-18 bg-[#CDB4DB] border border-b border-gray-200/50  background-blur-[2px] py-2.5 px-4 md:px-2 sticky top-0 z-30  flex items-center ${extraClassName}`}
    >
      <div className="container mx-auto flex items-center justify-between gap-5">
        <div className="flex items-center gap-5">
          <Link to="/" className="flex">
            <h2 className="text-xl md:text-2xl font-semibold md:font-semibold text-black leading5 font-sans">
              Study Verse
            </h2>
          </Link>
          {/* TODO: if user logged in display dashboard */}
        </div>
        <ProfileInfoCard />
      </div>
    </div>
  );
};

export default Navbar;
