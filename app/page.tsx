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
  const [averageHumidity, setAverageHumidity] = useState<number | null>(null);

  const fetchData = () => {
    fetch("/api/sensors")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        return response.json();
      })
      .then((data: HumidityData[]) => {
        // Ordenar los datos por timestamp descendente
        const sortedData = data.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        // Dividir las lecturas por ubicación
        const location1 = sortedData
          .filter((item) => item.location === "ubicacion 1")
          .slice(0, 2); // Últimas 2 lecturas ubicación 1
        const location2 = sortedData
          .filter((item) => item.location === "ubicacion 2")
          .slice(0, 2); // Últimas 2 lecturas ubicación 2

        setLocation1Data(location1);
        setLocation2Data(location2);

        // Calcular promedio global usando los últimos dos registros generales
        const lastTwoReadings = sortedData.slice(0, 2); // Tomar los últimos dos elementos de toda la base de datos
        if (lastTwoReadings.length === 2) {
          const totalHumidity = lastTwoReadings.reduce(
            (sum, item) => sum + (item.humidity_value || 0),
            0
          );
          const average = totalHumidity / lastTwoReadings.length;
          setAverageHumidity(average);
        } else {
          setAverageHumidity(null); // En caso de que haya menos de 2 registros
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setAverageHumidity(null); // Si ocurre un error, asegurarse de mostrar null
      });
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

      {/* Tablas de ubicación */}
      {renderTable(location1Data, "Lecturas Ubicación 1")}
      {renderTable(location2Data, "Lecturas Ubicación 2")}

      {/* Cuadro de promedio */}
      <div className="mt-6 p-4 bg-gray-900 text-white rounded-md">
        <h2 className="text-lg font-bold mb-2">Promedio de Humedad</h2>
        {averageHumidity !== null ? (
          <p className="text-xl font-semibold">{averageHumidity.toFixed(2)}%</p>
        ) : (
          <p>No hay datos suficientes para calcular el promedio.</p>
        )}
      </div>
    </div>
  );
}
