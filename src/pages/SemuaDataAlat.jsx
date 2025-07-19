import React, { useEffect, useState } from "react";
import axios from "axios";
import { useStateContext } from "../contexts/ContextProvider";

const SemuaDataAlat = () => {
  const { currentColor } = useStateContext();
  const [sensorData, setSensorData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
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
          setFilteredData(response.data.listData);
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

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!selectedDate) {
      setFilteredData(sensorData); // Tampilkan semua data jika tanggal kosong
    } else {
      const filtered = sensorData.filter((item) =>
        item.timestamp.startsWith(selectedDate)
      );
      setFilteredData(filtered);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Semua Data Alat</h1>
      <p className="text-gray-600 mb-6">
        Berikut adalah daftar semua data yang telah dikumpulkan.
      </p>

      {/* Form Filter by Date */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white border p-4 rounded-lg shadow-lg mb-6 w-full max-w-md"
      >
        <h2 className="text-lg font-semibold mb-2">Date Selection Form</h2>
        <p className="text-gray-500 mb-4">
          Please select the desired date for your data.
        </p>
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium mb-1">
            Select Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <small className="text-gray-400">Format: Year-Month-Day</small>
        </div>
        <button
          type="submit"
          className="bg-black text-white font-semibold py-2 px-6 rounded hover:bg-gray-800"
        >
          Submit
        </button>
      </form>

      {/* Tabel Data */}
      {error ? (
        <div className="text-red-500 font-semibold">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Timestamp</th>
                <th className="px-4 py-2 border">MQ Value</th>
                <th className="px-4 py-2 border">Flame Detected</th>
                <th className="px-4 py-2 border">Humidity</th>
                <th className="px-4 py-2 border">Temperature</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border">{item.id}</td>
                    <td className="px-4 py-2 border">{item.timestamp}</td>
                    <td className="px-4 py-2 border">{item.mq_value}</td>
                    <td className="px-4 py-2 border">
                      {item.flame_detected ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-2 border">{item.humidity}</td>
                    <td className="px-4 py-2 border">{item.temperature}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-2 border text-center text-gray-500"
                  >
                    Tidak ada data untuk tanggal ini.
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

export default SemuaDataAlat;
