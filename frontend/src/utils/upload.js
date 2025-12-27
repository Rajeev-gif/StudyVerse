import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

export const uploadImage = async (imageFile) => {
  const formData = new FormData();

  // Append image file to the form data
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post(
      API_PATHS.UPLOAD.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw error;
  }
};

export const uploadNote = async (file, groupId, title) => {
  const formData = new FormData();

  // Append note file and title to the form data
  formData.append("noteFile", file);
  formData.append("title", title);

  try {
    const response = await axiosInstance.post(
      API_PATHS.NOTE.UPLOAD(groupId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading note: ", error);
    throw error;
  }
};
