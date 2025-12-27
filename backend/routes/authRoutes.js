const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  searchUsers,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const { uploadPfp } = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.get("/user/search", protect, searchUsers);

router.post("/upload-image", uploadPfp.single("profileImage"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  res.status(200).json({ imageUrl });
});

module.exports = router;
