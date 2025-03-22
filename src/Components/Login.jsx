import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [Error, setError] = useState("");

  const navigate = useNavigate();

  function Login() {
    axios
      .post(
        "http://localhost:3000/auth/login",
        {
          userName: username,
          password: password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data._id);

        navigate(`/Home/${response.data._id}`);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setError("Invalid username or password. Please try again.");
        } else {
          setError("Something went wrong. Please try again later.");
        }
      });
  }

  return (
    <div className="main-c">
      <div className="loginContainer">
        <h1>Welcome To Your Expense Manager</h1>

        {Error && <p style={{ color: "red", marginBottom: "5px" }}>{Error}</p>}
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={Login}>Login</button>
      </div>
    </div>
  );
};

export default Login;
