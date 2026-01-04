const express = require("express");
const {
  uploadNote,
  getAllNotes,
  getNoteById,
  getRecentNotes,
  deleteNote,
} = require("../controllers//noteController");

const { protect } = require("../middlewares/authMiddleware");
const { uploadNotes } = require("../middlewares/uploadMiddleware");

const router = express.Router();

// message routes
router.post("/upload/:id", protect, uploadNotes.single("noteFile"), uploadNote);
router.get("/notes/:id", protect, getAllNotes);
router.get("/search/find", protect, getNoteById);
router.get("/recent", protect, getRecentNotes);
router.delete("/delete/:id", protect, deleteNote);

module.exports = router;
