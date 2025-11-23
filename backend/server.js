require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Import models to register them with Mongoose
require("./models/User");
require("./models/Group");
require("./models/Note");
require("./models/Message");

const authRoutes = require("./routes/authRoutes");
const groupRoutes = require("./routes/groupRoutes");
const { protect } = require("./middlewares/authMiddleware");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDB();

// Middleware to parese JSON bodies
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/group", groupRoutes);

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uplaods/pfp"), {}));
app.use(
  "/upload-note",
  express.static(path.join(__dirname, "uplaods/notes"), {})
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
