import React, { useEffect, useState } from "react";
import axios from "axios";

const DaftarAlat = () => {
  const [alat, setAlat] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ambil data alat
  const fetchAlat = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://127.0.0.1:5000/api/sensor/history",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(response.data.listData)) {
        setAlat(response.data.listData);
        setError(null);
      } else {
        setError("Data kosong.");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data alat.");
    } finally {
      setLoading(false);
    }
  };

  // Daftarkan alat baru (contoh dummy)
  const handleRegisterAlat = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://127.0.0.1:5000/api/sensor/register",
        {
          device_id: "DEVICE_" + Date.now(),
          latitude: -5.434,
          longitude: 105.158,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Alat berhasil didaftarkan.");
      fetchAlat(); // refresh data
    } catch (err) {
      alert("Gagal mendaftarkan alat.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlat();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Daftar Alat & Data Sensor</h2>

      <button
        onClick={handleRegisterAlat}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow mb-4"
      >
        Daftarkan Alat Baru
      </button>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-blue-500">Memuat data...</p>}

      {alat.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow-md">
            <thead>
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">macc addres</th>
                <th className="px-4 py-2 border">Timestamp</th>
                <th className="px-4 py-2 border">Temperature (°C)</th>
                <th className="px-4 py-2 border">Humidity (%)</th>
                <th className="px-4 py-2 border">MQ Status</th>
                <th className="px-4 py-2 border">Flame Status</th>
                <th className="px-4 py-2 border">Latitude</th>
                <th className="px-4 py-2 border">Longitude</th>
              </tr>
            </thead>
            <tbody>
              {alat.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 border">{item.id}</td>
                  <td className="px-4 py-2 border">{item.device_id}</td>
                  <td className="px-4 py-2 border">
                    {new Date(item.timestamp).toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.temperature ?? "N/A"}
                  </td>
                  <td className="px-4 py-2 border">{item.humidity ?? "N/A"}</td>
                  <td className="px-4 py-2 border">
                    {item.mq_status ?? "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.flame_status ?? "N/A"}
                  </td>
                  <td className="px-4 py-2 border">{item.latitude}</td>
                  <td className="px-4 py-2 border">{item.longitude}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p>Belum ada data alat yang tersedia.</p>
      )}
    </div>
  );
};

export default DaftarAlat;
