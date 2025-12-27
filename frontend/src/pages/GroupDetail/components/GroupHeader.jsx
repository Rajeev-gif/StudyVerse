import React from "react";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const GroupHeader = ({ group }) => {
  return (
    <div className="p-2 bg-gray-100 flex items-center justify-between sticky top-18 z-20">
      <div className="">
        <h1 className="text-xl font-blold font-serif px-2">{group?.name}</h1>
        <p className="text-sm text-gray-800 bg-gray-200 py-1 px-2 rounded-2xl">
          {group?.description}
        </p>
      </div>
      <Link to="/group-detail/:groupId">
        <div className="text-2xl md:text-3xl py-3 px-3 rounded-full bg-blue-700 hover:bg-blue-600 transition text-white cursor-pointer hover:shadow-lg flex items-center text-center mr-1 md:mr-2">
          <button className="font-semibold cursor-pointer">
            <IoArrowForwardCircleOutline />
          </button>
        </div>
      </Link>
    </div>
  );
};

export default GroupHeader;
