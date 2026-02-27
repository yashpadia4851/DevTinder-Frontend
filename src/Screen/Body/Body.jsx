import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import { APP_URL } from "../../Utils/constants";
import { addUser } from "../../Utils/UserSlice";
import { useDispatch, useSelector } from "react-redux";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const fetchUser = async () => {
    if (user) return;
    try {
      const response = await axios.get(APP_URL + "/profile/view", {
        withCredentials: true,
      });

      dispatch(addUser(response.data.data || response.data));
    } catch (err) {
      console.log("err", err);
      if (err.status == 401) {
        navigate("/login");
      }
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <Navbar />
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
};

export default Body;
