import { io } from "socket.io-client";

const socket = io("https://studyverse-a1fp.onrender.com", {
  withCredentials: true,
  autoConnect: false,
});

export default socket;
