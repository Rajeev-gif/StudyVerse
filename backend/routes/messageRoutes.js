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
router.post("/send/:groupId", protect, sendMessage);
router.get("/messages/:groupId", protect, getMessages);
router.put("/edit/:messageId", protect, editMessage);
router.delete("/delete/:messageId", protect, deleteMessage);

module.exports = router;
