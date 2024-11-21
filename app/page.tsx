"use client";

import { useState, useEffect } from "react";

interface HumidityData {
  id: number;
  timestamp: string;
  humidity_value: number;
  location: string;
}

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
}

export default function Home() {
  const [location1Data, setLocation1Data] = useState<HumidityData[]>([]);
  const [location2Data, setLocation2Data] = useState<HumidityData[]>([]);
  const [averageHumidity, setAverageHumidity] = useState<number | null>(null);
  const [quality, setQuality] = useState<string>("No disponible");
  const [footwear, setFootwear] = useState<string>("No disponible");
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/sensors");
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data: HumidityData[] = await response.json();

      const sortedData = data.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      const location1 = sortedData
        .filter((item) => item.location === "ubicacion 1")
        .slice(0, 2);
      const location2 = sortedData
        .filter((item) => item.location === "ubicacion 2")
        .slice(0, 2);

      setLocation1Data(location1);
      setLocation2Data(location2);

      const lastTwoReadings = sortedData.slice(0, 2);
      if (lastTwoReadings.length === 2) {
        const totalHumidity = lastTwoReadings.reduce(
          (sum, item) => sum + Number(item.humidity_value),
          0
        );
        const average = totalHumidity / lastTwoReadings.length;
        setAverageHumidity(average);

        if (average <= 20) {
          setQuality("Buena");
          setFootwear("FG");
        } else if (average <= 40) {
          setQuality("Normal");
          setFootwear("FS");
        } else if (average <= 60) {
          setQuality("Mala");
          setFootwear("FS");
        } else {
          setQuality("Pésima");
          setFootwear("FS");
        }
      } else {
        setAverageHumidity(null);
        setQuality("No disponible");
        setFootwear("No disponible");
      }
    } catch (error) {
      console.error("Error:", error);
      setAverageHumidity(null);
      setQuality("No disponible");
      setFootwear("No disponible");
    }
  };

  const fetchWeather = async () => {
    try {
      const apiKey = "TU_API_KEY"; // Reemplaza con tu API Key de OpenWeatherMap
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Fusagasuga,CO&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error("Error al obtener los datos del clima");
      }

      const data = await response.json();

      setWeather({
        temperature: data.main.temp,
        description: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
      });
    } catch (error) {
      console.error("Error al obtener el clima:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchWeather();

    const interval = setInterval(() => {
      fetchData();
      fetchWeather();
    }, 600000); // Actualiza cada 10 minutos

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
    <div className="overflow-x-auto mb-6 shadow-lg rounded-md">
      <h2 className="text-xl font-bold text-center text-white bg-green-600 py-2 rounded-t-md">
        {title}
      </h2>
      <table className="table-auto w-full bg-gray-800 text-white border border-gray-700 rounded-b-md">
        <thead>
          <tr className="bg-green-700">
            <th className="border border-gray-600 px-4 py-2">ID</th>
            <th className="border border-gray-600 px-4 py-2">Timestamp</th>
            <th className="border border-gray-600 px-4 py-2">Humedad</th>
            <th className="border border-gray-600 px-4 py-2">Ubicación</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-green-800">
                <td className="border border-gray-600 px-4 py-2 text-center">{item.id}</td>
                <td className="border border-gray-600 px-4 py-2 text-center">
                  {formatTimestamp(item.timestamp)}
                </td>
                <td className="border border-gray-600 px-4 py-2 text-center">
                  {item.humidity_value}
                </td>
                <td className="border border-gray-600 px-4 py-2 text-center">{item.location}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center border border-gray-600 px-4 py-2 text-gray-400">
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 text-white">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-500 mb-6">
        Estado de la Cancha de Fútbol
      </h1>

      {renderTable(location1Data, "Lecturas Ubicación 1")}
      {renderTable(location2Data, "Lecturas Ubicación 2")}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="p-4 bg-green-700 shadow-lg rounded-md text-center">
          <h2 className="text-lg font-bold mb-2">Promedio de Humedad</h2>
          {averageHumidity !== null ? (
            <p className="text-xl font-semibold">{averageHumidity.toFixed(2)}%</p>
          ) : (
            <p>No hay datos suficientes para calcular el promedio.</p>
          )}
        </div>

        <div className="p-4 bg-green-700 shadow-lg rounded-md text-center">
          <h2 className="text-lg font-bold mb-2">Calidad de Juego</h2>
          <p className="text-xl font-semibold">{quality}</p>
        </div>

        <div className="p-4 bg-green-700 shadow-lg rounded-md text-center">
          <h2 className="text-lg font-bold mb-2">Tipo de Calzado</h2>
          <p className="text-xl font-semibold">{footwear}</p>
        </div>
      </div>

      {/* Información del Clima */}
      <div className="mt-6 p-4 bg-green-700 shadow-lg rounded-md text-center">
        <h2 className="text-lg font-bold mb-2">Clima en Fusagasugá</h2>
        {weather ? (
          <div>
            <p className="text-xl font-semibold">
              {weather.temperature}°C - {weather.description}
            </p>
            <img
              src={weather.icon}
              alt="Icono del clima"
              className="mx-auto mt-2"
            />
          </div>
        ) : (
          <p>Cargando datos del clima...</p>
        )}
      </div>
    </div>
  );
}
