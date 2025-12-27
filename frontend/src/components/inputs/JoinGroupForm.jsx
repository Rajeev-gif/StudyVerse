import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Input from "./Input";

const JoinGroupForm = ({ onSuccess }) => {
  const [groupId, setGroupId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupId.trim()) {
      setError("Group ID is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axiosInstance.post(API_PATHS.GROUP.JOIN, { groupId: groupId.trim() });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join the group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Join Group</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group ID *
          </label>
          <Input
            type="text"
            value={groupId}
            onChange={({ target }) => setGroupId(target.value)}
            placeholder="Enter Group ID"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#fd78a9] hover:bg-[#f85893] transition text-white py-2 px-4 rounded-full disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? "Joining..." : "Join Group"}
        </button>
      </form>
    </div>
  );
};

export default JoinGroupForm;
