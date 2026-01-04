const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if username isn't unique
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username not available" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle profile image
    let profileImageUrl = null;
    if (req.file) {
      // if (process.env.NODE_ENV === "production") {
      //   // In production, store as base64
      //   const base64 = req.file.buffer.toString('base64');
      //   profileImageUrl = `data:${req.file.mimetype};base64,${base64}`;
      // } else {
      //   // In dev, use file path
      //   profileImageUrl = `${req.protocol}://${req.get('host')}/uploads/pfp/${req.file.filename}`;
      // }
      profileImageUrl = req.file?.path;
    }

    // Create User
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profileImageUrl,
    });

    // Return user data with JWT
    res
      .status(201)
      .cookie("token", generateToken(user._id), {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Return user data with JWT
    res
      .status(200)
      .cookie("token", generateToken(user._id), {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get user profile
// @route   POST /api/auth/profile
// @access  Private (Requires JWT)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get user by ssearch
// @route   GET /api/auth/user/search?query=
// @access  Private (Requires JWT)
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query required" });
    }

    const users = await User.find({
      username: { $regex: query, $options: "i" },
    })
      .select("_id username profileImageUrl")
      .limit(10);

    // req.io.to(groupId).emit("member_added", {
    //   username: member.Username,
    // });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  res.clearCookie("token", {
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  searchUsers,
  logoutUser,
};
