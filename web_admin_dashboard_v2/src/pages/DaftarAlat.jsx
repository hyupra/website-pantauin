import React, { useState, useEffect } from "react";
import axios from "axios";
import { useStateContext } from "../contexts/ContextProvider";

const DaftarAlat = () => {
  const { currentColor } = useStateContext();
  const [showForm, setShowForm] = useState(false);
  const [macAddress, setMacAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [emailDamkar, setEmailDamkar] = useState("");
  const [emailUser, setEmailUser] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editMacAddress, setEditMacAddress] = useState("");
  const [devices, setDevices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://api-damkar.psti-ubl.id/devices",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDevices(response.data || []);
    } catch (err) {
      console.error("Gagal memuat data devices:", err);
    }
  };

  const resetForm = () => {
    setMacAddress("");
    setLatitude("");
    setLongitude("");
    setEmailDamkar("");
    setEmailUser("");
    setIsEditMode(false);
    setEditMacAddress("");
  };

  const handleTambahDataAlat = () => {
    resetForm();
    setShowForm(true);
  };

  const handleSubmitDataAlat = async () => {
    if (
      !macAddress.trim() ||
      !latitude ||
      !longitude ||
      !emailDamkar.trim() ||
      !emailUser.trim()
    ) {
      alert("Semua field wajib diisi.");
      return;
    }

    if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
      alert("Latitude dan Longitude harus berupa angka.");
      return;
    }

    const token = localStorage.getItem("token");

    const payload = new URLSearchParams();
    payload.append("latitude", parseFloat(latitude));
    payload.append("longitude", parseFloat(longitude));
    payload.append("email_damkar", emailDamkar.trim());
    payload.append("email_user", emailUser.trim());

    try {
      setIsSubmitting(true);

      if (isEditMode) {
        await axios.put(
          `https://api-damkar.psti-ubl.id/devices/${editMacAddress}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        alert("✅ Data alat berhasil diperbarui!");
      } else {
        payload.append("mac_address", macAddress.trim());

        await axios.post(
          "https://api-damkar.psti-ubl.id/devices/register",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        alert("✅ Alat berhasil didaftarkan ke database!");
      }

      fetchDevices();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("❌ Gagal menyimpan data alat:", err);
      alert("Gagal menyimpan data alat. Periksa kembali input atau koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (device) => {
    setIsEditMode(true);
    setEditMacAddress(device.mac_address);
    setMacAddress(device.mac_address);
    setLatitude(device.latitude);
    setLongitude(device.longitude);
    setEmailDamkar(device.email_damkar);
    setEmailUser(device.email_user);
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
      alert("✅ Data alat berhasil dihapus!");
      fetchDevices();
    } catch (err) {
      console.error("❌ Gagal menghapus data alat:", err);
      alert("Gagal menghapus data alat.");
    }
  };

  return (
    <div className="m-4">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Daftarkan Alat Baru
      </h2>

      <button
        onClick={handleTambahDataAlat}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md mb-4"
      >
        + Tambah Data Alat
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Data Alat" : "Tambah Data Alat"}
            </h2>

            <input
              type="text"
              value={macAddress}
              onChange={(e) => setMacAddress(e.target.value)}
              placeholder="MAC Address"
              className="border p-2 w-full mb-4"
              disabled={isEditMode}
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

            <input
              type="email"
              value={emailUser}
              onChange={(e) => setEmailUser(e.target.value)}
              placeholder="Email User"
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
                disabled={isSubmitting}
                className={`${
                  isSubmitting ? "bg-gray-400" : "bg-blue-500"
                } text-white px-4 py-2 rounded`}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold mb-2 mt-6 dark:text-white">
        Data Devices Terdaftar
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border dark:bg-gray-800 dark:text-white">
          <thead>
            <tr>
              <th className="border px-4 py-2">MAC Address</th>
              <th className="border px-4 py-2">Latitude</th>
              <th className="border px-4 py-2">Longitude</th>
              <th className="border px-4 py-2">Email Damkar</th>
              <th className="border px-4 py-2">Email User</th>
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
                  <td className="border px-4 py-2">{device.email_user}</td>
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
                <td colSpan="6" className="border px-4 py-2 text-center">
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

export default DaftarAlat;
