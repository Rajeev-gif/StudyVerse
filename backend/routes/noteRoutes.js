const express = require("express");
const {
  uploadNote,
  getAllNotes,
  getNoteById,
  deleteNote,
} = require("../controllers//noteController");

const { protect } = require("../middlewares/authMiddleware");
const { uploadNotes } = require("../middlewares/uploadMiddleware");

const router = express.Router();

// message routes
router.post(
  "/upload/:groupId",
  protect,
  uploadNotes.single("noteFile"),
  uploadNote
);
router.get("/notes/:groupId", protect, getAllNotes);
router.get("/search/find", protect, getNoteById);
router.delete("/delete/:noteId", protect, deleteNote);

module.exports = router;
