import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import { APP_URL } from "../../Utils/constants";
import { addUser } from "../../Utils/UserSlice";

const EditProfile = ({ user }) => {
  console.log("userchild", user);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimerRef = useRef(null);
  const [profile, setProfile] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    about: user?.about,
    age: user?.age,
    gender: user?.gender,
    photoURL: user?.photoURL,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;
    setProfile({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      about: user.about || "",
      age: user.age || "",
      gender: user.gender || "",
      photoURL: user.photoURL || "",
    });
  }, [user]);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setErrorMessage("");
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      const payload = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        about: profile.about,
        age: Number(profile.age) || profile.age,
        gender: profile.gender,
        photoURL: profile.photoURL,
      };

      const res = await axios.patch(APP_URL + "/profile/edit", payload, {
        withCredentials: true,
      });
      console.log("edit done  ", res);

      const updatedUser = res.data.data || res.data;
      dispatch(addUser(updatedUser));

      const message = res.data?.message || "Profile updated successfully.";
      setToastMessage(message);
      setIsToastVisible(true);
      toastTimerRef.current = setTimeout(() => {
        setIsToastVisible(false);
        setTimeout(() => setToastMessage(""), 250);
      }, 2500);

      setProfile({
        firstName: updatedUser.firstName || "",
        lastName: updatedUser.lastName || "",
        about: updatedUser.about || "",
        age: updatedUser.age || "",
        gender: updatedUser.gender || "",
        photoURL: updatedUser.photoURL || "",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error.message ||
        "Failed to update profile";
      setErrorMessage(message);
    }
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-md">
        {toastMessage && (
          <div className="toast toast-top toast-end z-50">
            <div
              className={`alert alert-success shadow-lg transition-all duration-300 ease-out ${
                isToastVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
              }`}
            >
              <span className="text-sm">{toastMessage}</span>
            </div>
          </div>
        )}

        {/* View card */}
        <div
          className={`card bg-base-300 text-base-content shadow-2xl overflow-hidden transition-all duration-500 ease-out ${
            isEditing
              ? "opacity-0 translate-y-4 pointer-events-none absolute inset-0"
              : "opacity-100 translate-y-0"
          }`}
        >
          <div className="p-4 pb-2 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {profile.firstName || "Your"} {profile.lastName || "Name"}{" "}
              {profile.age && `• ${profile.age}`}
            </h2>
            <span className="ml-2 inline-flex items-center justify-center rounded-full bg-sky-500 px-2 py-0.5 text-xs font-semibold text-white">
              ✓
            </span>
          </div>

          <div className="relative">
            <img
              src={
                profile.photoURL ||
                "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=600"
              }
              alt="Profile"
              className="w-full object-cover"
            />
          </div>

          <div className="p-4 bg-base-300">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-md"
            >
              <span className="text-lg">💖</span>
              <span>Edit info</span>
              <span className="text-xs text-gray-500">(26% complete)</span>
            </button>
          </div>
        </div>

        {/* Edit card */}
        <div
          className={`card bg-base-300 text-base-content shadow-2xl overflow-hidden transition-all duration-500 ease-out ${
            isEditing
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none absolute inset-0"
          }`}
        >
          <div className="p-4 pb-1 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn btn-ghost btn-xs text-lg text-gray-300"
              aria-label="Back to profile"
            >
              ❮
            </button>
            <h2 className="text-lg font-semibold text-white flex-1 text-center">
              Edit info
            </h2>
            <div className="w-8" />
          </div>

          {errorMessage && (
            <div className="px-4 pb-1">
              <p className="text-xs text-red-400">{errorMessage}</p>
            </div>
          )}

          <div className="px-4 pb-4 space-y-3 text-sm">
            <div className="flex flex-col gap-1 py-2 border-b border-base-100/30">
              <p className="font-medium text-gray-100">First name</p>
              <input
                className="input input-sm bg-base-200 text-sm w-full"
                placeholder="First name"
                value={profile.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1 py-2 border-b border-base-100/30">
              <p className="font-medium text-gray-100">Last name</p>
              <input
                className="input input-sm bg-base-200 text-sm w-full"
                placeholder="Last name"
                value={profile.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1 py-2 border-b border-base-100/30">
              <p className="font-medium text-gray-100">About</p>
              <textarea
                className="textarea textarea-sm bg-base-200 text-sm w-full"
                rows={3}
                placeholder="Tell people about yourself"
                value={profile.about}
                onChange={(e) => handleChange("about", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1 py-2 border-b border-base-100/30">
              <p className="font-medium text-gray-100">Age</p>
              <input
                type="number"
                min="18"
                className="input input-sm bg-base-200 text-sm w-24"
                placeholder="Age"
                value={profile.age}
                onChange={(e) => handleChange("age", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1 py-2 border-b border-base-100/30">
              <p className="font-medium text-gray-100">Gender</p>
              <select
                className="select select-sm bg-base-200 text-sm w-full"
                value={profile.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 py-2 border-b border-base-100/30">
              <p className="font-medium text-gray-100">Photo URL</p>
              <input
                className="input input-sm bg-base-200 text-sm w-full"
                placeholder="https://..."
                value={profile.photoURL}
                onChange={(e) => handleChange("photoURL", e.target.value)}
              />
            </div>
          </div>

          <div className="px-4 pb-4 pt-2 bg-base-300">
            <button
              type="button"
              onClick={handleSave}
              className="w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-md cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
