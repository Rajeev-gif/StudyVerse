require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middlewares/authMiddleware");

const app = express();

// app.get("/", (req, res) => {
//   res.send("Hello from node server!");
// });

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

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uplaods"), {}));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
