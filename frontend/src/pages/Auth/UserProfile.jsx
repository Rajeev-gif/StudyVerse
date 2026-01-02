import React, { useContext, useEffect, useState } from "react";
import CopyButton from "../../components/layoutes/CopyButton";
import Navbar from "../../components/layoutes/Navbar";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Link } from "react-router-dom";

// Skeleton loader
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UserProfile = () => {
  const { user, loading: userLoading } = useContext(UserContext);
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user?.groupsJoined?.length) {
        setLoadingGroups(false);
        return;
      }

      try {
        const groupPromises = user.groupsJoined.map((groupId) =>
          axiosInstance.get(API_PATHS.GROUP.GET_DETAILS(groupId))
        );
        const responses = await Promise.all(groupPromises);
        setGroups(responses.map((res) => res.data));
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoadingGroups(false);
      }
    };

    if (user) fetchGroups();
  }, [user]);

  if (userLoading || !user) {
    return (
      <div>
        <Skeleton width="100%" height="100vh" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                User Profile
              </h1>
              <p className="text-gray-600">Manage your account information</p>
            </div>

            {/* Profile Image and Basic Info */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <img
                  src={
                    user.profileImageUrl ||
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                />
                <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {user.username}
                </h2>
                <p className="text-lg text-gray-600 mb-4">{user.email}</p>

                <div className="bg-gray-50 rounded-lg py-2 inline-block">
                  <p className="text-sm text-gray-500 mb-1">User ID</p>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-sm md:text-base bg-gray-200 px-3 py-1 rounded-2xl ">
                      {user._id}
                    </span>
                    <CopyButton textToCopy={user._id} className="" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Joined Groups */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Joined Groups
            </h3>

            {loadingGroups ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} height={80} className="rounded-lg" />
                ))}
              </div>
            ) : groups.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {groups.map((group) => (
                  <Link
                    key={group._id}
                    to={`/group-chat/${group._id}`}
                    className="block bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {group.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-lg">
                          {group.name}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {group.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {group.members?.length || 0} members
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">📚</span>
                </div>
                <h4 className="text-lg font-medium text-gray-600 mb-2">
                  No Groups Joined
                </h4>
                <p className="text-gray-500">
                  Join some groups to start collaborating!
                </p>
                <Link
                  to="/dashboard"
                  className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Browse Groups
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
