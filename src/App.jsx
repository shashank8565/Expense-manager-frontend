import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";
import Login from "./Components/Login";
import Home from "./Components/Home";

function App() {
  return (
    <>
      <login />
    </>
  );
}

export default App;
