import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Llamada a la API para obtener los datos de la humedad
    const fetchData = async () => {
      try {
        const response = await fetch("/api/sensors");
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        const result = await response.json();
        setData(result); // Almacenar los datos en el estado
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-8 pb-20">
      <h1 className="text-2xl font-bold text-center mb-8">Lecturas de Humedad</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
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
              data.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.id}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{new Date(item.timestamp).toLocaleString()}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.humidity_value}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.location}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="border border-gray-300 px-4 py-2 text-center">
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
