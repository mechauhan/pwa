import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "JAN", uv: 2400 },
  { name: "FEB", uv: 2210 },
  { name: "MAR", uv: 2290 },
  { name: "APR", uv: 2000 },
  { name: "MAY", uv: 2181 },
  { name: "JUNE", uv: 2500 },
  { name: "JUL", uv: 2100 },

  { name: "AUG", uv: 1800 },

  { name: "SEP", uv: 2900 },

  { name: "OCT", uv: 2500 },
  { name: "NOV", uv: 2100 },
  { name: "DEC", uv: 800 },
];

const SingleBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="uv" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SingleBarChart;
