import React from "react";
import { getInitials } from "../../utils/helper";

// Icons
import { MdPeopleAlt, MdStickyNote2 } from "react-icons/md";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { IoArrowForwardCircleOutline } from "react-icons/io5";

const GroupCard = ({
  colors,
  name,
  description,
  members,
  notes,
  createdAt,
  lastUpdated,
  onSelect,
}) => {
  return (
    <div
      className="be-white border-gray-300/40 rounded-2xl p-2 overflow-hidden cursor-pointer hover:shadow-xl transition shadow-gray-100 relative group"
      onClick={onSelect}
    >
      <div
        className="rounded-lg p-4 cursor-pointer relative"
        style={{ background: colors.bgcolor }}
      >
        <div className="flex flex-col">
          <div className="flex gap-4 items-center">
            <div className="shrink-0 w-12 h-12 text-center pt-2 rounded-full bg-white">
              <p className="text-lg font-semibold text-black">
                {getInitials(name)}
              </p>
            </div>
            <div className="grow flex items-center justify-between">
              <h3 className="text-md md:text-lg font-semibold font-sans">
                {name}
              </h3>
              <p className="text-[10px] text-gray-500 hidden md:block">
                last updated at:{lastUpdated}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-[12px] md:text-[17px] text-gray-600 font-medium line-clamp-2">
                {description}
              </p>
              <div className="flex gap-2 md:gap-6 items-center py-2 px-4 rounded-2xl bg-white">
                <span className="flex gap-1 items-center bg-gray-200 rounded-2xl px-2">
                  <MdPeopleAlt className="text-base md:text-lg" />
                  <p className="text-[10px] md:text-[12px] font-medium">
                    {members} members
                  </p>
                </span>
                <span className="flex gap-1 items-center">
                  <MdStickyNote2 className="text-lg" />
                  <p className="text-[12px] md:text-[15px] font-medium">
                    {notes} notes
                  </p>
                </span>
              </div>
            </div>
            <div className="text-xl md:text-4xl py-2 px-3 md:px-4 rounded-2xl bg-blue-700 hover:bg-blue-600 transition text-white cursor-pointer hover:shadow-lg flex items-center text-center">
              <button className="font-semibold">
                <IoArrowForwardCircleOutline />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
