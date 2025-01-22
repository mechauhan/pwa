import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";

const DataTable = ({ tableData, getTableData }) => {
  const [totalCount, setTotalCount] = useState(0); // Total row count for pagination
  const [page, setPage] = useState(0); // Current page (0-based)
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  useEffect(() => {
    // console.log(tableData?.data, "inside datatable");
    console.log(
      "tableData",
      tableData.total,
      tableData.pageNo,
      tableData.limit
    );
    setTotalCount(tableData.total);
    setPage(tableData.pageNo);
    setRowsPerPage(tableData.limit);
  }, [tableData]);

  useEffect(() => {}, [totalCount]);
  useEffect(() => {
    getTableData(page, rowsPerPage);
  }, [page, rowsPerPage]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    console.log("as", newPage);

    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    console.log("event.target.value", event.target.value);

    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {tableData && tableData.data ? (
              <>
                {Object.keys(tableData?.data[0]).map((key) => (
                  <TableCell sx={{ fontWeight: 600 }} key={key}>
                    {key}
                  </TableCell>
                ))}
              </>
            ) : (
              <></>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData && tableData.data ? (
            <>
              {tableData.data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.keys(row).map((key) => (
                    <TableCell key={key}>{row[key]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          ) : (
            <></>
          )}
        </TableBody>
      </Table>
      {tableData && tableData.data && tableData.data.length > 0 && (
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}
    </TableContainer>
  );
};
export default DataTable;
