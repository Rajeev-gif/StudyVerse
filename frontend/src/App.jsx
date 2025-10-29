import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Home/Dashboard";
import Groups from "./pages/Home/Groups";
import GroupDetial from "./pages/GroupDetail/GroupDetail";
import UserProfil from "./pages/Auth/UserProfile";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/group-detail" element={<GroupDetial />} />
          <Route path="/user-profile" element={<UserProfil />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
