import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Input from "./Input";

const CreateGroupForm = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addMember = async () => {
    if (!username.trim()) return;
    try {
      const response = await axiosInstance.get(
        API_PATHS.AUTH.SEARCH_USER(username.trim())
      );
      const users = response.data;
      if (users.length === 1) {
        const user = users[0];
        if (!members.some((m) => m._id === user._id)) {
          setMembers([...members, { _id: user._id, username: user.username }]);
          setUsername("");
          setError("");
        } else {
          setError("User already added");
        }
      } else if (users.length > 1) {
        setError("Multiple users found, please be more specific");
      } else {
        setError("User not found");
      }
    } catch (err) {
      setError("Failed to find user");
    }
  };

  const removeMember = (id) => {
    setMembers(members.filter((m) => m._id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Group name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axiosInstance.post(API_PATHS.GROUP.CREATE, {
        name: name.trim(),
        description: description.trim(),
        members: members.map((m) => m._id),
      });
      onSuccess(); // Close modal and refresh groups
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group Name *
          </label>
          <Input
            type="text"
            value={name}
            onChange={({ target }) => setName(target.value)}
            placeholder="Enter group name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-transparent outline-none border border-slate-300 rounded-2xl px-3 p-2 text-sm text-slate-800 focus:border-slate-800 hover:border-slate-500 transition"
            placeholder="Enter group description (optional)"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add Members (by username)
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              placeholder="Enter username"
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addMember())
              }
            />
            <button
              type="button"
              onClick={addMember}
              className="px-2 my-6 bg-green-600 text-white rounded-2xl hover:bg-green-700"
            >
              Add
            </button>
          </div>
          {members.length > 0 && (
            <div className="mt-2 space-y-1">
              {members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between bg-gray-100 px-3 py-1 rounded"
                >
                  <span>{member.username}</span>
                  <button
                    type="button"
                    onClick={() => removeMember(member._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </form>
    </div>
  );
};

export default CreateGroupForm;
