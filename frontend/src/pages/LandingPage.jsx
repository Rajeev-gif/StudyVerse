import React, { useState } from "react";
import Navbar from "../components/layoutes/Navbar";
import { Link, useNavigate } from "react-router-dom";
import HERO_IMG from "../assets/hero-img(7).png";
import HERO_IMG_2 from "../assets/hero-img(6).png";
import { APP_FEATURES } from "../utils/data";

import { FaUserGroup } from "react-icons/fa6";
import { TbNotes } from "react-icons/tb";
import { MdChat } from "react-icons/md";
import { PiUserCircleDuotone } from "react-icons/pi";
import { MdOutlineMenuBook } from "react-icons/md";
import { IoMdArrowRoundForward } from "react-icons/io";
import { IoMdArrowRoundDown } from "react-icons/io";

const LandingPage = () => {
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    // prev color: bg-[#BDE0FE]
    <div className="bg-linear-to-r from-cyan-200 via-cyan-100 to-cyan-50 w-full min-h-screen relative overflow-x-hidden">
      {/* Header */}
      <Navbar extraClassName="bg-linear-to-r from-cyan-200 via-cyan-100 to-cyan-50 border-none" />

      {/* Hero Section */}
      <div className="">
        <div className="w-full min-h-[500px]">
          <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center md:items-start md:justify-between gap-10">
            <div className="flex flex-col gap-5 md:gap-6 lg:gap-8 text-left">
              <div className="text-4xl md:text-5xl font-semibold leading-tight font-sans">
                Collaborate. Share
                <br />
                Notes.{" "}
                <span className="animated-gradient-text bg-linear-to-r from-blue-600 via-blue-500 to-blue-400 inline-block p-1">
                  Learn Together.
                </span>
              </div>
              <div className="text-xl md:text-2xl font-medium leading-tight">
                Empowering students to connect, chat,
                <br />
                and grow through interactive study groups.
              </div>
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-4 items-start">
                <button
                  onClick={handleCTA}
                  type="button"
                  className="bg-[#ff9fc2] text-white font-semibold rounded-full px-4 py-2 sm:px-8 sm:py-2.5 shadow-md hover:shadow-lg transition text-sm sm:text-base w-auto sm:w-auto cursor-pointer"
                >
                  Join Now
                </button>
                <button
                  onClick={handleCTA}
                  type="button"
                  className="bg-gray-50 text-black font-semibold rounded-full px-4 py-2 sm:px-8 sm:py-2.5 shadow-md hover:shadow-lg transition text-sm sm:text-base w-auto sm:w-auto cursor-pointer"
                >
                  Explore Groups
                </button>
              </div>
            </div>
            <div className="flex justify-center w-full md:justify-end  md:w-auto">
              <img
                src={HERO_IMG}
                alt="Study group img"
                className="w-full max-w-lg md:max-w-xl h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Feature section */}
      <div className="bg-gray-50 py-12 text-center  rounded-2xl">
        <h2 className="text-2xl md:text-3xl font-semibold my-8 font-sans">
          Features Make You Shine
        </h2>

        {/* First 3 cards */}
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 justify-items-center">
          {APP_FEATURES.slice(0, 3).map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-center text-center border-4 border-blue-200 rounded-2xl p-6 bg-linear-to-r from-blue-100 to-blue-50 shadow-blue-100 shadow-md hover:shadow-lg transition"
            >
              <span className="text-5xl md:text-6xl mb-4 text-blue-500 flex justify-center">
                {feature.id === "01" && <FaUserGroup />}
                {feature.id === "02" && <TbNotes />}
                {feature.id === "03" && <MdChat />}
              </span>
              <h3 className="text-2xl md:text-3xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-md md:text-lg text-gray-700 font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonials Strip */}
        <div className=""></div>

        {/* How it works section */}
        <div className="container mx-auto px-4 mt-20 text-center">
          <div className="flex flex-col md:flex-row items-center justify-around gap-6 md:gap-8">
            {/* <img src={HERO_IMG_2} alt="" className="max-h-80" /> */}
            <h2 className="text-2xl md:text-3xl font-sans font-semibold my-8">
              How It Works...
            </h2>
          </div>

          {/* Remaining 3 cards (How It Works) - simplified layout and responsive arrows */}
          <div className="container mx-auto px-4 mt-4 mb-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
              {APP_FEATURES.slice(3).map((feature, idx, arr) => (
                <React.Fragment key={feature.id}>
                  <div className="flex flex-col items-center text-center py-6 md:py-10 border-4 border-blue-200 rounded-2xl p-6 bg-linear-to-r from-blue-100 to-blue-50 shadow-blue-100 shadow-md hover:shadow-lg transition w-full md:w-1/3">
                    <span className="text-4xl md:text-5xl mb-3 text-blue-500">
                      {feature.id === "04" && <PiUserCircleDuotone />}
                      {feature.id === "05" && <FaUserGroup />}
                      {feature.id === "06" && <MdOutlineMenuBook />}
                    </span>
                    <h3 className="text-xl md:text-2xl font-semibold">
                      {feature.title}
                    </h3>
                  </div>

                  {/* show arrow between cards only (not after last) */}
                  {idx < arr.length - 1 && (
                    <div className="flex items-center justify-center">
                      {/* down arrow on small screens, right arrow on md+ */}
                      <IoMdArrowRoundDown className="text-3xl text-blue-500 md:hidden" />
                      <IoMdArrowRoundForward className="hidden md:inline-block text-3xl text-blue-500" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center">
        <p className="text-gray-600 text-base">
          &copy;2025 StudyVerse. All rights reserved.
        </p>
        <p className="mt-2">Made with❤️...happy coding.</p>
      </div>
    </div>
  );
};

export default LandingPage;
