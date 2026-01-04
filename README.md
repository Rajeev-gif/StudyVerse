---

# 📚 StudyVerse

**StudyVerse** is a full-stack collaborative learning platform that allows students to create study groups, communicate in real time, and share notes and resources securely. It is built to simulate real SaaS-grade architecture with secure authentication, cloud storage, and real-time features.

---

## 🚀 Features

* 🔐 Secure authentication using HTTP-only cookies
* 👥 Create, join, and manage study groups
* 💬 Real-time group chat using Socket.io
* 📎 Upload and share notes, PDFs, and documents
* ☁️ Cloud-based file storage with CDN delivery
* 🟢 Online / offline member status
* 🗑️ Message editing and deletion
* 📱 Fully responsive UI

---

## 🛠 Tech Stack

**Frontend:**

* React.js
* Tailwind CSS
* Axios
* Socket.io Client

**Backend:**

* Node.js
* Express.js
* MongoDB
* Socket.io
* JWT Authentication (HTTP-only Cookies)

**Cloud & Hosting:**

* Cloudinary (File Storage & CDN)
* Render (Backend Hosting)
* Vercel (Frontend Hosting)

---

## 📂 Core Functionalities

* Group creation and membership control
* Role-based admin permissions
* Live message broadcasting
* Cloud document uploads and public access
* Secure cookie-based session handling

---

## 🔑 Authentication Flow

* JWT tokens are stored in **HTTP-only cookies**
* Cookies are automatically sent with every request
* Frontend never accesses tokens directly, ensuring high security

---

## 📦 Installation

```bash
git clone https://github.com/your-username/StudyVerse.git
cd StudyVerse
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌍 Live Demo

Frontend: [https://study-verse-opal.vercel.app](https://study-verse-opal.vercel.app)
Backend: [https://studyverse-a1fp.onrender.com](https://studyverse-a1fp.onrender.com)

---

## 👨‍💻 Author

**Rajeev Valechha**
Full Stack Developer | MERN | Real-Time Web Applications

---

## 🏆 Highlights

* Real-time WebSocket communication
* Cloud-based file storage architecture
* Production-grade authentication and deployment
* Clean modular code structure

---
