require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const connectDB = require("./config/db");

const { Server } = require("socket.io");

// Import models to register them with Mongoose
require("./models/User");
require("./models/Group");
require("./models/Note");
require("./models/Message");

// Routes
const authRoutes = require("./routes/authRoutes");
const groupRoutes = require("./routes/groupRoutes");
const { protect } = require("./middlewares/authMiddleware");

const app = express();

const server = http.createServer(app);

// Initialize Socket.io with http server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware to attach io to req for controllers (controllers can emit events)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// CORS configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to parese JSON bodies
app.use(express.json());

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/group", groupRoutes);

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads/pfp")));
app.use("/upload-note", express.static(path.join(__dirname, "uploads/notes")));

// SOCKET.IO HANDLER (THIS IS WHERE YOUR LOGIC GOES)
io.on("connection", (socket) => {
  console.log("A User connected: ", socket.id);

  socket.on("join_group", (groupId) => {
    socket.join(groupId);
  });

  socket.on("you_are_online", (userId) => {
    socket.to(userId).emit("user_online");
  });

  socket.on("you_are_offline", (userId) => {
    socket.to(userId).emit("user_offline");
  });

  socket.on("send_message", (data) => {
    const { groupId, message } = data;
    socket.to(groupId).emit("receive_message", message);
  });

  socket.on("typing", (groupId) => {
    socket.to(groupId).emit("typing", "A user is typing...");
  });

  socket.on("stop_typing", (groupId) => {
    socket.to(groupId).emit("stop_typing");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
