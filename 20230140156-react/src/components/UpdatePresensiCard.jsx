import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
// ... imports lainnya

function PresensiCard() {
  // ... state coords, message, error ...
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  const handleCheckIn = async () => {
    if (!coords || !image) {
      setError("Lokasi dan Foto wajib ada!");
      return;
    }

    try {
      const blob = await (await fetch(image)).blob();

      //Buat FormData
      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("image", blob, "selfie.jpg");

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        formData,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setMessage(response.data.message);
    } catch (err) {
      console.error(err); // untuk debug
      setError("Gagal melakukan check-in, silakan coba lagi!");
    }

    // ... (Fungsi CheckOut dll) ...

    return (
      <div className="...">
        {/* ... Tampilan Peta ... */}

        {/* Tambahkan Tampilan Kamera */}
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
          {/* ... Tombol CheckIn & CheckOut ... */}
        </div>
      </div>
    );
  };
}
