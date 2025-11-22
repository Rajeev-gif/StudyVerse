const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, requied: true },
    profileImageUrl: { type: String, default: null },
    groupsJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
