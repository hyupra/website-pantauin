import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://api-damkar.psti-ubl.id/users/login",
        {
          email,
          password,
        }
      );

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role || "");
        localStorage.setItem(
          "mac_address",
          JSON.stringify(response.data.mac_address || [])
        );
        alert("Login berhasil!");
        navigate("/statistik");
      } else {
        setError("Login gagal: token tidak tersedia.");
      }
    } catch (err) {
      setError("Email atau password salah");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-900 via-red-700 to-red-800 flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="animate-fade-in bg-white bg-opacity-10 backdrop-blur-md shadow-2xl rounded-xl px-8 py-10 w-full max-w-md text-white transition-transform duration-700"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white bg-opacity-20 p-3 rounded-full mb-2">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-wider">ADMIN PANTAUIN</h2>
          <p className="text-sm text-gray-200 mt-1">
            Please sign in to your account
          </p>
        </div>

        {error && <p className="text-red-300 text-center mb-4">{error}</p>}

        <div className="mb-4 relative">
          <label className="block mb-1 text-sm font-semibold">Email</label>
          <div className="flex items-center bg-white bg-opacity-20 rounded px-3">
            <Mail className="w-4 h-4 text-white mr-2" />
            <input
              type="email"
              className="w-full py-2 bg-transparent text-white placeholder-gray-300 focus:outline-none"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-6 relative">
          <label className="block mb-1 text-sm font-semibold">Password</label>
          <div className="flex items-center bg-white bg-opacity-20 rounded px-3">
            <Lock className="w-4 h-4 text-white mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full py-2 bg-transparent text-white placeholder-gray-300 focus:outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-white ml-2" />
              ) : (
                <Eye className="w-4 h-4 text-white ml-2" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded bg-gradient-to-r from-red-500 to-red-500 hover:to-red-500 transition-all duration-300 font-semibold shadow-md ${
            isLoading && "opacity-60 cursor-not-allowed"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Login;
