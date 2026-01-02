const Group = require("../models/Group");
const User = require("../models/User");
const Message = require("../models/Message");

// @desc    Create a new group
// @route   POST /api/group/create
// @access  Private
const createGroup = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    if (req.user._id === members) {
      return res
        .status(400)
        .json({ message: "Creator cannot add themselves as a member" });
    }

    const newGroup = await Group.create({
      name,
      description,
      createdBy: req.user._id,
      members: [req.user._id, ...members],
    });

    // Add group to each member's group list
    await User.updateMany(
      { _id: { $in: newGroup.members } },
      { $push: { groupsJoined: newGroup._id } }
    );

    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Join a group
// @route   POST /api/group/join
// @access  Private
const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.includes(req.user._id)) {
      group.members.push(req.user._id);
      await group.save();

      await User.findByIdAndUpdate(req.user._id, {
        $push: { groupsJoined: group._id },
      });

      res.io.to(groupId).emit("new_member", { userId: req.user._id });

      res.status(200).json({ message: "Joined group successfully" });
    } else {
      res.status(400).json({ message: "Already a member of the group" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    add group member
// @route   POST /api/group/add-member/:id
// @access  Private
const addGroupMember = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { memberId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (!group.members.includes(memberId)) {
      group.members.push(memberId);
      await group.save();

      await User.findByIdAndUpdate(memberId, {
        $push: { groupsJoined: group._id },
      });

      res.status(200).json({ message: "Member added successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    remove group member (only by admin/creator)
// @route   POST /api/group/remove-member/:id
// @access  Private
const removeGroupMember = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { memberId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (group.members.includes(memberId)) {
      group.members.pull(memberId);
      await group.save();

      await User.findByIdAndUpdate(memberId, {
        $pull: { groupsJoined: group._id },
      });

      res.status(200).json({ message: "Member removed successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get group details
// @route   GET /api/group/details/:id
// @access  Private
const getGroupDetails = async (req, res) => {
  try {
    const groupId = req.params.id;

    const group = await Group.findById(groupId)
      .populate("createdBy", "username profileImageUrl")
      .populate("members", "username profileImageUrl")
      .populate("notes");

    if (!group) {
      return res.status(404).json({ message: "Gorup not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get all groups
// @route   GET /api/group/all
// @access  Private
const getAllGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({ members: userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get a groups
// @route   GET /api/group/:id
// @access  Private
const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    delete group
// @route   DELETE /api/group/delete/:id
// @access  Private
const deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.createdBy.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: "Unauthorized" });
    } else {
      await Group.findByIdAndDelete(groupId);
      await User.updateMany(
        { _id: { $in: group.members } },
        { $pull: { groupsJoined: group._id } }
      );
    }
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    leave group
// @route   DELETE /api/group/leave/:id
// @access  Private
const leaveGroup = async (req, res) => {
  try {
    const groupId = req.params.id;

    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ message: "Group not found" });
    }

    if (group.members.includes(req.user._id)) {
      group.members.pull(req.user._id);
      await group.save();

      await User.findByIdAndUpdate(req.user._id, {
        $pull: { groupsJoined: group._id },
      });

      res.status(200).json({ message: "Left group successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  createGroup,
  joinGroup,
  getGroupDetails,
  getAllGroups,
  getGroupById,
  deleteGroup,
  leaveGroup,
  addGroupMember,
  removeGroupMember,
};
