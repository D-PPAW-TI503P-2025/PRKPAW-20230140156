import React from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Login Sukses!
        </h1>
        <p className="text-gray-700 mb-8">
          Kamu berhasil login ke Dashboard Anda.
        </p>
        <button
          onClick={handleLogout}
          className="py-2 px-6 bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >

          Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
