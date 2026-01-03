require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

const { Server } = require("socket.io");

// Import models to register them with Mongoose
require("./models/User");
require("./models/Group");
require("./models/Note");
require("./models/Message");

// Routes
const authRoutes = require("./routes/authRoutes");
const groupRoutes = require("./routes/groupRoutes");
const messageRoutes = require("./routes/messageRoutes");
const noteRoutes = require("./routes/noteRoutes");
const { protect } = require("./middlewares/authMiddleware");
const { saveMessage } = require("./controllers/messageController"); // Import here

const app = express();

const server = http.createServer(app);

// Initialize Socket.io with http server
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://study-verse-opal.vercel.app"
        : "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
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
    origin:
      process.env.NODE_ENV === "production"
        ? "https://study-verse-opal.vercel.app"
        : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to parese JSON bodies
app.use(express.json());

connectDB();

// Cookie Parser
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/note", protect, noteRoutes);

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// SOCKET.IO HANDLER (THIS IS WHERE YOUR LOGIC GOES)
io.on("connection", (socket) => {
  console.log("A User connected: ", socket.id);

  socket.on("join_group", (groupId) => {
    const room = groupId.toString();
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${groupId}`);
    console.log("Rooms:", socket.rooms);
  });

  socket.on("you_are_online", (userId) => {
    socket.to(userId).emit("user_online");
  });

  socket.on("you_are_offline", (userId) => {
    socket.to(userId).emit("user_offline");
  });

  socket.on("send_message", (data) => {
    io.to(data.groupId).emit("receive_message", data);
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
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
