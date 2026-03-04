import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../../api/authApi";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_AVATAR =
  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const { signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      signOut();
    }
  };

  const navLinkClass = (path) =>
    `px-4 py-2 rounded-xl no-underline transition-all duration-300 ${
      location.pathname === path
        ? "bg-white/10 text-white"
        : "text-gray-400 hover:text-white hover:bg-white/5"
    }`;

  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/feed"
          className="text-2xl font-bold bg-linear-to-r hover:no-underline from-emerald-400 to-purple-500 bg-clip-text text-transparent tracking-wide no-underline"
        >
          DevTinder
        </Link>

        {/* Desktop Nav */}
        {user && (
          <div className="hidden md:flex items-center gap-2">
            <Link to="/feed" className={navLinkClass("/feed")}>
              Feed
            </Link>
            <Link to="/connections" className={navLinkClass("/connections")}>
              Connections
            </Link>
            <Link to="/request" className={navLinkClass("/request")}>
              Requests
            </Link>
            <Link to="/premium" className={navLinkClass("/premium")}>
              Premium
            </Link>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Avatar (Desktop only) */}
          {user && (
            <div className="hidden md:block relative group">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 cursor-pointer hover:scale-105 transition">
                <img
                  src={user.photoURL || DEFAULT_AVATAR}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Dropdown */}
              <div className="absolute right-0 mt-3 w-52 rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 border border-white/10 shadow-2xl backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-4 border-b border-white/10">
                  <p className="text-white font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>

                <div className="flex flex-col p-2">
                  <Link
                    to="/profile"
                    className="px-4 py-2 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition no-underline"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-left px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/20 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Hamburger (Mobile only) */}
          {user && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white focus:outline-none"
            >
              <div className="w-6 h-6 flex flex-col justify-between">
                <span className="block h-0.5 bg-white rounded"></span>
                <span className="block h-0.5 bg-white rounded"></span>
                <span className="block h-0.5 bg-white rounded"></span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && user && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-gradient-to-br from-slate-900 to-slate-800 border-t border-white/10"
          >
            <div className="flex flex-col p-4 space-y-3">
              <Link
                to="/feed"
                onClick={() => setMobileOpen(false)}
                className={navLinkClass("/feed")}
              >
                Feed
              </Link>

              <Link
                to="/connections"
                onClick={() => setMobileOpen(false)}
                className={navLinkClass("/connections")}
              >
                Connections
              </Link>

              <Link
                to="/request"
                onClick={() => setMobileOpen(false)}
                className={navLinkClass("/request")}
              >
                Requests
              </Link>

              <Link
                to="/premium"
                onClick={() => setMobileOpen(false)}
                className={navLinkClass("/premium")}
              >
                Premium
              </Link>

              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition no-underline"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="text-left px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/20 transition"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
