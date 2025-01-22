import * as React from "react";
import {
  Box,
  Button,
  Toolbar,
  Typography,
  AppBar,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  // Function to navigate to Dashboard page
  const goToDashboard = () => {
    navigate("/");
  };

  // Function to navigate to Table page
  const goToTable = () => {
    navigate("/table");
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#1976d2" }}>
      <Container>
        <Toolbar>
          <Box sx={{ display: "flex", flexGrow: 1 }}>
            {/* Navigation for Dashboard and Table */}
            <Button
              color="inherit"
              onClick={goToDashboard}
              sx={{ marginRight: 2 }}
            >
              Dashboard
            </Button>
            <Button color="inherit" onClick={goToTable} sx={{ marginRight: 2 }}>
              Table
            </Button>
          </Box>

          {/* Logout button */}
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
