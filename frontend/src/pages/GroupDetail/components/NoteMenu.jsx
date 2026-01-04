import React, { useState, useContext } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { toast } from "react-toastify";
import { UserContext } from "../../../context/userContext";

const NoteMenu = ({ note, onClose }) => {
  const { user } = useContext(UserContext);
  const [error, setError] = useState("");

  if (!note || note?.uploadedBy._id !== user._id) {
    return (
      <p className="my-2 text-red-500">You can only delete your own notes.</p>
    );
  }

  const handleNoteDelete = async () => {
    try {
      await axiosInstance.delete(API_PATHS.NOTE.DELETE_NOTE, {
        data: { noteId: note._id },
      });

      toast.success("Note Deleted.");
      setError("");
      onClose();
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred. Please try again.");
      toast.error("Cannot delete note.");
    }
  };

  return (
    <div className="p-2">
      <p className="mb-4 text-gray-700">
        Are you sure you want to delete this note?
      </p>
      {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
      <button
        type="button"
        onClick={handleNoteDelete}
        className="w-full text-base font-semibold bg-red-400 text-white rounded-2xl px-4 py-2 font-sans mb-2 hover:bg-red-500 transition-colors cursor-pointer"
      >
        Delete Note
      </button>
    </div>
  );
};

export default NoteMenu;
