import React, { useEffect, useState } from "react";
import axios from "axios";
import CountUp from "react-countup";
import { useStateContext } from "../contexts/ContextProvider";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon bug on leaflet when used with webpack or CRA
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Statistik = () => {
  const { currentColor } = useStateContext();
  const [sensorData, setSensorData] = useState(null);
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
          setSensorData(response.data.listData[0]);
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
    const intervalId = setInterval(fetchSensorData, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const stats = sensorData
    ? [
        {
          title: "Temperature",
          value: sensorData.temperature ?? 0,
          change: "-",
          desc: "tempratur dari sensor dht",
        },
        {
          title: "Humidity",
          value: sensorData.humidity ?? 0,
          change: "-",
          desc: "humadity dari sensor dht",
        },
        {
          title: "MQ Status",
          value: sensorData.mq_status === "Aman" ? "Aman" : "Terdeteksi",
          change: "-",
          desc: "nilai dari sensor asap",
        },
        {
          title: "Flame Status",
          value: sensorData.flame_status === "Aman" ? "Aman" : "Terdeteksi",
          change: "-",
          desc: "nilai dari sensor api",
        },
        {
          title: "Timestamp",
          value: sensorData.timestamp
            ? new Date(sensorData.timestamp).toLocaleString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A",
          change: "-",
          desc: "Waktu input",
        },
        {
          title: "Alat",
          value: 1,
          change: "-",
          desc: "Aktif",
        },
      ]
    : [
        {
          title: "Temperature",
          value: "N/A",
          change: "",
          desc: "Total sensor",
        },
        { title: "Humidity", value: "N/A", change: "0%", desc: "Total sensor" },
        {
          title: "MQ Status",
          value: "N/A",
          change: "0%",
          desc: "Total sensor",
        },
        { title: "Flame Status", value: "N/A", change: "0%", desc: "Hari ini" },
        { title: "Timestamp", value: "N/A", change: "0%", desc: "<30 menit" },
        { title: "Alat", value: "N/A", change: "0%", desc: "Aktif" },
      ];

  const latitude = sensorData?.latitude ?? -5.434047899819086;
  const longitude = sensorData?.longitude ?? 105.1587887613389;

  return (
    <div className="m-4">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Statistik Kebakaran
      </h2>
      {error && <div className="text-red-500 font-semibold mb-4">{error}</div>}
      <div className="flex flex-wrap gap-4 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md w-full md:w-56"
            style={{ borderBottom: `4px solid ${currentColor}` }}
          >
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              {item.title}
            </p>
            <p className="text-2xl font-semibold dark:text-white my-2">
              {typeof item.value === "number" ? (
                <CountUp end={item.value} duration={2} separator="," />
              ) : (
                item.value
              )}
            </p>
            <div className="flex items-center">
              <span
                className={`text-sm ${
                  item.change.startsWith("+")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {item.change}
              </span>
              <span className="text-gray-400 text-xs ml-2">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* MAP SECTION */}
      <div className="h-96 rounded-lg overflow-hidden shadow-md">
        <MapContainer
          center={[latitude, longitude]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]}>
            <Popup>Lokasi alat terdeteksi</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Statistik;
