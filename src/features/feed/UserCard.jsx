import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { sendRequest } from "../../api/feedApi";
import { removeFeedUser } from "../../store/slices/feedSlice";

const SWIPE_THRESHOLD = 120;

const UserCard = ({ users, isBack = false }) => {
  const dispatch = useDispatch();
  const { _id } = users;

  // Track drag position
  const x = useMotionValue(0);

  // Rotate based on drag
  const rotate = useTransform(x, [-300, 300], [-15, 15]);

  // Overlay opacity control
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleSwipe = useCallback(
    async (direction) => {
      const status = direction === "right" ? "interested" : "ignored";

      setTimeout(async () => {
        await sendRequest(status, _id);
        dispatch(removeFeedUser(_id));
      }, 300);
    },
    [_id, dispatch]
  );

  if (!users) return null;

  return (
    <motion.div
      drag={!isBack ? "x" : false}
      style={{ x, rotate }}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, info) => {
        if (info.offset.x > SWIPE_THRESHOLD) {
          handleSwipe("right");
        } else if (info.offset.x < -SWIPE_THRESHOLD) {
          handleSwipe("left");
        }
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{
        scale: isBack ? 0.92 : 1,
        opacity: 1,
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`absolute cursor-pointer w-full max-w-sm rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)] border border-white/10
      bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl
      ${isBack ? "z-0" : "z-10"}`}
    >
      {/* LIKE Overlay */}
      {!isBack && (
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-8 right-6 z-20"
        >
          <span className="text-3xl font-black text-emerald-400 border-4 border-emerald-400 px-4 py-2 rounded-xl rotate-12 bg-black/50 backdrop-blur-md">
            LIKE
          </span>
        </motion.div>
      )}

      {/* NOPE Overlay */}
      {!isBack && (
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-8 left-6 z-20"
        >
          <span className="text-3xl font-black text-pink-500 border-4 border-pink-500 px-4 py-2 rounded-xl -rotate-12 bg-black/50 backdrop-blur-md">
            NOPE
          </span>
        </motion.div>
      )}

      {/* Image */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={users.photoURL}
          alt="Profile"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Info */}
      <div className="p-6 text-center text-white">
        <h2 className="text-2xl font-bold">
          {users.firstName} {users.lastName}
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          {users.age} • {users.gender}
        </p>
        <p className="text-gray-300 mt-4 text-sm line-clamp-3">
          {users.about || "No bio available."}
        </p>
      </div>

      {!isBack && (
        <div className="flex gap-6 p-6">
          <button
            onClick={() => handleSwipe("left")}
            className="flex-1 py-3 rounded-xl cursor-pointer border border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white transition-all duration-300"
          >
            Ignore ✕
          </button>

          <button
            onClick={() => handleSwipe("right")}
            className="flex-1 py-3 cursor-pointer rounded-xl border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all duration-300"
          >
            Interested ➤
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default UserCard;