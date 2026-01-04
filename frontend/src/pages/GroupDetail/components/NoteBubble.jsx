import React, { useContext } from "react";
import { BASE_URL } from "../../../utils/apiPaths";
import { UserContext } from "../../../context/userContext";
import { getFirstName } from "../../../utils/helper";

import { FaArrowRight, FaFileAlt } from "react-icons/fa";

const NoteBubble = ({ note, handleRightClick }) => {
  const { user } = useContext(UserContext);
  const isOwn = note?.uploadedBy?._id === user._id;

  const Fname = getFirstName(note.uploadedBy?.username);

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        if (isOwn) {
          handleRightClick(note);
        }
      }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-sm px-4 py-3 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 ${
          isOwn
            ? "bg-linear-to-r from-blue-500 to-blue-600 text-white border border-blue-400"
            : "bg-linear-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300"
        }`}
      >
        <div className="flex items-center mb-2">
          <FaFileAlt
            className={`mr-2 ${isOwn ? "text-blue-200" : "text-blue-500"}`}
          />
          <p
            className={`text-xs font-semibold uppercase tracking-wide ${
              isOwn ? "text-blue-100" : "text-gray-600"
            }`}
          >
            {Fname}
          </p>
        </div>

        <p className="text-base font-bold mb-3 leading-tight">{note.title}</p>

        <div className="flex justify-end">
          <a
            href={`${note.noteUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              isOwn
                ? "bg-white text-blue-600 hover:bg-blue-50 border border-blue-300"
                : "bg-blue-500 text-white hover:bg-blue-600 border border-blue-400"
            } shadow-sm hover:shadow-md`}
          >
            Open Note
            <FaArrowRight className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NoteBubble;
