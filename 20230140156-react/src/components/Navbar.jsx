import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setLoggedIn(true);
      } catch (err) {
        console.error("Token invalid");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setRole(null);
    navigate("/login");
  };

  return (
    <nav className="w-full bg-[#0B0D16] text-white border-b border-purple-700/40 shadow-lg shadow-purple-900/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LEFT MENU */}
        <div className="flex space-x-8 text-sm font-medium tracking-wide">
          
          {loggedIn && (
            <>
              <Link
                to="/dashboard"
                className="hover:text-purple-300 transition duration-200"
              >
                Dashboard
              </Link>

              <Link
                to="/presensi"
                className="hover:text-purple-300 transition duration-200"
              >
                Presensi
              </Link>

              {role === "admin" && (
                <Link
                  to="/reports"
                  className="hover:text-purple-300 transition duration-200"
                >
                  Report
                </Link>
              )}
            </>
          )}
        </div>

        {/* RIGHT MENU */}
        <div>
          {!loggedIn ? (
            <>
              <Link
                to="/login"
                className="mr-4 hover:text-purple-300 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-purple-300 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition font-semibold"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
