import React, { useEffect, useState } from "react";
import axios from "axios";
import { useStateContext } from "../contexts/ContextProvider";

const DownloadCSV = () => {
  const { currentColor } = useStateContext();
  const [sensorData, setSensorData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://127.0.0.1:5000/api/sensor/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          Array.isArray(response.data.listData) &&
          response.data.listData.length > 0
        ) {
          setSensorData(response.data.listData);
          setError(null);
        } else {
          setError("Data kosong");
        }
      } catch (err) {
        console.error("API error:", err.message);
        setError("Terjadi kesalahan saat memuat data.");
      }
    };

    fetchSensorData();
  }, []);

  const handleDownloadCSV = () => {
    if (!sensorData || sensorData.length === 0) {
      alert("Tidak ada data untuk diunduh.");
      return;
    }

    const header = Object.keys(sensorData[0]).join(",") + "\n";

    const rows = sensorData
      .map((item) => {
        return Object.values(item)
          .map((value) => {
            const escapedValue =
              typeof value === "string"
                ? `"${value.replace(/"/g, '""')}"`
                : value;
            return escapedValue;
          })
          .join(",");
      })
      .join("\n");

    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sensor_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-2">Laporan Data Keseluruhan</h1>
        <p className="text-gray-600 mb-6">
          Detail Laporan dari semua data yang dikumpulkan.
        </p>
        {error && (
          <div className="text-red-500 font-semibold mb-4">{error}</div>
        )}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handlePrint}
            className="border border-black text-black font-semibold py-2 px-4 rounded hover:bg-gray-200"
          >
            Print Laporan
          </button>
          <button
            onClick={handleDownloadCSV}
            className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          >
            Download Laporan
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadCSV;
