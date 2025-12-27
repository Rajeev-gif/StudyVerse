import { useEffect } from "react";
import socket from "../socket/socket";
import toast from "react-hot-toast";

const useSocketListeners = () => {
  useEffect(() => {
    socket.on("member_added", (data) => {
      toast.success(`${data.username} joined the group`);
    });

    socket.on("new_note_uploaded", () => {
      toast.success("New note uploaded");
    });

    return () => {
      socket.off("member_added");
      socket.off("new_note_uploaded");
    };
  }, []);
};

export default useSocketListeners;
