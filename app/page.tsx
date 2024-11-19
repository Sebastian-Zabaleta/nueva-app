"use client";

import { useState, useEffect } from "react";

interface HumidityData {
  id: number;
  timestamp: string;
  humidity_value: number;
  location: string;
}

export default function Home() {
  const [data, setData] = useState<HumidityData[]>([]);
  const [lastHumidity, setLastHumidity] = useState<number | null>(null);

  const fetchData = () => {
    fetch("/api/sensors")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        return response.json();
      })
      .then((data) => {
        const sortedData = data.sort(
          (a: HumidityData, b: HumidityData) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setData(sortedData.slice(0, 5));

        // Obtener la última lectura de humedad
        if (sortedData.length > 0) {
          setLastHumidity(sortedData[0].humidity_value);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    fetchData();

    // Configurar intervalo de actualización cada 5 segundos
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div className="min-h-screen bg-gray-800 p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">
        Últimas 5 Lecturas de Humedad
      </h1>
      <div className="overflow-x-auto mb-6">
        <table className="table-auto w-full bg-gray-900 text-white border border-gray-700">
          <thead>
            <tr>
              <th className="border border-gray-700 px-4 py-2 text-gray-300">ID</th>
              <th className="border border-gray-700 px-4 py-2 text-gray-300">Timestamp</th>
              <th className="border border-gray-700 px-4 py-2 text-gray-300">Humedad</th>
              <th className="border border-gray-700 px-4 py-2 text-gray-300">Ubicación</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-700">
                  <td className="border border-gray-700 px-4 py-2 text-gray-200">{item.id}</td>
                  <td className="border border-gray-700 px-4 py-2 text-gray-200">
                    {formatTimestamp(item.timestamp)}
                  </td>
                  <td className="border border-gray-700 px-4 py-2 text-gray-200">{item.humidity_value}</td>
                  <td className="border border-gray-700 px-4 py-2 text-gray-200">{item.location}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center border border-gray-700 px-4 py-2 text-gray-400"
                >
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {lastHumidity !== null && (
        <div
          className={`p-4 text-center rounded-md font-bold ${
            lastHumidity < 60
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {lastHumidity < 60 ? "Apto para jugar" : "No apto para jugar"}
        </div>
      )}
    </div>
  );
}
