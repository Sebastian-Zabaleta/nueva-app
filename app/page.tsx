"use client";

import { useState, useEffect } from "react";

interface HumidityData {
  id: number;
  timestamp: string;
  humidity_value: number | null;
  location: string;
}

export default function Home() {
  const [location1Data, setLocation1Data] = useState<HumidityData[]>([]);
  const [location2Data, setLocation2Data] = useState<HumidityData[]>([]);
  const [averageHumidity, setAverageHumidity] = useState<string>("No disponible");
  const [quality, setQuality] = useState<string>("No disponible");

  const fetchData = async () => {
    try {
      const response = await fetch("/api/sensors");
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data: HumidityData[] = await response.json();

      console.log("Datos recibidos desde la API:", data);

      if (!Array.isArray(data) || data.length === 0) {
        console.warn("Datos no disponibles o no válidos");
        setAverageHumidity("No disponible");
        setQuality("No disponible");
        return;
      }

      // Filtrar datos válidos
      const validData = data.filter(
        (item) => item.humidity_value !== null && !isNaN(item.humidity_value)
      );

      console.log("Datos válidos después de filtrar:", validData);

      if (validData.length === 0) {
        console.warn("No se encontraron datos válidos");
        setAverageHumidity("No disponible");
        setQuality("No disponible");
        return;
      }

      // Ordenar datos por timestamp
      const sortedData = validData.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      console.log("Datos ordenados:", sortedData);

      // Obtener las últimas dos lecturas
      const lastTwo = sortedData.slice(0, 2);

      console.log("Últimas dos lecturas:", lastTwo);

      if (lastTwo.length === 2) {
        const validValues = lastTwo.map((item) => item.humidity_value || 0);
        const average =
          validValues.reduce((sum, value) => sum + value, 0) / validValues.length;

        setAverageHumidity(`${average.toFixed(2)}%`);

        // Determinar calidad de juego
        if (average <= 20) {
          setQuality("Buena");
        } else if (average <= 40) {
          setQuality("Normal");
        } else if (average <= 60) {
          setQuality("Mala");
        } else {
          setQuality("Pésima");
        }
      } else {
        setAverageHumidity("No disponible");
        setQuality("No disponible");
      }

      // Filtrar datos por ubicación
      const location1 = sortedData
        .filter((item) => item.location === "ubicacion 1")
        .slice(0, 2);
      const location2 = sortedData
        .filter((item) => item.location === "ubicacion 2")
        .slice(0, 2);

      setLocation1Data(location1);
      setLocation2Data(location2);
    } catch (error) {
      console.error("Error al procesar los datos:", error);
      setAverageHumidity("No disponible");
      setQuality("No disponible");
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
                <td className="border border-gray-700 px-4 py-2 text-gray-200">
                  {item.id}
                </td>
                <td className="border border-gray-700 px-4 py-2 text-gray-200">
                  {new Date(item.timestamp).toLocaleString()}
                </td>
                <td className="border border-gray-700 px-4 py-2 text-gray-200">
                  {item.humidity_value !== null
                    ? `${item.humidity_value.toFixed(2)}%`
                    : "N/A"}
                </td>
                <td className="border border-gray-700 px-4 py-2 text-gray-200">
                  {item.location}
                </td>
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

      {/* Cuadro del promedio de humedad */}
      <div className="mt-6 p-4 bg-gray-900 text-white rounded-md shadow-md">
        <h2 className="text-lg font-bold">Promedio de Humedad</h2>
        <p>{averageHumidity}</p>
      </div>

      {/* Cuadro de calidad de juego */}
      <div className="mt-6 p-4 bg-gray-900 text-white rounded-md shadow-md">
        <h2 className="text-lg font-bold">Calidad de Juego</h2>
        <p>{quality}</p>
      </div>
    </div>
  );
}
