import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fungsi fetchReports dibungkus useCallback supaya stabil
  const fetchReports = useCallback(async (query = "") => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // Decode token untuk cek expiry
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000; // dalam detik
      if (decoded.exp < now) {
        localStorage.removeItem("token");
        alert("Sesi habis, silakan login ulang");
        navigate("/login");
        return;
      }
    } catch (decodeErr) {
      console.error("Token tidak valid:", decodeErr);
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: query ? { search: query } : {},
      };

      setError("");

      const response = await axios.get(
        "http://localhost:3001/api/reports/daily",
        config
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      setReports(data);
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || "Gagal memuat laporan presensi.";
      setError(msg);
      setReports([]);

      if (status === 401 || status === 403) {
        // Token expired atau akses ditolak
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchReports("");
  }, [fetchReports]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm.trim());
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Laporan Presensi Harian
      </h1>

      <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-2">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 transition"
        >
          Cari
        </button>
      </form>

      {error && (
        <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4">
          {error}
        </p>
      )}

      {!error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length > 0 ? (
                reports.map((presensi) => (
                  <tr key={presensi.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {presensi.user ? presensi.user.nama : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.checkIn
                        ? new Date(presensi.checkIn).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.checkOut
                        ? new Date(presensi.checkOut).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
                        : "Belum Check-Out"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
