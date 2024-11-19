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

  useEffect(() => {
    // Asegúrate de que esta URL sea correcta
    fetch("/api/sensors")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        return response.json();
      })
      .then((data) => {
        // Ordenar los datos por `timestamp` y obtener los últimos 5
        const sortedData = data.sort(
          (a: HumidityData, b: HumidityData) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setData(sortedData.slice(0, 5));
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-800 p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">
        Últimas 5 Lecturas de Humedad
      </h1>
      <div className="overflow-x-auto">
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
                  <td className="border border-gray-700 px-4 py-2 text-gray-200">{item.timestamp}</td>
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
    </div>
  );
}
