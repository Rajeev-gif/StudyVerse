import React, { useState, useContext } from "react";
import Input from "../../../components/inputs/Input";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../../context/userContext";

const MessageMenu = ({ message, onClose }) => {
  const { user } = useContext(UserContext);
  const [modifiedContent, setModifiedContent] = useState("");
  const [error, setError] = useState("");

  if (!message || message.sender._id !== user._id) {
    return (
      <p className="my-2 text-red-500">
        You can only edit or delete your own messages.
      </p>
    );
  }

  const messageId = message._id;

  const handleMessageModify = async (e) => {
    // e.preventDefault();

    if (!modifiedContent.trim()) {
      setError("Message cannot be empty");
      return;
    }

    try {
      await axiosInstance.put(API_PATHS.MESSAGE.EDIT_MESSAGE(messageId), {
        content: modifiedContent,
      });

      toast.success("Message Edited.");
      setModifiedContent("");
      setError("");
      onClose();
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred. Please try again.");
      toast.error("Cannot edit message.");
    }
  };

  const handleMessageDelete = async () => {
    try {
      await axiosInstance.delete(API_PATHS.MESSAGE.DELETE_MESSAGE(messageId));

      setError("");
      toast.success("Message Deleted.");
      onClose();
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred. Please try again.");
      toast.error("Cannot delete message.");
    }
  };

  return (
    <div className="p-2">
      <div className="">
        <Input
          value={modifiedContent}
          onChange={({ target }) => setModifiedContent(target.value)}
          label="Enter Message"
          placeholder="Modified Message"
          type="text"
        />
        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
        <button
          type="submit"
          onClick={(e) => handleMessageModify(e)}
          className="w-full text-base font-semibold bg-blue-500 text-white rounded-2xl px-4 py-2 font-sans mb-2 hover:bg-blue-600 transition-colors cursor-pointer"
        >
          Edit Message
        </button>
      </div>
      <button
        type="submit"
        onClick={() => handleMessageDelete()}
        className="w-full text-base font-semibold bg-red-400 text-white rounded-2xl px-4 py-2 font-sans mb-2 hover:bg-red-500 transition-colors cursor-pointer"
      >
        Delete Message
      </button>
    </div>
  );
};

export default MessageMenu;
