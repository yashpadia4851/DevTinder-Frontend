import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addUser } from "../../Utils/UserSlice";
import { APP_URL } from "../../Utils/constants";
import DevelopersImg from "../../assets/Developers.png";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    gender: "",
    age: "",
    about: "",
    photoURL: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (isSignup) {
        const res = await axios.post("http://localhost:3000/signup", formData, {
          withCredentials: true,
        });

        dispatch(addUser(res.data));
      } else {
        const res = await axios.post(
          APP_URL + "/login",
          {
            emailId: formData.emailId,
            password: formData.password,
          },
          { withCredentials: true },
        );

        dispatch(addUser(res.data));
      }

      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err.message ||
        "Something went wrong";

      setErrorMessage(message);
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-auto">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${DevelopersImg})` }}
      />

      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl p-6 shadow-2xl bg-linear-to-b from-pink-900/80 via-purple-900/80 to-slate-900/80 backdrop-blur-md"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            {isSignup ? "Create Account" : "Login First"}
          </h2>

          {isSignup && (
            <>
              <input
                name="firstName"
                placeholder="First Name"
                className="input input-bordered w-full mb-3"
                onChange={handleChange}
              />
              <input
                name="lastName"
                placeholder="Last Name"
                className="input input-bordered w-full mb-3"
                onChange={handleChange}
              />
            </>
          )}

          <input
            type="email"
            name="emailId"
            placeholder="Email"
            className="input input-bordered w-full mb-3"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered w-full mb-3"
            onChange={handleChange}
          />

          {isSignup && (
            <>
              <select
                name="age"
                className="select select-bordered w-full mb-3"
                onChange={handleChange}
              >
                <option value="">Select Age</option>
                {Array.from({ length: 83 }, (_, i) => i + 18).map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>

              <select
                name="gender"
                className="select select-bordered w-full mb-3"
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <textarea
                name="about"
                placeholder="Tell us about yourself..."
                className="textarea textarea-bordered w-full mb-3"
                rows="3"
                onChange={handleChange}
              />

              <input
                name="photoURL"
                placeholder="PhotoURL https://..."
                className="input input-bordered w-full mb-3"
                onChange={handleChange}
              />
            </>
          )}

          {errorMessage && (
            <p className="text-red-300 text-sm mb-3">{errorMessage}</p>
          )}

          <button className="btn btn-neutral w-full">
            {isSignup ? "Sign Up" : "Login"}
          </button>

          <p className="text-sm text-center text-gray-300 mt-4">
            {isSignup ? "Already have an account?" : "Not an account?"}{" "}
            <span
              className="underline cursor-pointer text-white"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Login" : "Sign Up"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
