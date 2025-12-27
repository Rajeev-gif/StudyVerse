import React, { useState } from "react";
import { uploadNote } from "../../utils/upload";
import { toast, ToastContainer } from "react-toastify";

const ALLOWED_EXTS = ["pdf", "doc", "docx"]; // Your defined formats

const NoteSelector = ({ onSelect, groupId }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const ext = selectedFile.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      setError(`Invalid file type. Allowed: ${ALLOWED_EXTS.join(", ")}`);
      setFile(null);
      return;
    }
    setError("");
    setFile(selectedFile);
    if (!title) setTitle(selectedFile.name.split(".").slice(0, -1).join(".")); // Set default title
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }
    setUploading(true);
    try {
      const response = await uploadNote(file, groupId, title.trim()); // Pass title
      onSelect(response.note);
      setFile(null);
      setTitle("");
      toast.success("Note sent.");
    } catch (err) {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 my-2">
          Note Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-800 rounded-4xl transition focus:outline-none text-sm"
          placeholder="Enter note title"
        />
      </div>
      <input
        type="file"
        accept={ALLOWED_EXTS.map((ext) => `.${ext}`).join(",")}
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 transition text-white rounded-lg disabled:opacity-50 cursor-pointer"
      >
        {uploading ? "Uploading..." : "Upload Note"}
      </button>
    </div>
  );
};

export default NoteSelector;
