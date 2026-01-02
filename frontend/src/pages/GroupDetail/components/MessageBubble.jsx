import React, { useContext } from "react";
import { UserContext } from "../../../context/userContext";
import moment from "moment";
import { getFirstName } from "../../../utils/helper";

// Icons
import { FaUser } from "react-icons/fa";

const MessageBubble = ({ message, handleRightClick }) => {
  const { user } = useContext(UserContext);
  const isOwn = message.sender._id === user._id;
  const Fname = getFirstName(message.sender.username);

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        handleRightClick(message);
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
          <FaUser
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

        <p className="text-base leading-relaxed mb-2">{message.content}</p>

        <div
          className={`flex ${
            isOwn ? "justify-end" : "justify-start"
          }  items-center`}
        >
          <span
            className={`text-xs opacity-75 ${
              isOwn ? "text-blue-200" : "text-gray-500"
            }`}
          >
            {moment(message.createdAt).format("HH:mm")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
