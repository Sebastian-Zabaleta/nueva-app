"use client"; // Necesario para usar hooks como useEffect

import { useState, useEffect } from "react";

// Define la estructura de los datos que esperas recibir
interface SensorData {
  id: number;
  timestamp: string;
  humidity_value: number;
  location: string;
}

export default function Home() {
  const [data, setData] = useState<SensorData[]>([]); // Especifica el tipo de datos del estado

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/sensors"); // Asegúrate de que esta ruta sea correcta
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        const result: SensorData[] = await response.json(); // Define el tipo de los datos de la API
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Llama a la función para obtener los datos
  }, []);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Lecturas de Humedad</h1>
      <table className="table-auto border-collapse border border-gray-300 w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Timestamp</th>
            <th className="border border-gray-300 px-4 py-2">Humedad</th>
            <th className="border border-gray-300 px-4 py-2">Ubicación</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.timestamp}</td>
                <td className="border border-gray-300 px-4 py-2">{item.humidity_value}</td>
                <td className="border border-gray-300 px-4 py-2">{item.location}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-center" colSpan={4}>
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
