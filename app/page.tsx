"use client";

import { useState, useEffect } from "react";

interface HumidityData {
  id: number;
  timestamp: string;
  humidity_value: number;
  location: string;
}

export default function Home() {
  const [location1Data, setLocation1Data] = useState<HumidityData[]>([]);
  const [location2Data, setLocation2Data] = useState<HumidityData[]>([]);
  const [suggestion, setSuggestion] = useState<string>("Cargando...");
  const [playability, setPlayability] = useState<string>("Cargando...");

  const fetchData = () => {
    fetch("/api/sensors")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        return response.json();
      })
      .then((data: HumidityData[]) => {
        // Filtrar y ordenar los datos por ubicación
        const location1 = data
          .filter((item) => item.location === "ubicacion 1")
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5); // Últimas 5 lecturas para ubicación 1

        const location2 = data
          .filter((item) => item.location === "ubicacion 2")
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5); // Últimas 5 lecturas para ubicación 2

        setLocation1Data(location1);
        setLocation2Data(location2);

        // Verificar la última lectura para determinar la condición de juego
        if (location1.length > 0 && location2.length > 0) {
          const lastHumidity1 = location1[0].humidity_value; // Última lectura ubicación 1
          const lastHumidity2 = location2[0].humidity_value; // Última lectura ubicación 2

          const overallAverage = (lastHumidity1 + lastHumidity2) / 2;

          // Determinar la condición de juego
          setPlayability(overallAverage > 40 ? "No apto para jugar" : "Apto para jugar");

          // Determinar la sugerencia de calzado
          if (overallAverage > 60) {
            setSuggestion("No jugar - FS (Soft Ground)");
          } else if (overallAverage < 20) {
            setSuggestion("FG (Firm Ground)");
          } else if (overallAverage >= 20 && overallAverage < 40) {
            setSuggestion("FS (Soft Ground)");
          } else {
            setSuggestion("FS (Soft Ground)");
          }
        } else {
          setPlayability("Datos insuficientes");
          setSuggestion("Cargando...");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    fetchData();

    // Configurar la actualización automática cada 5 segundos
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

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

  const renderTable = (data: HumidityData[], title: string) => (
    <div className="overflow-x-auto mb-6">
      <h2 className="text-xl font-bold text-center text-white mb-4">{title}</h2>
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
  );

  return (
    <div className="min-h-screen bg-gray-800 p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">
        Últimas Lecturas de Humedad
      </h1>

      {/* Cuadro de sugerencia de calzado */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-2">Sugerencia de Calzado</h2>
        <div
          className={`p-4 text-center rounded-md font-bold ${
            suggestion.includes("No jugar")
              ? "bg-red-500 text-white"
              : suggestion === "FG (Firm Ground)"
              ? "bg-green-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          {suggestion || "Cargando..."}
        </div>
      </div>

      {/* Cuadro de aptitud para jugar */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-2">Condición de Juego</h2>
        <div
          className={`p-4 text-center rounded-md font-bold ${
            playability === "Apto para jugar"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {playability || "Cargando..."}
        </div>
      </div>

      {/* Tablas de ubicación */}
      {renderTable(location1Data, "Lecturas Ubicación 1")}
      {renderTable(location2Data, "Lecturas Ubicación 2")}
    </div>
  );
}
