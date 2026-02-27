import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addUser } from "../../Utils/UserSlice";
import { APP_URL } from "../../Utils/constants";
import DevelopersImg from "../../assets/Developers.png";

const Login = () => {
  const [emailId, SetEmailId] = useState("Trump@gmail.com");
  const [password, SetPassword] = useState("Trump444...");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (emailId === "" || password === "") {
      alert("Please enter email and password");
      return;
    }

    try {
      setErrorMessage("");
      const response = await axios.post(
        APP_URL + "/login",
        { emailId, password },
        { withCredentials: true },
      );

      dispatch(addUser(response.data));
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data || err.message || "Login failed";
      setErrorMessage(message);
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${DevelopersImg})` }}
      />

      <div className="relative z-10 flex items-center justify-center">
        <fieldset className="fieldset rounded-box w-xs border-0 p-4 shadow-2xl bg-linear-to-b from-pink-900/80 via-purple-900/80 to-slate-900/80">
          <legend className="fieldset-legend font-bold text-sm">Login</legend>

          <label className="label text-sm text-white">Email</label>
          <input
            type="email"
            className="input"
            value={emailId}
            onChange={(e) => SetEmailId(e.target.value)}
            placeholder="Email"
          />

          <label className="label text-sm text-white">Password</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => SetPassword(e.target.value)}
            placeholder="Password"
          />

          {errorMessage && (
            <p className="mt-2 text-sm text-red-300">{errorMessage}</p>
          )}

          <button className="btn btn-neutral mt-4 w-full" onClick={handleLogin}>
            Login
          </button>
        </fieldset>
      </div>
    </div>
  );
};

export default Login;
