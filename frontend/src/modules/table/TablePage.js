import React, { useEffect, useState } from "react";
import Topbar from "../../component/Topbar";
import DataTable from "../../component/DataTable";
import Grid from "@mui/material/Grid";
import AxiosBase from "../../utils/AxiosBase";
import { useNavigate } from "react-router";

const TablePage = () => {
  const [tableData, setTableData] = useState([]);
  const [refresh, setRefresh] = useState("true");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login"); // Redirect if no token is present
    } else {
      getTableData();
    }
  }, []);

  const getTableData = async (page = 0, limit = 10) => {
    try {
      const response = await AxiosBase.get("dashboard/table", {
        params: { limit: limit, pageNo: page, refresh: refresh },
      });
      setRefresh("false");
      console.log(response.data);
      setTableData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Topbar />
      <Grid container spacing={2} style={{ padding: "20px" }}>
        <Grid item xs={12}>
          <h2>Data Table</h2>
        </Grid>
        <Grid item xs={12}>
          <DataTable tableData={tableData} getTableData={getTableData} />
        </Grid>
      </Grid>
    </>
  );
};

export default TablePage;
