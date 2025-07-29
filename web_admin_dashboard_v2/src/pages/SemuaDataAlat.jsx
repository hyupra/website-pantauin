import React, { useState, useEffect } from "react";
import axios from "axios";

const SemuaDataAlat = () => {
  const [sensorData, setSensorData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRange, setSelectedRange] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [macOptions, setMacOptions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMacAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://api-damkar.psti-ubl.id/devices",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const devices = response.data || [];
        const macs = devices.map((device) => device.mac_address);
        setMacOptions(macs);
      } catch (err) {
        console.error("Gagal mengambil daftar MAC Address:", err);
        setError("Gagal memuat MAC Address dari server.");
      }
    };

    fetchMacAddresses();
  }, []);

  const fetchSensorData = async () => {
    try {
      if (!macAddress.trim()) {
        setError("MAC Address wajib dipilih.");
        return;
      }

      let url = `https://api-damkar.psti-ubl.id/sensor/history/${macAddress}`;
      if (selectedRange) {
        url += `?range=${selectedRange}`;
      }

      const response = await axios.get(url);
      const data = response.data.data || [];

      // Filter data: hanya data dengan Flame === "Api Terdeteksi"
      const flameDetected = data.filter(
        (item) => item.Flame === "Api Terdeteksi"
      );

      if (flameDetected.length > 0) {
        setSensorData(flameDetected);
        setFilteredData(flameDetected);
        setError(null);
      } else {
        setSensorData([]);
        setFilteredData([]);
        setError("Tidak ada data dengan Flame terdeteksi.");
      }
    } catch (err) {
      console.error("Gagal mengambil data sensor:", err);
      setError("Terjadi kesalahan saat memuat data.");
    }
  };

  // Fungsi format tanggal dari timestamp ISO ke format dd-mm-yyyy
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Histori Sensor - Flame Terdeteksi
      </h1>

      <form className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="mb-4">
          <label htmlFor="mac" className="block font-medium mb-1">
            Pilih MAC Address
          </label>
          <select
            id="mac"
            value={macAddress}
            onChange={(e) => setMacAddress(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Pilih MAC Address --</option>
            {macOptions.map((mac, idx) => (
              <option key={idx} value={mac}>
                {mac}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="range" className="block font-medium mb-1">
            Filter Waktu
          </label>
          <select
            id="range"
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Semua Data --</option>
            <option value="today">Hari Ini</option>
            <option value="yesterday">Kemarin</option>
            <option value="last_week">Minggu Lalu</option>
            <option value="last_month">Bulan Lalu</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={fetchSensorData}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Ambil Data
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {filteredData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Tanggal</th>
                <th className="px-4 py-2 border">Temperature</th>
                <th className="px-4 py-2 border">Humidity</th>
                <th className="px-4 py-2 border">MQ</th>
                <th className="px-4 py-2 border">Flame</th>
                <th className="px-4 py-2 border">Latitude</th>
                <th className="px-4 py-2 border">Longitude</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-2 py-1">
                    {formatDate(item.timestamp)}
                  </td>
                  <td className="border px-2 py-1">{item.temperature}</td>
                  <td className="border px-2 py-1">{item.humidity}</td>
                  <td className="border px-2 py-1">{item.MQ}</td>
                  <td className="border px-2 py-1">{item.Flame}</td>
                  <td className="border px-2 py-1">{item.latitude}</td>
                  <td className="border px-2 py-1">{item.longitude}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SemuaDataAlat;
