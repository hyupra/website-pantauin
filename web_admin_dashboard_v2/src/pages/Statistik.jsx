import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import CountUp from "react-countup";
import { useStateContext } from "../contexts/ContextProvider";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Statistik = () => {
  const { currentColor } = useStateContext();
  const [sensorMap, setSensorMap] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const cached = localStorage.getItem("sensorMapCache");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setSensorMap(parsed);
      } catch (err) {
        console.warn("Failed to parse cached sensor data:", err);
      }
    }

    const brokerUrl = "wss://d7d8ee83.ala.asia-southeast1.emqxsl.com:8084/mqtt";
    const topic = "fire_detector/#";

    const options = {
      username: "firedetect",
      password: "123",
      reconnectPeriod: 1000,
    };

    const client = mqtt.connect(brokerUrl, options);

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe(topic);
    });

    client.on("message", (topic, message) => {
      try {
        const data = JSON.parse(message.toString());

        if (!data.mac_address) return;

        setSensorMap((prevMap) => {
          const updatedMap = {
            ...prevMap,
            [data.mac_address]: {
              ...data,
              mq_status:
                (data.mq_status || data.MQ) === "Terdeteksi"
                  ? "Terdeteksi"
                  : "Aman",
              flame_status:
                (data.flame_status || data.Flame) === "Api Terdeteksi"
                  ? "Terdeteksi"
                  : "Aman",
            },
          };
          localStorage.setItem("sensorMapCache", JSON.stringify(updatedMap));
          return updatedMap;
        });

        setError(null);
      } catch (err) {
        console.error("Failed to parse MQTT message", err);
        setError("Format data MQTT tidak valid");
      }
    });

    client.on("error", (err) => {
      console.error("MQTT connection error:", err);
      setError("Koneksi ke broker MQTT gagal");
    });

    return () => {
      if (client.connected) {
        client.end();
      }
    };
  }, []);

  const renderCard = (device, index) => {
    const stats = [
      {
        title: "Temperature",
        value: device.temperature ?? 0,
        desc: "Temperatur dari sensor DHT",
      },
      {
        title: "Humidity",
        value: device.humidity ?? 0,
        desc: "Kelembaban dari sensor DHT",
      },
      { title: "MQ Status", value: device.mq_status, desc: "Status asap" },
      { title: "Flame Status", value: device.flame_status, desc: "Status api" },
      {
        title: "Timestamp",
        value: device.timestamp
          ? new Date(device.timestamp).toLocaleString("id-ID")
          : "N/A",
        desc: "Waktu input",
      },
      {
        title: "Mac Address",
        value: device.mac_address ?? "N/A",
        desc: "Identitas perangkat",
      },
    ];

    return (
      <div key={index} className="mb-8">
        <h3 className="text-md font-semibold mb-2 dark:text-white">
          Perangkat: {device.mac_address}
        </h3>
        <div className="flex flex-wrap gap-4">
          {stats.map((item, idx) => (
            <div
              key={idx}
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
              <p className="text-gray-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const devices = Object.values(sensorMap);
  const centerPosition = devices.length
    ? [devices[0].latitude ?? 0, devices[0].longitude ?? 0]
    : [-5.434, 105.158];

  return (
    <div className="m-4">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Statistik Realtime Perangkat
      </h2>

      {error && <div className="text-red-500 font-semibold mb-4">{error}</div>}

      {devices.length > 0 ? (
        <>
          {devices.map(renderCard)}
          <div className="h-96 rounded-lg overflow-hidden shadow-md mt-8">
            <MapContainer
              center={centerPosition}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {devices.map((device, idx) => (
                <Marker
                  key={idx}
                  position={[device.latitude ?? 0, device.longitude ?? 0]}
                  title={`Device ${device.mac_address}`}
                >
                  <Popup>
                    <strong>MAC:</strong> {device.mac_address}
                    <br />
                    <strong>Suhu:</strong> {device.temperature}
                    <br />
                    <strong>Asap:</strong> {device.mq_status}
                    <br />
                    <strong>Api:</strong> {device.flame_status}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">Belum ada data masuk</p>
      )}
    </div>
  );
};

export default Statistik;
