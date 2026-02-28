import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setRequest } from "../../Utils/requestSlice";
import { APP_URL } from "../../Utils/constants";

const Requests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const data = useSelector((state) => state.request) || [];

  const [loadingId, setLoadingId] = useState(null);
  const [errorMap, setErrorMap] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(APP_URL + "/user/requests/received", {
        withCredentials: true,
      });

      dispatch(setRequest(res.data.data || []));
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (status, requestId) => {
    if (!["accepted", "rejected"].includes(status)) return;

    try {
      setLoadingId(requestId);
      setErrorMap((prev) => ({ ...prev, [requestId]: "" }));

      await axios.post(
        `${APP_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true },
      );

      setTimeout(() => {
        fetchRequests();
        setLoadingId(null);
      }, 300);
    } catch (err) {
      setErrorMap((prev) => ({
        ...prev,
        [requestId]: err?.response?.data?.message || "Something went wrong",
      }));
      setLoadingId(null);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-10">
      {/* ✅ Animation */}
      <style>{`
        @keyframes reqIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-2xl font-bold mb-6">Requests</h1>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg" />
          </div>
        )}

        {/* Empty */}
        {!loading && data.length === 0 && (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title"> No Requests Yet</h2>
              <p className="text-sm text-base-content/70">
                When someone sends you a connection request, it will appear
                here.
              </p>
            </div>
          </div>
        )}

        {/* Cards */}
        {!loading && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((req, idx) => {
              const user = req.fromUserId;

              return (
                <div
                  key={req._id}
                  className={`card bg-base-200 shadow-xl p-4 transition-all duration-300 hover:scale-105 ${
                    loadingId === req._id ? "opacity-50 scale-95" : ""
                  }`}
                  style={{
                    animation: `reqIn 420ms ease-out both`,
                    animationDelay: `${idx * 70}ms`,
                  }}
                >
                  {/* Profile */}
                  <div className="flex justify-center mb-4">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.firstName}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-base-300 flex items-center justify-center text-2xl font-bold">
                        {user.firstName?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <h2 className="text-lg font-semibold text-center">
                    {user.firstName} {user.lastName}
                  </h2>

                  {/* Age & Gender */}
                  <p className="text-sm text-center text-base-content/70">
                    {user.age || "N/A"} • {user.gender || "N/A"}
                  </p>

                  {/* About */}
                  <p className="text-sm mt-2 line-clamp-3 text-base-content/80 text-center">
                    {user.about || "No bio available"}
                  </p>

                  {/* Error */}
                  {errorMap[req._id] && (
                    <p className="text-red-500 text-xs text-center mt-2">
                      {errorMap[req._id]}
                    </p>
                  )}

                  {/* Buttons */}
                  <div className="text-center mt-4 flex justify-center gap-4">
                    <button
                      disabled={loadingId === req._id}
                      onClick={() => handleReview("accepted", req._id)}
                      className="badge badge-success cursor-pointer hover:scale-110 transition-transform"
                    >
                      Accept
                    </button>

                    <button
                      disabled={loadingId === req._id}
                      onClick={() => handleReview("rejected", req._id)}
                      className="badge badge-error cursor-pointer hover:scale-110 transition-transform"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
