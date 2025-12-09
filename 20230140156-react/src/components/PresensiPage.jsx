// src/components/PresensiPage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Webcam from "react-webcam";

// Pastikan di index.css / App.css ada:
// @import "leaflet/dist/leaflet.css";

const PresensiPage = () => {
  const [coords, setCoords] = useState(null); // { lat, lng }
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  const getToken = () => localStorage.getItem("token");

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          setError("Gagal mendapatkan lokasi: " + err.message);
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const buildAuthConfig = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  // Convert base64 ke blob
  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleCheckIn = async () => {
    setError("");
    setMessage("");

    if (!coords || !image) {
      setError("Lokasi dan Foto wajib ada!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("image", dataURLtoBlob(image), "selfie.jpg");

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        formData,
        buildAuthConfig()
      );

      setMessage(response.data.message || "Check-in berhasil.");
      setImage(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Check-in gagal. Silakan coba lagi."
      );
    }
    setLoading(false);
  };

  const handleCheckOut = async () => {
    setError("");
    setMessage("");

    if (!coords || !image) {
      setError("Lokasi dan Foto wajib ada!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("image", dataURLtoBlob(image), "selfie.jpg");

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        formData,
        buildAuthConfig()
      );

      setMessage(response.data.message || "Check-out berhasil.");
      setImage(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Check-out gagal. Silakan coba lagi."
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Peta */}
        {coords && (
          <div className="my-4 border rounded-lg overflow-hidden bg-white shadow-md">
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={15}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>Lokasi Presensi Anda</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        <div className="bg-white p-8 rounded-lg shadow-md w-full text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Lakukan Presensi</h2>

          {message && <p className="text-green-600 mb-4 font-semibold">{message}</p>}
          {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}

          {/* Webcam / Selfie */}
          <div className="my-4 border rounded-lg overflow-hidden bg-black">
            {image ? (
              <img src={image} alt="Selfie" className="w-full" />
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full"
              />
            )}
          </div>

          <div className="mb-4">
            {!image ? (
              <button
                onClick={capture}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              >
                Ambil Foto 📸
              </button>
            ) : (
              <button
                onClick={() => setImage(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded w-full"
              >
                Foto Ulang 🔄
              </button>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleCheckIn}
              disabled={loading}
              className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Loading..." : "Check-In"}
            </button>
            <button
              onClick={handleCheckOut}
              disabled={loading}
              className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? "Loading..." : "Check-Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresensiPage;
