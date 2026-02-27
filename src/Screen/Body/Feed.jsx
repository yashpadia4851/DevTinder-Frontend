import axios from "axios";
import React, { useEffect } from "react";
import { APP_URL } from "../../Utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../../Utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((feed) => feed?.feed);
  const getFeedConnectioData = async () => {
    if (feed?.usersData) return;
    try {
      const dataConnectionsList = await axios.get(APP_URL + "/user/feed", {
        withCredentials: true,
      });
      // usersData
      dispatch(addFeed(dataConnectionsList.data));
      console.log(dataConnectionsList, "dataConnectionsList");
    } catch (error) {
      // log error
    }
  };

  useEffect(() => {
    getFeedConnectioData();
  }, []);

  return (
    <div className="relative w-full flex top-9 items-center justify-center overflow-hidden">
      <UserCard users={feed?.usersData?.[4]} />
    </div>
  );
};

export default Feed;
