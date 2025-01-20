import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Topbar from "../../component/Topbar";
import axios from "axios";
import Grid from "@mui/material/Grid";
import DataTable from "../../component/DataTable";
import SingleBarChart from "../../component/SingleBarChart";
const Dashboard = () => {
  const [userCount, setUserCount] = useState(null); // Initialize as null to differentiate loading states
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login"); // Redirect if no token is present
    } else {
      getAllUsers();
    }
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/user/dashboard/users",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass token for auth
          },
        }
      );
      setUserCount(response.data.data.noOfUsers);
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token"); // Clear token on unauthorized
        navigate("/login");
      }
    }
  };

  return (
    <>
      <Topbar />
      <Grid container spacing={2} style={{ padding: "20px" }}>
        <Grid item xs={12}>
          <h2>Dashboard</h2>
        </Grid>
        <Grid item xs={6}>
          <div
            style={{
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <h3>User Count</h3>
            {userCount !== null ? <p>{userCount}</p> : <p>Loading...</p>}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div
            style={{
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <h3>AUser Activity Chart</h3>
            <SingleBarChart />{" "}
          </div>
        </Grid>
        <Grid item xs={12}>
          <DataTable />
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
