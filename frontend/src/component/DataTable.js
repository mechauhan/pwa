import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const DataTable = ({ tableData }) => {
  useEffect(() => {
    // console.log(tableData?.data, "inside datatable");
  }, [tableData]);

  // const columns = Object.keys(data[0] || {});

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
          {/* {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row && typeof row === "object" ? (
                columns.map((column) => (
                  <TableCell key={`${rowIndex}-${column}`}>
                    {row[column] !== undefined ? row[column] : ""}
                  </TableCell>
                ))
              ) : (
                <TableCell colSpan={columns.length}>Invalid Row</TableCell>
              )}
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default DataTable;
