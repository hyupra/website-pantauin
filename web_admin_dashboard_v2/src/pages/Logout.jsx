import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const confirmLogout = window.confirm("Apakah kamu yakin ingin logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  return <div></div>;
};

export default Logout;
