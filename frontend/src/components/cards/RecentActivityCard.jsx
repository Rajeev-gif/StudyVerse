import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { BASE_URL } from "../../utils/apiPaths";
import moment from "moment";
import { FaFileAlt, FaUser, FaClock, FaArrowRight } from "react-icons/fa";

const RecentActivityCard = ({
  title,
  groupId,
  uploaderName,
  uploaderProfileImage,
  noteUrl,
  uploadedAt,
}) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.NOTE.GET_NOTES(groupId)
        );
        setActivities(response.data.slice(0, 5));
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching activities: ", error);
      }
    };
    if (groupId) fetchActivities();
  }, [groupId]);

  return groupId ? (
    <div className="p-6 bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
        <FaFileAlt className="mr-2 text-blue-500" />
        Recent Activity
      </h3>
      <div className="space-y-3">
        {activities.map((note) => (
          <div
            key={note._id}
            className="p-4 bg-linear-to-r from-gray-100 to-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-gray-300"
          >
            <p className="text-base font-semibold text-gray-800 mb-1">
              {note.title}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <div className="flex items-center">
                <FaUser className="mr-1 text-blue-500" />
                <span>{note.uploadedBy.username}</span>
                <FaClock className="ml-3 mr-1 text-gray-500" />
                <span>{moment(note.createdAt).fromNow()}</span>
              </div>
            </div>
            <div className="flex justify-end">
              <a
                href={`${note.noteUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md"
              >
                Open
                <FaArrowRight className="ml-2" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-100 rounded-2xl shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-center">
        <img
          src={uploaderProfileImage || ""}
          alt=""
          className="w-12 h-12 mr-4 border-2 border-blue-300 rounded-full object-cover cursor-pointer hover:border-blue-500 transition-colors"
        />
        <div className="flex-1">
          <p className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
            {uploaderName}
          </p>
          <Link
            to={`${noteUrl}`}
            className="block text-base text-gray-700 hover:text-blue-500 transition-colors mt-1"
          >
            {title}
          </Link>
          <p className="text-sm text-gray-500 mt-1 flex items-center">
            <FaClock className="mr-1" />
            {moment(uploadedAt).fromNow()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecentActivityCard;
