import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { removeFeedUser } from "../../Utils/feedSlice";
import { APP_URL } from "../../Utils/constants";

const SWIPE_THRESHOLD = 80;
const EXIT_VELOCITY = 500;
const ANIMATION_DURATION_MS = 300;

const CardContent = ({ user }) => {
  const { firstName, lastName, about, gender, photoURL, age } = user;
  return (
    <>
      <div className="w-full h-64 bg-base-200 flex items-center justify-center overflow-hidden rounded-t-2xl">
        {photoURL ? (
          <figure className="rounded-2xl w-24 h-24 object-cover">
            <img src={photoURL} alt="Profile" />
          </figure>
        ) : (
          <div className="w-24 h-24 rounded-full bg-base-300 flex items-center justify-center text-2xl font-bold">
            {firstName?.charAt(0)?.toUpperCase()}
          </div>
        )}
      </div>
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold flex justify-center items-center gap-2">
          {firstName} {lastName}
          <span className="badge badge-secondary">NEW</span>
        </h2>
        <p className="text-sm text-base-content/70 mt-2">
          {age ? `${age}` : ""} {gender ? `• ${gender}` : ""}
        </p>
        <p className="text-sm text-base-content/80 mt-3 line-clamp-3 break-words">
          {about || "No bio available."}
        </p>
      </div>
    </>
  );
};

const UserCard = ({ users, isBack = false }) => {
  const dispatch = useDispatch();
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const startXRef = useRef(0);
  const cardRef = useRef(null);

  const { _id } = users;

  useEffect(() => {
    setDragX(0);
    setIsDragging(false);
    setIsExiting(false);
  }, [_id]);

  const handleRequest = useCallback(
    async (status, userId) => {
      try {
        await axios.post(
          APP_URL + "/request/send/" + status + "/" + userId,
          {},
          { withCredentials: true },
        );
        dispatch(removeFeedUser(userId));
      } catch (error) {
        console.log(error);
      }
    },
    [dispatch],
  );

  const completeSwipe = useCallback(
    (direction) => {
      if (isExiting) return;
      setIsExiting(true);
      const status = direction === "right" ? "interested" : "ignored";
      const exitX = direction === "right" ? EXIT_VELOCITY : -EXIT_VELOCITY;

      setDragX(exitX);

      setTimeout(() => {
        handleRequest(status, _id);
      }, ANIMATION_DURATION_MS);
    },
    [_id, handleRequest, isExiting],
  );

  const handlePointerDown = useCallback((e) => {
    if (isBack) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX;
    setIsDragging(true);
  }, [isBack]);

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging || isBack) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const delta = clientX - startXRef.current;
      setDragX(Math.max(-350, Math.min(350, delta)));
    },
    [isDragging, isBack],
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging || isBack) return;
    setIsDragging(false);

    if (Math.abs(dragX) >= SWIPE_THRESHOLD) {
      completeSwipe(dragX > 0 ? "right" : "left");
    } else {
      setDragX(0);
    }
  }, [isDragging, isBack, dragX, completeSwipe]);

  useEffect(() => {
    if (!isDragging || isBack) return;
    const opts = { passive: false };
    const onTouchMove = (e) => {
      handlePointerMove(e);
      if (e.cancelable) e.preventDefault();
    };
    document.addEventListener("mousemove", handlePointerMove);
    document.addEventListener("mouseup", handlePointerUp);
    document.addEventListener("touchmove", onTouchMove, opts);
    document.addEventListener("touchend", handlePointerUp);
    return () => {
      document.removeEventListener("mousemove", handlePointerMove);
      document.removeEventListener("mouseup", handlePointerUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", handlePointerUp);
    };
  }, [isDragging, isBack, handlePointerMove, handlePointerUp]);

  if (!users) return null;

  const rotation = dragX / 15;
  const showLike = dragX > SWIPE_THRESHOLD;
  const showNope = dragX < -SWIPE_THRESHOLD;

  const cardStyle = {
    transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
    transition: isDragging
      ? "none"
      : `transform ${ANIMATION_DURATION_MS / 1000}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
    cursor: isBack ? "default" : "grab",
    userSelect: "none",
    touchAction: isBack ? "auto" : "none",
  };

  const baseCardClass =
    "w-full max-w-sm bg-base-100 border border-base-300 rounded-2xl shadow-2xl overflow-hidden select-none " +
    (isBack ? "scale-[0.92] opacity-90" : "scale-100");

  return (
    <div
      ref={cardRef}
      className={`flex justify-center items-center w-full min-h-[70vh] px-4 ${isBack ? "absolute inset-0" : "relative"}`}
      style={isBack ? { zIndex: 0 } : { zIndex: 1 }}
    >
      <div
        className={baseCardClass}
        style={cardStyle}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        role={isBack ? undefined : "button"}
        aria-label={isBack ? undefined : "Swipe card"}
      >
        {/* Swipe overlays */}
        {!isBack && (
          <>
            <div
              className={`absolute inset-0 z-10 flex items-center justify-start pl-6 rounded-2xl pointer-events-none transition-opacity duration-150 ${
                showNope ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="text-4xl font-black text-pink-500 border-4 border-pink-500 rounded-xl px-4 py-2 -rotate-12">
                NOPE
              </span>
            </div>
            <div
              className={`absolute inset-0 z-10 flex items-center justify-end pr-6 rounded-2xl pointer-events-none transition-opacity duration-150 ${
                showLike ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="text-4xl font-black text-emerald-500 border-4 border-emerald-500 rounded-xl px-4 py-2 rotate-12">
                LIKE
              </span>
            </div>
          </>
        )}

        <CardContent user={users} />

        {/* Action Buttons - only on front card */}
        {!isBack && (
          <div className="flex justify-center gap-6 px-6 pb-6 pt-2 w-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                completeSwipe("left");
              }}
              className="btn flex-1 bg-base-200 border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white transition"
            >
              Ignore ✕
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                completeSwipe("right");
              }}
              className="btn flex-1 bg-base-200 border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white transition"
            >
              Interested ➤
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
