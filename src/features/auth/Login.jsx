import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login as loginApi, signupAndLogin } from "../../api/authApi";
import { setUser } from "../../store/slices/userSlice";
import { ROUTES } from "../../config/constants";
import DevelopersImg from "../../assets/Developers.png";

const initialFormData = {
  firstName: "",
  lastName: "",
  emailId: "",
  password: "",
  gender: "",
  age: "",
  about: "",
  photoURL: "",
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const userData = isSignup
        ? await signupAndLogin(formData)
        : await loginApi(formData.emailId, formData.password);

      if (!userData || !userData._id) {
        throw new Error(isSignup
          ? "Signup succeeded but could not log you in. Please try logging in."
          : "Invalid response from server");
      }

      dispatch(setUser(userData));
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.response?.data ??
        err?.message ??
        "Something went wrong";
      setErrorMessage(typeof message === "object" ? JSON.stringify(message) : message);
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
            {isSignup ? "Create Account" : "Login"}
          </h2>

          {isSignup && (
            <>
              <input
                name="firstName"
                placeholder="First Name"
                className="input input-bordered w-full mb-3"
                value={formData.firstName}
                onChange={handleChange}
              />
              <input
                name="lastName"
                placeholder="Last Name"
                className="input input-bordered w-full mb-3"
                value={formData.lastName}
                onChange={handleChange}
              />
            </>
          )}

          <input
            type="email"
            name="emailId"
            placeholder="Email"
            className="input input-bordered w-full mb-3"
            value={formData.emailId}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered w-full mb-3"
            value={formData.password}
            onChange={handleChange}
          />

          {isSignup && (
            <>
              <select
                name="age"
                className="select select-bordered w-full mb-3"
                value={formData.age}
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
                value={formData.gender}
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
                value={formData.about}
                onChange={handleChange}
              />

              <input
                name="photoURL"
                placeholder="PhotoURL https://..."
                className="input input-bordered w-full mb-3"
                value={formData.photoURL}
                onChange={handleChange}
              />
            </>
          )}

          {errorMessage && (
            <p className="text-red-300 text-sm mb-3">{errorMessage}</p>
          )}

          <button type="submit" className="btn btn-neutral w-full">
            {isSignup ? "Sign Up" : "Login"}
          </button>

          <p className="text-sm text-center text-gray-300 mt-4">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              className="underline cursor-pointer text-white"
              onClick={() => {
                setIsSignup(!isSignup);
                setErrorMessage("");
              }}
              role="button"
              tabIndex={0}
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
