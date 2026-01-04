import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Navbar from "../../components/layoutes/Navbar";
import GroupHeader from "./components/GroupHeader";
import ChatFeed from "./components/ChatFeed";
import RecentActivityCard from "../../components/cards/RecentActivityCard";
import Modal from "../../components/loader/Modal";
import NoteSelector from "../../components/inputs/NoteSelector";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from "../../socket/socket";
import MessageMenu from "./components/MessageMenu";
import NoteMenu from "./components/NoteMenu";

// Skeleton loader
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Icons
import { ImAttachment } from "react-icons/im";
import { IoIosSend } from "react-icons/io";

const GroupChat = () => {
  const { groupId } = useParams();
  const { user } = useContext(UserContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [openMessageMenuModal, setOpenMessageMenuModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [openNoteMenuModal, setOpenNoteMenuModal] = useState(false);
  const [selectedNoteForMenu, setSelectedNoteForMenu] = useState(null);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected on frontend:", socket.id);
      socket.emit("join_group", groupId); // ✔ JOIN ONLY AFTER CONNECT
    });

    socket.on("receive_message", (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    socket.on("update_message", (updatedMsg) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMsg._id ? updatedMsg : msg))
      );
    });

    socket.on("delete_message", (messageId) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    socket.on("delete_note", (noteId) => {
      setMessages((prev) =>
        prev.filter(
          (item) => !(item.type === "note" && item.note._id === noteId)
        )
      );
    });

    socket.on("new_note", (note) => {
      setMessages((prev) => [
        ...prev,
        { type: "note", note, createdAt: new Date(note.createdAt) },
      ]);
    });

    return () => {
      socket.off("receive_message");
      socket.off("update_message");
      socket.off("delete_message");
      socket.off("delete_note");
      socket.off("new_note");
      socket.off("connect");
      socket.disconnect();
    };
  }, [groupId]);

  useEffect(() => {
    const fetchGroupAndMessages = async () => {
      try {
        const groupRes = await axiosInstance.get(
          API_PATHS.GROUP.GET_ONE(groupId)
        );
        setGroup(groupRes.data);

        const msgRes = await axiosInstance.get(
          API_PATHS.MESSAGE.GET_MESSAGES(groupId)
        );

        const noteRes = await axiosInstance.get(
          API_PATHS.NOTE.GET_NOTES(groupId)
        );

        const combinedFeed = [
          ...msgRes.data.map((m) => ({
            ...m,
            type: "message",
            createdAt: new Date(m.createdAt),
          })),
          ...noteRes.data.map((n) => ({
            ...n,
            type: "note",
            createdAt: new Date(n.createdAt),
          })),
        ].sort((a, b) => a.createdAt - b.createdAt);

        setMessages(combinedFeed);
      } catch (error) {
        console.error("Error fetching group or messages or notes: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroupAndMessages();
  }, [groupId]);

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedNote) return;

    const messageData = {
      groupId,
      content: newMessage,
    };

    try {
      // Save the message to the database
      const res = await axiosInstance.post(
        API_PATHS.MESSAGE.SEND_MESSAGE(groupId),
        {
          content: newMessage,
        }
      );

      setNewMessage("");
      setSelectedNote(null);
    } catch (error) {
      console.error("Error sending message: ", error);
      toast.error("Failed to send message.");
    }
  };

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setOpenNoteModal(false);
  };

  const messageRightClick = (message) => {
    setSelectedMessage(message);
    setOpenMessageMenuModal(true);
  };

  const noteRightClick = (note) => {
    setSelectedNoteForMenu(note);
    setOpenNoteMenuModal(true);
  };

  if (loading)
    return (
      <div>
        <Skeleton width="100%" height="100vh" />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar extraClassName="" />
      <GroupHeader group={group} />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 md:flex-[0.75] flex flex-col">
          <ChatFeed
            onMessageRightClick={messageRightClick}
            onNoteRightClick={noteRightClick}
            messages={messages}
            notes={notes}
          />
          <div className="p-2 md:p-4 flex items-center gap-2 bg-slate-100">
            <button
              onClick={() => setOpenNoteModal(true)}
              className="text-base md:text-xl px-3 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-400 transition cursor-pointer"
            >
              <ImAttachment />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 text-sm md:text-lg px-3 py-2 bg-white shadow-gray-400 shadow-2xl hover:shadow-xl focus:shadow-xl outline-none transition rounded-2xl text-slate-800"
            />
            <button
              onClick={sendMessage}
              className="text-lg md:text-2xl px-3 py-3 bg-green-600 text-white rounded-full hover:bg-green-500 transition cursor-pointer"
            >
              <IoIosSend />
            </button>
          </div>
        </div>
        <div className="hidden md:block md:flex-[0.25] border-3 rounded-2xl border-slate-300 hover:border-slate-400 my-2 mr-2 shadow-xl hover:shadow-2xl transition">
          <RecentActivityCard groupId={groupId} />
        </div>
      </div>

      <Modal
        isOpen={openNoteModal}
        onClose={() => setOpenNoteModal(false)}
        title="Upload a Note"
      >
        <NoteSelector onSelect={handleNoteSelect} groupId={groupId} />
      </Modal>

      <Modal
        isOpen={openMessageMenuModal}
        onClose={() => setOpenMessageMenuModal(false)}
        title="Edit or Delete Message"
      >
        <MessageMenu
          message={selectedMessage}
          onClose={() => setOpenMessageMenuModal(false)}
        />
      </Modal>

      <Modal
        isOpen={openNoteMenuModal}
        onClose={() => setOpenNoteMenuModal(false)}
        title="Delete Note"
      >
        <NoteMenu
          note={selectedNoteForMenu}
          onClose={() => setOpenNoteMenuModal(false)}
        />
      </Modal>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default GroupChat;
