const express = require("express");
const {
  createGroup,
  joinGroup,
  getGroupDetails,
  getAllGroups,
  deleteGroup,
} = require("../controllers/groupController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Group routes
router.post("/create", protect, createGroup);
router.post("/join", protect, joinGroup);
router.get("/group-details", protect, getGroupDetails);
router.get("/all-groups", protect, getAllGroups);
router.delete("/delete-group", protect, deleteGroup);

module.exports = router;
