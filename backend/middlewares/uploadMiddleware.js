// const multer = require("multer");
// const path = require("path");

// // Configure Storage with dynamic destination
// const storage = process.env.NODE_ENV === "production"
//   ? multer.memoryStorage() // Use memory storage in production
//   : multer.diskStorage({
//       destination: (req, file, cb) => {
//         // Determine destination based on field name
//         let uploadPath = "uploads/";
//         if (file.fieldname === "profileImage") {
//           uploadPath += "pfp";
//         } else if (file.fieldname === "noteFile") {
//           uploadPath += "notes";
//         } else {
//           uploadPath += "misc"; // fallback
//         }
//         cb(null, uploadPath);
//       },
//       filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//       },
//     });

// // File Filter for profile images
// const pfpFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
//   const ext = path.extname(file.originalname).toLowerCase();
//   const allowedExtensions = [".jpg", ".jpeg", ".png"];

//   if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error(
//         "Only image files (jpg, jpeg, png) are allowed for profile pictures"
//       ),
//       false
//     );
//   }
// };

// // File Filter for notes
// const notesFilter = (req, file, cb) => {
//   const allowedTypes = [
//     "application/pdf",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   ];
//   const ext = path.extname(file.originalname).toLowerCase();
//   const allowedExtensions = [".pdf", ".doc", ".docx"];

//   if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF and Word documents are allowed for notes"), false);
//   }
// };

// // Create separate upload middlewares
// const uploadPfp = multer({
//   storage,
//   fileFilter: pfpFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB for images
// });

// const uploadNotes = multer({
//   storage,
//   fileFilter: notesFilter,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for documents
// });

// // General upload (fallback)
// const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 },
// });

// module.exports = { uploadPfp, uploadNotes, upload };

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const pfpStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "studyverse/pfp", allowed_formats: ["jpg", "jpeg", "png"] },
});

const noteStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "studyverse/notes",
    allowed_formats: ["pdf", "doc", "docx"],
    resource_type: "raw", // 🔥 THIS IS IMPORTANT
    access_mode: "public", // 🔥 MAKE FILE PUBLIC
  },
});

const uploadPfp = multer({ storage: pfpStorage });
const uploadNotes = multer({ storage: noteStorage });

module.exports = { uploadPfp, uploadNotes };
