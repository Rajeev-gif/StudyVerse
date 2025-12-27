const express = require("express");
const {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
} = require("../controllers/messageController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// message routes
router.post("/send/:id", protect, sendMessage);
router.get("/messages/:id", protect, getMessages);
router.put("/edit/:id", protect, editMessage);
router.delete("/delete/:id", protect, deleteMessage);

module.exports = router;
