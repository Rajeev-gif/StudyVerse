import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { formatDate, getFirstName } from "../../utils/helper";
import DashboardLayout from "../../components/layoutes/DashboardLayout";
import GroupCard from "../../components/cards/GroupCard";
import { CARD_BG } from "../../utils/data";
import moment from "moment";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/loader/Modal";
import CreateGroupForm from "../../components/inputs/CreateGroupForm";
import RecentActivityCard from "../../components/cards/RecentActivityCard";
import useSocketListeners from "../../utils/useSocketListeners";
import JoinGroupForm from "../../components/inputs/JoinGroupForm";

const Dashboard = () => {
  const navigate = useNavigate();
  useSocketListeners();

  const [search, setSearch] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);

  const { user } = useContext(UserContext);
  const firstName = getFirstName(user?.username);

  const fetchAllGroups = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.GROUP.GET_ALL);
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching the group data: ", error);
    }
  };

  const fetchRecentNotes = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.NOTE.GET_RECENT_NOTES);
      setRecentNotes(response.data);
    } catch (error) {
      console.error("Error fetching the recent notes: ", error);
    }
  };

  useEffect(() => {
    fetchAllGroups();
    fetchRecentNotes();
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="w-full mx-2 md:mx-4 py-4">
        <div className="flex flex-col w-full items-start px-4 md:px-1">
          <h2 className="text-lg md:text-xl font-semibold">
            Welcome, <span className="font-sans">{firstName}</span>!
          </h2>
          <p className="text-sm md:text-[1rem] text-gray-700 py-1">
            Manage your study groups and start collaborating.
          </p>
        </div>
        <div className="flex flex-col gap-4 md:flex-row items-center w-full my-2">
          <div className="w-full md:w-[60%]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 border-none bg-white hover:bg-gray-50 transition rounded-2xl focus:outline-none hover:shadow-lg focus:shadow-sm"
              placeholder="Search groups..."
              type="text"
            />
          </div>

          <div className="items-end w-full md:w-[40%] flex justify-evenly text-center gap-4">
            <button
              onClick={() => setOpenJoinModal(true)}
              className="w-full px-2 py-2.5 font-serif font-medium text-sm md:text-lg bg-[#fd78a9] hover:bg-[#f85893] transition text-white rounded-2xl cursor-pointer hover:shadow-lg"
            >
              Join Group
            </button>
            <button
              onClick={() => setOpenCreateModal(true)}
              className="w-full px-2 py-2.5 font-serif font-medium text-sm md:text-lg bg-blue-700 hover:bg-blue-600 transition text-white rounded-2xl cursor-pointer hover:shadow-lg"
            >
              + Create Group
            </button>
          </div>
        </div>
        {groups?.length < 1 ? (
          <div className="flex flex-col items-center justify-center text-center h-[80vh]">
            <div className="">
              <h1 className="text-5xl md:text-6xl font-semibold bg-linear-to-l from-gray-600 via-gray-950 to-gray-700 text-transparent bg-clip-text my-4">
                No Groups Found!
              </h1>
              <span className="text-md md:text-lg font-serif ">
                Let's Fire Up Your Academic Performance By Creating One.
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full mx-auto my-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-[70%] bg-white rounded-2xl p-4">
                <h2 className="text-xl md:text-2xl font-medium font-serif">
                  Your Study Groups
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 pt-1 pb-6 md:px-0">
                  {filteredGroups?.map((data, index) => (
                    <GroupCard
                      key={data?._id}
                      colors={CARD_BG[index % CARD_BG.length]}
                      name={data?.name || ""}
                      description={data?.description || ""}
                      members={data?.members?.length || ""}
                      notes={data?.notes?.length || ""}
                      createdAt={
                        data?.createdAt ? formatDate(data?.createdAt) : ""
                      }
                      lastUpdated={
                        data?.updatedAt
                          ? moment(data.updatedAt).format("Do MMM YYYY")
                          : ""
                      }
                      onSelect={() => navigate(`/group-chat/${data?._id}`)}
                    />
                  ))}
                </div>
              </div>
              <div className="w-full md:w-[30%] bg-white rounded-2xl p-4">
                <h2 className="text-xl md:text-2xl font-medium font-serif">
                  Recent Activity
                </h2>
                <div className="space-y-2">
                  {recentNotes.length > 0 ? (
                    recentNotes.map((note, index) => (
                      <RecentActivityCard
                        key={index}
                        title={note.title}
                        groupName={note.group.name}
                        uploaderName={note.uploadedBy.username}
                        uploaderProfileImage={note.uploadedBy.profileImageUrl}
                        noteUrl={note.noteUrl}
                        uploadedAt={note.createdAt}
                        onSelect
                      />
                    ))
                  ) : (
                    <p className="text-sm md:text-lg text-gray-600">
                      No Recent Activity.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
        }}
        hideHeader
      >
        <div>
          <CreateGroupForm
            onSuccess={() => {
              setOpenCreateModal(false);
              fetchAllGroups();
            }}
          />
        </div>
      </Modal>
      <Modal
        isOpen={openJoinModal}
        onClose={() => {
          setOpenJoinModal(false);
        }}
        hideHeader
      >
        <div>
          <JoinGroupForm
            onSuccess={() => {
              setOpenJoinModal(false);
              fetchAllGroups();
            }}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
