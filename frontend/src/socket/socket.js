import { io } from "socket.io-client";

const socket = io("https://studyverse-a1fp.onrender.com", {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

export default socket;
