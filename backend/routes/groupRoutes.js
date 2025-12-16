const express = require("express");
const {
  createGroup,
  joinGroup,
  getGroupDetails,
  getAllGroups,
  getGroupById,
  deleteGroup,
  leaveGroup,
  addGroupMember,
  removeGroupMember,
} = require("../controllers/groupController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Group routes
router.post("/create", protect, createGroup);
router.post("/join", protect, joinGroup);
router.post("/add-member", protect, addGroupMember);
router.post("/remove-member", protect, removeGroupMember);
router.get("/details", protect, getGroupDetails);
router.get("/all", protect, getAllGroups);
router.get("/:groupId", protect, getGroupById);
router.delete("/delete/:groupId", protect, deleteGroup);
router.delete("/leave/:grouoId", protect, leaveGroup);

module.exports = router;
