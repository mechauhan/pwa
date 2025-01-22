import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Topbar from "../../component/Topbar";
import Grid from "@mui/material/Grid";
import DataTable from "../../component/DataTable";
import SingleBarChart from "../../component/SingleBarChart";
import AxiosBase from "../../utils/AxiosBase";
const Dashboard = () => {
  const [userCount, setUserCount] = useState(null); // Initialize as null to differentiate loading states
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login"); // Redirect if no token is present
    } else {
      getAllUsers();
      // getTableData();
    }
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await AxiosBase.get("dashboard/users");

      setUserCount(response.data.data.noOfUsers);
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token"); // Clear token on unauthorized
        navigate("/login");
      }
    }
  };

  // const getTableData = async (page = 0, limit = 10) => {
  //   try {
  //     const response = await AxiosBase.get("dashboard/table", {
  //       params: { limit: limit, pageNo: page },
  //     });
  //     console.log(response.data);
  //     setTableData(response.data.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
            <h3>User Activity Chart</h3>
            <SingleBarChart />{" "}
          </div>
        </Grid>
        {/* <Grid item xs={12}>
          <DataTable tableData={tableData} getTableData={getTableData} />
        </Grid> */}
      </Grid>
    </>
  );
};

export default Dashboard;
