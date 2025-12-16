const Group = require("../models/Group");
const Note = require("../models/Note");

// @desc    upload a new note
// @route   POST /api/note/upload/:groupId
// @access  Private
const uploadNote = async (req, res) => {
  try {
    const { title, groupId } = req.body;
    const uploadedBy = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const newNote = new Note({
      title,
      fileUrl: `/upload-note/${req.file.filename}`,
      uploadedBy,
      group: groupId,
    });

    group.notes.push(newNote._id);
    await newNote.save();
    await group.save();

    req.io.to(groupId).emit("new_note", newNote);

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    get all notes of a group
// @route   GET /api/note/notes/:groupId
// @access  Private
const getAllNotes = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate("notes");
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group.notes);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    get a note by id
// @route   GET /api/search/find
// @access  Private
const getNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200), json(note);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    delete a note
// @route   DELETE /api/note/delete/:noteId
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const group = await Group.findById(note.group);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (
      note.uploadedBy.toString() === req.user.id &&
      req.user.id === group.createdBy.toString()
    ) {
      await Note.findByIdAndDelete(noteId);
      group.notes.pull(noteId);
      await group.save();

      req.io.to(group._id.toString()).emit("delete_note", noteId);

      res.status(200).json({ message: "Note deleted successfully" });
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { uploadNote, getAllNotes, getNoteById, deleteNote };
