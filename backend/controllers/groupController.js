const Group = require("../models/Group");
const User = require("../models/User");

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
      res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.includes(req.user._id)) {
      group.members.push(req.user._id);
      await group.save();

      await User.findByIdAndUpdate(req.user._id, {
        $push: { groupsJoined: group._id },
      });

      res.status(200).json({ message: "Joined group successfully" });
    } else {
      res.status(400).json({ message: "Already a member of the group" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get group details
// @route   GET /api/group/group-details
// @access  Private
const getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.body;

    const group = await Group.findById(groupId)
      .populate("createdBy", "Username profileImageUrl")
      .populate("members", "Username profileImageUrl")
      .populate("notes");

    if (!group) {
      res.status(404).json({ message: "Gorup not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get all groups
// @route   GET /api/group/all-groups
// @access  Private
const getAllGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({ members: userId });
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    delete delete group
// @route   DELETE /api/group/delete-group
// @access  Private
const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ message: "Group not found" });
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
  } catch (error) {}
};

module.exports = {
  createGroup,
  joinGroup,
  getGroupDetails,
  getAllGroups,
  deleteGroup,
};
