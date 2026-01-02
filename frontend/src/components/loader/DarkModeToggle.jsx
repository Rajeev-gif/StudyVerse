import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { MdOutlineDarkMode } from "react-icons/md";
import { LuSun } from "react-icons/lu";

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="text-2xl w-8 h-8 rounded-full cursor-pointer"
    >
      {/* {isDarkMode ? <LuSun /> : <MdOutlineDarkMode />} */}
    </button>
  );
};

export default DarkModeToggle;
