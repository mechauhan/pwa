import react, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import LoginPage from "./modules/login/LoginPage";
import Dashboard from "./modules/dashboard/Dashboard";

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));

  const ProtectedRoute = ({ authToken, children }) => {
    return authToken ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />{" "}
        <Route path="/" element={<Dashboard />} />{" "}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
