import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Home/Dashboard";
import GroupDetial from "./pages/GroupDetail/GroupDetail";
import UserProfil from "./pages/Auth/UserProfile";
import UserProvider from "./context/userContext";
import { ThemeProvider } from "./context/ThemeContext";
import GroupChat from "./pages/GroupDetail/GroupChat";

const App = () => {
  return (
    <UserProvider>
      <ThemeProvider>
        <div>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/group-chat/:groupId" element={<GroupChat />} />
              <Route path="/group-detail/:groupId" element={<GroupDetial />} />
              <Route path="/user-profile" element={<UserProfil />} />
            </Routes>
          </Router>
          <Toaster position="top-center" reverseOrder={false} />
        </div>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;
