import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeed } from "../../api/feedApi";
import { setFeed } from "../../store/slices/feedSlice";
import { AnimatePresence } from "framer-motion";
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
    <div className="relative w-full min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/bg/dev-bg.jpg"
          alt="Developer Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      </div>

      {/* Gradient Glow Overlay */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/30 blur-[160px] rounded-full top-[-100px] left-[-100px] animate-pulse" />
      <div className="absolute w-[500px] h-[500px] bg-emerald-500/30 blur-[160px] rounded-full bottom-[-100px] right-[-100px] animate-pulse" />

      {/* Content */}
      <div className="relative z-10 w-full flex items-center justify-center px-4">

        {loading && (
          <span className="loading loading-spinner loading-lg text-white" />
        )}

        {!loading && usersData.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center min-h-[60vh] text-white">
            <div className="text-6xl mb-4 opacity-40">🚀</div>
            <h2 className="text-4xl font-bold mb-4">
              No Developers Found
            </h2>
            <p className="text-lg text-gray-300 max-w-md">
              You’ve reached the end of the feed. Check back later for more connections.
            </p>
          </div>
        )}

        {!loading && usersData.length > 0 && (
          <div className="relative w-full max-w-sm min-h-[75vh] flex items-center justify-center">

            <AnimatePresence>
              {usersData[1] && (
                <UserCard
                  key={usersData[1]._id}
                  users={usersData[1]}
                  isBack
                />
              )}

              <UserCard
                key={usersData[0]._id}
                users={usersData[0]}
              />
            </AnimatePresence>

          </div>
        )}

      </div>
    </div>
  );
};

export default Feed;