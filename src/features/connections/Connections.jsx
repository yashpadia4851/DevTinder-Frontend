import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchConnections } from "../../api/connectionsApi";
import { setConnections } from "../../store/slices/connectionsSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state) => state?.connections) ?? [];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadConnections = async () => {
    try {
      setLoading(true);
      setError("");
      const connections = await fetchConnections();
      dispatch(setConnections(connections));
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to load connections.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

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
              People you are connected with
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg" />
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-error shadow-lg mb-4">
            <span>{error}</span>
          </div>
        )}

        {!loading && data.length === 0 && !error && (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title">No connections yet</h2>
              <p className="text-sm text-base-content/70">
                When you connect with someone, they will show up here.
              </p>
            </div>
          </div>
        )}

        {!loading && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((c, idx) => (
              <div
                key={c._id || idx}
                className="card bg-base-200 shadow-xl overflow-hidden transition-transform hover:scale-105"
                style={{
                  animation: "connIn 420ms ease-out both",
                  animationDelay: `${idx * 60}ms`,
                }}
              >
                <figure className="h-44 bg-base-300">
                  {c.photoURL ? (
                    <img
                      src={c.photoURL}
                      alt={`${c.firstName || ""} ${c.lastName || ""}`}
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
                      {(c.firstName || "Unknown")} {(c.lastName || "")}
                    </h2>
                    <div className="badge badge-neutral">
                      {c.age ? c.age : "—"}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <div className="badge badge-outline capitalize">
                      {c.gender || "unknown"}
                    </div>
                  </div>
                  {c.about ? (
                    <p className="text-sm text-base-content/70 line-clamp-3 mt-2">
                      {c.about}
                    </p>
                  ) : (
                    <p className="text-sm text-base-content/40 mt-2">
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
