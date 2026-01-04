import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/layoutes/Navbar";
import { UserContext } from "../../context/userContext";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../../socket/socket";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { formatDate } from "../../utils/helper";
import RecentActivityCard from "../../components/cards/RecentActivityCard";
import Modal from "../../components/loader/Modal";
import CopyButton from "../../components/layoutes/CopyButton";

// Skeleton loader
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MemberCard = ({ member, isOnline, isAdmin }) => (
  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="relative">
      <img
        src={
          member.profileImageUrl ||
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
        }
        alt={member.username}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div
        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
          isOnline ? "bg-green-500" : "bg-gray-400"
        }`}
      ></div>
    </div>
    <div className="flex-1">
      <p className="font-medium text-gray-800">{member.username}</p>
      {isAdmin && (
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          Admin
        </span>
      )}
    </div>
  </div>
);

const GroupDetail = () => {
  const { user, loading: userLoading } = useContext(UserContext);
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [openAddMemberForm, setOpenAddMemberForm] = useState(false);
  const [openKickMemberForm, setOpenKickMemberForm] = useState(false);
  const [openLeaveGroupAlert, setOpenLeaveGroupAlert] = useState(false);
  const [openDeleteGroupAlert, setOpenDeleteGroupAlert] = useState(false);

  const [newMember, setNewMember] = useState("");
  const [kickMember, setKickMember] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    if (!user) return; // Wait for user to load

    socket.connect();
    socket.emit("join_group", groupId);
    socket.emit("you_are_online", user._id);

    socket.on("user_online", (userId) => {
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    });

    socket.on("user_offline", (userId) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socket.emit("you_are_offline", user._id);
      socket.disconnect();
    };
  }, [groupId, user]);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.GROUP.GET_DETAILS(groupId)
        );
        setGroup(response.data);
      } catch (error) {
        console.error("Error fetching group details: ", error);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  if (!group)
    return (
      <div>
        <Skeleton width="100%" height="100vh" />
      </div>
    );

  const addMember = async () => {
    try {
      await axiosInstance.post(API_PATHS.GROUP.ADD_MEMBER(groupId), {
        memberId: newMember,
      });

      setNewMember("");
      setError("");
      setOpenAddMemberForm(false);
      // Optionally refetch group details
    } catch (error) {
      setError("Error while adding member.");
      console.error("Error while adding member: ", error);
    }
  };

  const removeMember = async () => {
    try {
      await axiosInstance.post(API_PATHS.GROUP.REMOVE_MEMBER(groupId), {
        memberId: kickMember,
      });

      setKickMember("");
      setError("");
      setOpenKickMemberForm(false);
      // Refetch group details
      const response = await axiosInstance.get(
        API_PATHS.GROUP.GET_DETAILS(groupId)
      );
      setGroup(response.data);
    } catch (error) {
      setError("Error while removing member.");
      console.error("Error while removing member: ", error);
    }
  };

  const leaveGroup = async () => {
    try {
      await axiosInstance.delete(API_PATHS.GROUP.LEAVE(groupId));

      setError("");
      setOpenLeaveGroupAlert(false);
      navigate("/dashboard"); // Navigate to dashboard after leaving
    } catch (error) {
      setError("Error while leaving group.");
      console.error("Error while leaving group: ", error);
    }
  };

  const deleteGroup = async () => {
    try {
      await axiosInstance.delete(API_PATHS.GROUP.DELETE(groupId));

      setError("");
      setOpenDeleteGroupAlert(false);
      navigate("/dashboard"); // Navigate to dashboard after deleting
    } catch (error) {
      setError("Error while deleting group.");
      console.error("Error while deleting group: ", error);
    }
  };

  if (userLoading || !user) {
    return (
      <div>
        <Skeleton width="100%" height="100vh" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-gray-50">
      <Navbar />
      <div className="relative">
        <div className="w-full flex items-center text-center justify-center bg-gray-100 shadow-gray-400 shadow-lg">
          <h2 className="text-2xl font-semibold font-sans my-4 gradient-text">
            Group Details
          </h2>
        </div>
        <div className="bg-gray-50 mt-2 mb-8 mx-4 md:mx-8 rounded-2xl shadow-gray-600 shadow-xl border-3 border-gray-300">
          <div className="p-4 md:p-8 bg-gray-100 rounded-2xl">
            <div className="w-full flex flex-col items-center gap-4">
              <div className="bg-gray-100 rounded-t-lg text-center flex flex-col gap-3 my-4">
                <h1 className="text-2xl md:text-4xl font-serif mt-1">
                  {group.name}
                </h1>
                <p className="text-sm md:text-base font-medium">
                  {group.description}
                </p>
                <p className="flex gap-2 items-center text-xs md:text-sm bg-blue-100 px-4 py-2 rounded-full justify-center">
                  Group ID: {group._id}
                  <CopyButton textToCopy={group._id} className="text-sm" />
                </p>
              </div>
              <hr className="w-[70%] h-0.5 border-none bg-linear-to-r from-gray-100 via-gray-500 to-gray-100 rounded-2xl" />
              <div className="w-full flex flex-col md:flex-row gap-4 items-start">
                <img
                  src={
                    group.createdBy?.profileImageUrl ||
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
                  }
                  className="w-17 h-17 md:w-20 md:h-20 rounded-full mx-auto md:mx-0 object-cover"
                  alt="admin image"
                />
                <div className="flex flex-col w-full items-center md:items-start mt-2">
                  <h3 className="font-sans font-semibold text-lg md:text-xl">
                    {group.createdBy.username}
                  </h3>
                  <p className="bg-gray-700 text-white px-3 py-1 my-1 rounded-full w-fit">
                    Admin
                  </p>
                  <p className="text-xs text-gray-600 my-1">
                    Created On: {formatDate(group.createdAt)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-between gap-4 mt-8">
              <div className="w-full lg:w-[50%] bg-white flex flex-col rounded-2xl p-4">
                <p className="text-base md:text-lg font-semibold mb-3">
                  Members ({group.members?.length || 0}):{" "}
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {group.members?.map((member) => (
                    <MemberCard
                      key={member._id}
                      member={member}
                      isOnline={onlineUsers.includes(member._id)}
                      isAdmin={member._id === group.createdBy._id}
                    />
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-[50%]">
                <RecentActivityCard groupId={groupId} />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-center p-4">
            <button
              onClick={() => setOpenAddMemberForm(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Member
            </button>
            {user._id !== group.createdBy._id && (
              <button
                onClick={() => setOpenLeaveGroupAlert(true)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Leave Group
              </button>
            )}
            {user._id === group.createdBy._id && (
              <>
                <button
                  onClick={() => setOpenKickMemberForm(true)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Remove Member
                </button>
                <button
                  onClick={() => setOpenDeleteGroupAlert(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete Group
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={openAddMemberForm}
        onClose={() => setOpenAddMemberForm(false)}
        title="Add Member"
      >
        <div className="p-4">
          <input
            type="text"
            placeholder="Enter User ID"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          />
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button
            onClick={addMember}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Member
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={openLeaveGroupAlert}
        onClose={() => setOpenLeaveGroupAlert(false)}
        title="Leave Group"
      >
        <div className="p-4">
          <p className="mb-4">Are you sure you want to leave this group?</p>
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={() => setOpenLeaveGroupAlert(false)}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={leaveGroup}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Leave
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={openKickMemberForm}
        onClose={() => setOpenKickMemberForm(false)}
        title="Remove Member"
      >
        <div className="p-4">
          <select
            value={kickMember}
            onChange={(e) => setKickMember(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          >
            <option value="">Select a member to remove</option>
            {group.members
              ?.filter((m) => m._id !== user._id)
              .map((member) => (
                <option key={member._id} value={member._id}>
                  {member.username}
                </option>
              ))}
          </select>
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button
            onClick={removeMember}
            disabled={!kickMember}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            Remove Member
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={openDeleteGroupAlert}
        onClose={() => setOpenDeleteGroupAlert(false)}
        title="Delete Group"
      >
        <div className="p-4">
          <p className="mb-4">
            Are you sure you want to delete this group? This action cannot be
            undone.
          </p>
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={() => setOpenDeleteGroupAlert(false)}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={deleteGroup}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GroupDetail;
