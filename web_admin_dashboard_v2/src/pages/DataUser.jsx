import React, { useState, useEffect } from "react";
import axios from "axios";
import { useStateContext } from "../contexts/ContextProvider";

const DataUser = () => {
  const { currentColor } = useStateContext();
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editEmail, setEditEmail] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [lokasi, setlokasi] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://api-damkar.psti-ubl.id/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data || []);
    } catch (err) {
      console.error("Gagal memuat data user:", err);
    }
  };

  const handleEdit = (user) => {
    setIsEditMode(true);
    setEditEmail(user.email);
    setUsername(user.username);
    setEmail(user.email);
    setlokasi(user.lokasi);
    setShowForm(true);
  };

  const handleDelete = async (emailUser) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://api-damkar.psti-ubl.id/users/${emailUser}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User berhasil dihapus!");
      fetchUsers();
    } catch (err) {
      console.error("Gagal menghapus user:", err);
      alert("Gagal menghapus user.");
    }
  };

  const handleSubmitUser = async () => {
    if (!username.trim() || !email.trim() || !lokasi.trim()) {
      alert("Semua field wajib diisi.");
      return;
    }

    const token = localStorage.getItem("token");
    const payload = { username, email, lokasi };

    try {
      if (isEditMode) {
        await axios.put(
          `https://api-damkar.psti-ubl.id/users/${editEmail}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("User berhasil diperbarui!");
      } else {
        await axios.post(
          "https://api-damkar.psti-ubl.id/users/register",
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("User berhasil ditambahkan!");
      }

      setShowForm(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error("Gagal menyimpan user:", err);
      alert("Gagal menyimpan user.");
    }
  };

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setlokasi("");
    setIsEditMode(false);
    setEditEmail("");
  };

  return (
    <div className="m-4">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Data Users</h2>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit User" : "Tambah User"}
            </h2>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="border p-2 w-full mb-4"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border p-2 w-full mb-4"
              disabled={isEditMode}
            />

            <input
              type="text"
              value={lokasi}
              onChange={(e) => setlokasi(e.target.value)}
              placeholder="lokasi"
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
                onClick={handleSubmitUser}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white border dark:bg-gray-800 dark:text-white">
        <thead>
          <tr>
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">lokasi</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.lokasi}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.email)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border px-4 py-2 text-center">
                Tidak ada data user.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataUser;
