import axios from "axios";
import React, { useEffect, useState } from "react";
import { APP_URL } from "../../Utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../../Utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((state) => state?.feed) || {};
  const usersData = feed?.usersData || [];

  const [loading, setLoading] = useState(true);

  const getFeedConnectioData = async () => {
    if (usersData.length > 0) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(APP_URL + "/user/feed", {
        withCredentials: true,
      });

      dispatch(addFeed(res.data));
    } catch (error) {
      console.log("Feed error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeedConnectioData();
  }, []);

  return (
    <div className="relative w-full min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
      
      {/* Loading */}
      {loading && (
        <span className="loading loading-spinner loading-lg" />
      )}

      {/* Empty State */}
      {!loading && usersData.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
          <div className="text-6xl mb-4 opacity-30">🚀</div>
          <h2 className="text-4xl font-bold text-base-content mb-4">
            No Developers Found
          </h2>
          <p className="text-lg text-base-content/60 max-w-md">
            You’ve reached the end of the feed.  
            Check back later for more connections.
          </p>
        </div>
      )}

      {/* Show Card */}
      {!loading && usersData.length > 0 && (
        <UserCard users={usersData[6]} />
      )}
    </div>
  );
};

export default Feed;