"use client";

import { useState, useEffect } from 'react';

interface WeatherData {
  temp: number;
  max_temp: number;
  min_temp: number;
  humidity: number;
  wind_speed: number;
  condition: string;
}

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://api.api-ninjas.com/v1/weather?lat=27.1075683&lon=93.6993649', {
          headers: { 'X-Api-Key': 'gFaMkn2Q8A9VX451sUXEGg==rQOPJFM09TzX4mlY' },
          method: 'GET',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch weather');
        }

        const data = await res.json();
        setWeather({
          temp: Math.round(data.temp),
          max_temp: Math.round(data.max_temp),
          min_temp: Math.round(data.min_temp),
          humidity: data.humidity,
          wind_speed: Math.round(data.wind_speed),
          condition: data.cloud_pct ? `${data.cloud_pct}% Cloudy` : 'Clear',
        });
      } catch (err) {
        setError('Unable to load weather');
        console.log('Error fetching weather details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherDetails();
  }, []);

  return (
    <div className="w-full flex items-center justify-center px-4 py-2">
      {loading ? (
        <div className="animate-pulse text-gray-400 text-sm">Loading weather...</div>
      ) : error ? (
        <div className="text-red-400 text-sm">{error}</div>
      ) : weather ? (
        <div className="flex items-center gap-4 bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl px-5 py-3 shadow-sm">
          {/* Temperature */}
          <div className="flex items-end gap-1">
            <span className="text-3xl font-light text-sky-500 leading-none">{weather.temp}°</span>
            <span className="text-xs text-gray-400 mb-0.5 leading-none">C</span>
          </div>

          <div className="w-px h-8 bg-gray-200" />

          {/* Condition & High/Low */}
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-gray-600">{weather.condition}</span>
            <span className="text-xs text-gray-400">
              H:{weather.max_temp}° · L:{weather.min_temp}°
            </span>
          </div>

          <div className="w-px h-8 bg-gray-200" />

          {/* Details */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>💧 {weather.humidity}%</span>
            <span>💨 {weather.wind_speed} m/s</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
