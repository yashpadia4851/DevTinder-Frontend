import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { removeFeedUser } from "../../Utils/feedSlice";
import { APP_URL } from "../../Utils/constants";

const UserCard = ({ users }) => {
  console.log("users", users);
  if (!users) return null;

  const dispatch = useDispatch();

  const { _id, firstName, lastName, about, gender, photoURL, age } = users;

  const handleRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        APP_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true },
      );
      dispatch(removeFeedUser(userId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-[70vh] px-4">
      <div className="w-full max-w-sm bg-base-100 border border-base-300 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]">
        {/* Image Section */}
        <div className="hover-3d w-full h-64 bg-base-200 flex items-center justify-center overflow-hidden">
          {/* content */}

          {photoURL ? (
            <figure className="max-w-100 rounded-2xl w-24 h-24 object-cover">
              <img src={photoURL} alt="3D card" />
            </figure>
          ) : (
            <div className="w-24 h-24 rounded-full bg-base-300 flex items-center justify-center text-2xl font-bold">
              {firstName?.charAt(0)?.toUpperCase()}
            </div>
          )}
          {/* 8 empty divs needed for the 3D effect */}
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        {/* Content Section */}
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

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 mt-6 w-full">
            <button
              onClick={() => handleRequest("ignored", _id)}
              className="btn flex-1 bg-base-200 border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white transition"
            >
              Ignore ✕
            </button>

            <button
              onClick={() => handleRequest("interested", _id)}
              className="btn flex-1 bg-base-200 border border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white transition"
            >
              Interested ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
