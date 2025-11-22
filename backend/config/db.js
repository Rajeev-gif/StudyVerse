const mongoose = require("mongoose");

// DB password: jydnkdvQ50e4ahAK

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error while connecting to MongoDB", error);
    process.exit(1);
  }
};

module.exports = connectDB;
