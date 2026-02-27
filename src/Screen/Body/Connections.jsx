import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { APP_URL } from "../../Utils/constants";
import { setConnections } from "../../Utils/connectionsSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, status, error } = useSelector((state) => state.connections);

  const fetchConnections = async () => {
    if (status === "loading") return;

    try {
      dispatch(setConnectionsLoading());
      const res = await axios.get(APP_URL + "/user/connections", {
        withCredentials: true,
      });

      dispatch(setConnections(res.data?.data || []));
    } catch (err) {
      const statusCode = err?.response?.status;
      if (statusCode === 401) navigate("/login");

      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err.message ||
        "Failed to load connections";
      dispatch(setConnectionsError(message));
    }
  };

  useEffect(() => {
    if (status === "idle") fetchConnections();
  }, [status]);

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-10">
      <style>{`
        @keyframes connIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-base-content">
              Connections
            </h1>
            <p className="text-sm text-base-content/60">
              People you’re connected with
            </p>
          </div>

          <button
            type="button"
            onClick={fetchConnections}
            className="btn btn-sm btn-ghost"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {status === "loading" && (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg" />
          </div>
        )}

        {status === "failed" && (
          <div className="alert alert-error shadow-lg">
            <span className="text-sm">{error}</span>
          </div>
        )}

        {status === "succeeded" && data.length === 0 && (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title">No connections yet</h2>
              <p className="text-sm text-base-content/70">
                When you connect with someone, they’ll show up here.
              </p>
            </div>
          </div>
        )}

        {status === "succeeded" && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((c, idx) => (
              <div
                key={c._id || idx}
                className="card bg-base-200 shadow-xl overflow-hidden"
                style={{
                  animation: `connIn 420ms ease-out both`,
                  animationDelay: `${idx * 60}ms`,
                }}
              >
                <figure className="h-44 bg-base-300">
                  {c.photoURL ? (
                    <img
                      src={c.photoURL}
                      alt={`${c.firstName || ""} ${c.lastName || ""}`.trim()}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="h-44 w-full flex items-center justify-center text-5xl font-semibold text-base-content/30">
                      {(c.firstName || "U").slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </figure>

                <div className="card-body">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="card-title text-base">
                      {(c.firstName || "Unknown") + " " + (c.lastName || "")}
                    </h2>
                    <div className="badge badge-neutral">
                      {c.age ? `${c.age}` : "—"}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="badge badge-outline capitalize">
                      {c.gender || "unknown"}
                    </div>
                  </div>

                  {c.about ? (
                    <p className="text-sm text-base-content/70 line-clamp-3">
                      {c.about}
                    </p>
                  ) : (
                    <p className="text-sm text-base-content/40">
                      No bio added.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
