// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import { jwtDecode } from "jwt-decode";

import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import ReportPage from "./components/ReportPage";
import PresensiPage from "./components/PresensiPage";

// --- Helper untuk cek auth & role ---
const getToken = () => localStorage.getItem("token");

const getDecodedToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token); // { id, role, nama, ... } sesuai payload JWT kamu
  } catch (err) {
    console.error("Gagal decode token:", err);
    return null;
  }
};

const isLoggedIn = () => !!getDecodedToken();

const getRole = () => {
  const decoded = getDecodedToken();
  return decoded?.role || null; // misal: "admin" atau "mahasiswa"
};

// Route yang butuh login
function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Route khusus admin
function AdminRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (getRole() !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-black to-fuchsia-950 text-slate-100">
         {/* NAVBAR */}
        <nav className="px-6 py-4 bg-slate-950/70 backdrop-blur border-b border-slate-800 flex gap-6 items-center">
          {!isLoggedIn() && (
            <>
              <Link
                to="/login"
                className="text-sm text-slate-100 hover:text-fuchsia-300 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-sm text-slate-100 hover:text-fuchsia-300 transition"
              >
                Register
              </Link>
            </>
          )}

          {isLoggedIn() && (
            <>
              <Link
                to="/dashboard"
                className="text-sm text-slate-100 hover:text-fuchsia-300 transition"
              >
                Dashboard
              </Link>

              <Link
                to="/presensi"
                className="text-sm text-slate-100 hover:text-fuchsia-300 transition"
              >
                Presensi
              </Link>

              {getRole() === "admin" && (
                <Link
                  to="/report"
                  className="text-sm text-slate-100 hover:text-fuchsia-300 transition"
                >
                  Report
                </Link>
              )}

              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
                className="ml-auto text-sm text-red-300 hover:text-red-400 transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* ROUTES */}
        <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Default ke /login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Butuh login */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/presensi"
              element={
                <ProtectedRoute>
                  <PresensiPage />
                </ProtectedRoute>
              }
            />

            {/* Khusus admin */}
            <Route
              path="/report"
              element={
                <AdminRoute>
                  <ReportPage />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
} 