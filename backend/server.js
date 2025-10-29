require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// app.get("/", (req, res) => {
//   res.send("Hello from node server!");
// });

// Middleware to parese JSON bodies
app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
