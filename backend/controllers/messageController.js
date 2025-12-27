const Message = require("../models/Message");
const Group = require("../models/Group");
const User = require("../models/User");

// @desc    send a new message
// @route   POST /api/message/send/:groupId
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const senderId = req.user.id;
    const groupId = req.params.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const newMessage = new Message({
      sender: senderId,
      group: group._id,
      content,
    });

    await newMessage.save();

    await Group.findByIdAndUpdate(group._id, {
      $push: { messages: newMessage._id },
    });
    // Populate sender info for frontend display
    const populatedMessage = await Message.findById(newMessage._id).populate(
      "sender",
      "username profileImageUrl"
    );

    // Emit the new message to all group members via Socket.io
    req.io.to(group._id.toString()).emit("receive_message", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    get all group messages
// @route   GET /api/message/messages/:groupId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const messages = await Message.find({ group: group._id })
      .populate("sender", "username profileImageUrl")
      .sort({ createdAt: 1 }); //oldest to newest

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    edit a message
// @route   PUT /api/message/edit/:messageId
// @access  Private
const editMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const { content } = req.body;
    const senderId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== senderId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Message.findByIdAndUpdate(messageId, { content });

    const updatedMessage = await Message.findById(messageId).populate(
      "sender",
      "username profileImageUrl"
    );

    req.io.to(message.group.toString()).emit("update_message", updatedMessage);

    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    delete a message
// @route   DELETE /api/message/delete/:messageId
// @access  Private
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId).populate("group");
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (
      message.sender.toString() === userId &&
      message.group.createdBy.toString() === userId
    ) {
      await Message.findByIdAndDelete(messageId);
      await Message.findByIdAndUpdate(message.group, {
        $pull: { messages: messageId },
      });

      req.io.to(message.group.toString()).emit("delete_message", messageId);

      res.status(200).json({ message: "Message deleted successfully" });
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
};
