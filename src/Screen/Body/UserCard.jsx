import React from "react";

const UserCard = ({ users }) => {
  if (!users) return null;

  const { firstName, lastName, about, gender, photoURL, age } = users;
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <div className="hover-3d">
        {/* content */}
        <figure className="max-w-100 rounded-2xl">
          <img src={photoURL} alt="3D card" />
        </figure>
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
      <div className="card-body items-center text-center">
        <h2 className="card-title">
          {firstName + " " + lastName}
          <div className="badge badge-secondary">NEW</div>
        </h2>
        <p className="line-clamp-3">{age && gender && age + " " + gender}</p>
        <p className="line-clamp-3">{about}</p>
        <div className="card-actions mt-4 w-full flex justify-center gap-4">
          {/* <button className="btn btn-circle bg-base-200 border-0 shadow-md text-xl text-orange-400">
            ↺
          </button> */}
          <button className="btn btn-circle bg-base-200 border-0 shadow-md text-xl text-pink-500">
            ✕
          </button>
          {/* <button className="btn btn-circle bg-base-200 border-0 shadow-md text-xl text-sky-400">
            ★
          </button> */}
          {/* <button className="btn btn-circle bg-base-200 border-0 shadow-md text-xl text-green-400">
            ❤
          </button> */}
          <button className="btn btn-circle bg-base-200 border-0 shadow-md text-xl text-sky-400">
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
