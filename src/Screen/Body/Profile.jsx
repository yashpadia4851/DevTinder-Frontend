import React from "react";
import { useSelector } from "react-redux";

import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((state) => state.user);
  console.log('userprofile' , user)
  return <EditProfile user={user} />;
};

export default Profile;
