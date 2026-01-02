import React, { useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const ProfileInfoCard = ({ onLoginClick }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getFirstName = (name) => {
    if (!name) return "";
    return name.split(" ")[0];
  };

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
    } catch (error) {
      console.error("Logout error:", error);
    }
    clearUser();
    navigate("/");
  };

  return user ? (
    <div className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm transition-colors hover:shadow-md">
      <Link to="/user-profile" className="shrink-0">
        <img
          src={
            user?.profileImageUrl ||
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
          }
          alt={getFirstName(user?.username) || ""}
          className="w-10 h-10 mr-3 border border-gray-200 rounded-full object-cover cursor-pointer"
        />
      </Link>

      <div className="flex flex-col min-w-0">
        <Link to="/user-profile" className="truncate">
          <div className="text-sm sm:text-base font-semibold text-gray-900 truncate hover:underline">
            {getFirstName(user?.name)}
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="text-xs sm:text-sm text-red-500 hover:text-red-600 transition font-medium cursor-pointer hover:underline"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </div>
  ) : (
    <div className="flex">
      <button
        onClick={onLoginClick}
        className="bg-linear-to-r from-purple-700 via-purple-600 to-purple-500 text-white font-semibold rounded-full px-4 py-2 sm:px-5 sm:py-2.5 shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm sm:text-base cursor-pointer"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="auth-modal"
      >
        {/* you can replace with an icon on small screens if desired */}
        <span className="truncate">Login / Signup</span>
      </button>
    </div>
  );
};

export default ProfileInfoCard;
