import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProfileInfoCard = () => {
  // user is null for unauthenticated state; keep as placeholder for now
  const [user, setUser] = useState(null);
  const [openAuthModal, setOpenAuthModal] = useState(false);

  const handleLogout = () => {
    // implement logout logic
    console.log("logout clicked");
  };

  return user ? (
    <div className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm transition-colors hover:shadow-md">
      <Link to="/user-profile" className="shrink-0">
        <img
          src={
            user?.avatar ||
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
          }
          alt={user?.name ? `${user.name} avatar` : "User avatar"}
          className="w-9 h-9 mr-3 border border-gray-200 rounded-full object-cover cursor-pointer"
        />
      </Link>

      <div className="flex flex-col min-w-0">
        <Link to="/user-profile" className="truncate">
          <div className="text-sm sm:text-base font-semibold text-gray-900 truncate hover:underline">
            {user?.name || "Steve"}
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="text-xs sm:text-sm text-red-500 hover:text-red-600 font-medium cursor-pointer hover:underline"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </div>
  ) : (
    <div className="flex">
      <button
        onClick={() => setOpenAuthModal(true)}
        className="bg-linear-to-r from-purple-700 via-purple-600 to-purple-500 text-white font-semibold rounded-full px-4 py-2 sm:px-5 sm:py-2.5 shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm sm:text-base cursor-pointer"
        aria-haspopup="dialog"
        aria-expanded={openAuthModal}
      >
        {/* you can replace with an icon on small screens if desired */}
        <span className="truncate">Login / Signup</span>
      </button>
    </div>
  );
};

export default ProfileInfoCard;
