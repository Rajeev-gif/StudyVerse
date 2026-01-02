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
router.post("/add-member/:id", protect, addGroupMember);
router.post("/remove-member/:id", protect, removeGroupMember);
router.get("/details/:id", protect, getGroupDetails);
router.get("/all", protect, getAllGroups);
router.get("/:id", protect, getGroupById);
router.delete("/delete/:id", protect, deleteGroup);
router.delete("/leave/:id", protect, leaveGroup);

module.exports = router;
