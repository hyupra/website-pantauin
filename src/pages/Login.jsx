import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // ✅ inisialisasi navigasi

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Submitting login...");

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/logindamkar",
        { email, password }
      );

      console.log("API response:", response.data);

      if (response.data && response.data.loginResult?.token) {
        localStorage.setItem("token", response.data.loginResult.token);
        alert("Login berhasil!");
        console.log("Navigating to /statistik...");
        navigate("/statistik");
      } else {
        console.warn("Token tidak ditemukan di response.");
      }
    } catch (err) {
      setError("Email atau password salah");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <p className="text-red-500 mb-4 text-sm text-center">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="example@email.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
