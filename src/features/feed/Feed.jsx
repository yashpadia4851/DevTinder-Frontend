import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeed } from "../../api/feedApi";
import { setFeed } from "../../store/slices/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((state) => state?.feed) || {};
  const usersData = feed?.usersData || [];
  const [loading, setLoading] = useState(true);

  const loadFeed = async () => {
    if (usersData.length > 0) {
      setLoading(false);
      return;
    }
    try {
      const data = await fetchFeed();
      dispatch(setFeed(data));
    } catch (error) {
      console.error("Feed error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <div className="relative w-full min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 overflow-visible">
      {loading && (
        <span className="loading loading-spinner loading-lg" />
      )}

      {!loading && usersData.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
          <div className="text-6xl mb-4 opacity-30">🚀</div>
          <h2 className="text-4xl font-bold text-base-content mb-4">
            No Developers Found
          </h2>
          <p className="text-lg text-base-content/60 max-w-md">
            You&apos;ve reached the end of the feed. Check back later for more
            connections.
          </p>
        </div>
      )}

      {!loading && usersData.length > 0 && (
        <div className="relative w-full max-w-sm min-h-[70vh] flex items-center justify-center overflow-visible">
          {usersData[1] && (
            <UserCard key={usersData[1]._id} users={usersData[1]} isBack />
          )}
          <UserCard key={usersData[0]._id} users={usersData[0]} />
        </div>
      )}
    </div>
  );
};

export default Feed;
