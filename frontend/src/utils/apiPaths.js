export const BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://studyverse-backend.onrender.com"
    : "http://localhost:3000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    SEARCH_USER: (query) => `api/auth/user/search?query=${query}`,
  },

  UPLOAD: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
    UPLOAD_NOTE: "/api/notes/upload-note",
  },

  GROUP: {
    CREATE: "/api/group/create",
    JOIN: "/api/group/join",
    ADD_MEMBER: (id) => `/api/group/add-member/${id}`,
    REMOVE_MEMBER: (id) => `/api/group/remove-member/${id}`,
    GET_DETAILS: (id) => `/api/group/details/${id}`,
    GET_ALL: "/api/group/all",
    GET_ONE: (id) => `/api/group/${id}`,
    DELETE: (id) => `/api/group/delete/${id}`,
    LEAVE: (id) => `/api/group/leave/${id}`,
  },

  MESSAGE: {
    SEND_MESSAGE: (id) => `api/message/send/${id}`,
    GET_MESSAGES: (id) => `api/message/messages/${id}`,
    EDIT_MESSAGE: (id) => `api/message/edit/${id}`,
    DELETE_MESSAGE: (id) => `api/message/delete/${id}`,
  },

  NOTE: {
    UPLOAD: (id) => `/api/note/upload/${id}`,
    GET_NOTES: (id) => `api/note/notes/${id}`,
    GET_NOTE_BY_ID: `api/note/search/find`,
    GET_RECENT_NOTES: "/api/note/recent",
    DELETE_NOTE: "api/note/delete",
  },
};
