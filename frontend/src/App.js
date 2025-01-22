import react, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import LoginPage from "./modules/login/LoginPage";
import Dashboard from "./modules/dashboard/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />{" "}
        <Route
          path="/"
          element={
            <ProtectedRoute authToken={localStorage.getItem("token")}>
              <Dashboard />
            </ProtectedRoute>
          }
        />{" "}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
