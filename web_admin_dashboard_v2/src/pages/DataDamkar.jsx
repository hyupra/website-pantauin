import React, { useState, useEffect } from "react";
import axios from "axios";
import { useStateContext } from "../contexts/ContextProvider";

const DataDamkar = () => {
  const { currentColor } = useStateContext();
  const [showForm, setShowForm] = useState(false);

  const [macAddress, setMacAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [emailDamkar, setEmailDamkar] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editMacAddress, setEditMacAddress] = useState("");

  const [devices, setDevices] = useState([]);
  const [allDevices, setAllDevices] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");

  // Fetch semua devices saat pertama render
  useEffect(() => {
    fetchAllDevices();
  }, []);

  const fetchAllDevices = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://api-damkar.psti-ubl.id/devices`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDevices(response.data || []);
      setAllDevices(response.data || []);
    } catch (err) {
      console.error("Gagal memuat semua data devices:", err);
    }
  };

  const fetchDevicesByEmail = async (email) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://api-damkar.psti-ubl.id/damkar/${email}/devices`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDevices(response.data || []);
    } catch (err) {
      console.error("Gagal memuat data devices:", err);
    }
  };

  const handleSearch = () => {
    if (!searchEmail.trim()) {
      // Jika input kosong, tampilkan semua data
      setDevices(allDevices);
      return;
    }
    fetchDevicesByEmail(searchEmail);
  };

  const handleEdit = (device) => {
    setIsEditMode(true);
    setEditMacAddress(device.mac_address);
    setMacAddress(device.mac_address);
    setLatitude(device.latitude);
    setLongitude(device.longitude);
    setEmailDamkar(device.email_damkar);
    setShowForm(true);
  };

  const handleDelete = async (mac_address) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus alat ini?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://api-damkar.psti-ubl.id/devices/${mac_address}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Data alat berhasil dihapus!");
      fetchAllDevices(); // Refresh data
    } catch (err) {
      console.error("Gagal menghapus data alat:", err);
      alert("Gagal menghapus data alat.");
    }
  };

  const handleSubmitDataAlat = async () => {
    if (!macAddress.trim() || !latitude || !longitude || !emailDamkar.trim()) {
      alert("Semua field wajib diisi.");
      return;
    }

    const token = localStorage.getItem("token");
    const payload = {
      mac_address: macAddress,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      email_damkar: emailDamkar,
    };

    try {
      await axios.put(
        `https://api-damkar.psti-ubl.id/devices/${editMacAddress}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Data alat berhasil diperbarui!");
      setShowForm(false);
      resetForm();
      fetchAllDevices(); // Refresh data
    } catch (err) {
      console.error("Gagal memperbarui data alat:", err);
      alert("Gagal memperbarui data alat.");
    }
  };

  const resetForm = () => {
    setMacAddress("");
    setLatitude("");
    setLongitude("");
    setEmailDamkar("");
    setIsEditMode(false);
    setEditMacAddress("");
  };

  return (
    <div className="m-4">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Data Alat Petugas Damkar
      </h2>

      <div className="mb-4 flex space-x-2">
        <input
          type="email"
          placeholder="Masukkan email damkar"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Cari
        </button>
      </div>

      {/* Form Edit */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit Data Alat</h2>

            <input
              type="text"
              value={macAddress}
              disabled
              className="border p-2 w-full mb-4"
            />

            <input
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Latitude"
              className="border p-2 w-full mb-4"
            />

            <input
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Longitude"
              className="border p-2 w-full mb-4"
            />

            <input
              type="email"
              value={emailDamkar}
              onChange={(e) => setEmailDamkar(e.target.value)}
              placeholder="Email Damkar"
              className="border p-2 w-full mb-4"
            />

            <div className="flex justify-end">
              <button
                onClick={() => setShowForm(false)}
                className="mr-2 bg-gray-300 px-4 py-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitDataAlat}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <h2 className="text-lg font-semibold mb-2 mt-6 dark:text-white">
        Data Devices
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border dark:bg-gray-800 dark:text-white">
          <thead>
            <tr>
              <th className="border px-4 py-2">MAC Address</th>
              <th className="border px-4 py-2">Latitude</th>
              <th className="border px-4 py-2">Longitude</th>
              <th className="border px-4 py-2">Email Damkar</th>
              <th className="border px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {devices.length > 0 ? (
              devices.map((device, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{device.mac_address}</td>
                  <td className="border px-4 py-2">{device.latitude}</td>
                  <td className="border px-4 py-2">{device.longitude}</td>
                  <td className="border px-4 py-2">{device.email_damkar}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(device)}
                      className="bg-yellow-400 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(device.mac_address)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border px-4 py-2 text-center">
                  Tidak ada data devices.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataDamkar;
