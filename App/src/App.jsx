import React, { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast"; // Import react-hot-toast
import MonthlyExpensesCalendar from "./pages/Calendar.jsx";
import UserProfile from "./pages/User.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Header from "./components/Header.jsx";

function App() {
  // State to track user authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const update = async (login) => {
    setIsAuthenticated(login);
    localStorage.setItem("isAuthenticated", login);
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(storedAuth === "true");
  }, []);

  return (
    <Router>
      {/* Add Toaster component for displaying toasts */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Conditionally render Header */}
      {isAuthenticated && <Header  update={update}/>}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <LoginPage
              setIsAuthenticated={setIsAuthenticated}
              update={update}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignupPage
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />
        <Route
          path="/calendar"
          element={
            isAuthenticated ? <MonthlyExpensesCalendar /> : <LandingPage />
          }
        />
        <Route
          path="/user"
          element={
            isAuthenticated ? <UserProfile /> : <LandingPage />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
