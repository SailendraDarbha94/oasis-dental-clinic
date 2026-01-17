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
    <div className="w-full h-full flex items-center justify-center p-2">
      {loading ? (
        <div className="animate-pulse text-gray-400 text-lg font-medium">
          Loading weather...
        </div>
      ) : error ? (
        <div className="text-red-500 text-lg font-medium">{error}</div>
      ) : weather ? (
        <div className="w-full max-w-sm">
          {/* Apple-style Weather Card */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden backdrop-blur-xl bg-opacity-80 border border-white/30">
            {/* Gradient Header */}
            <div className="bg-gradient-to-br from-sky-400 via-blue-400 to-teal-400 p-8 text-center">
              <p className="text-white/80 text-sm font-medium mb-2">Today</p>
              <h2 className="text-white text-5xl font-bold mb-2">
                {weather.temp}°
              </h2>
              <p className="text-white/90 text-base font-medium">
                {weather.condition}
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Min/Max Temperature */}
              <div className="grid grid-cols-2 gap-2 pb-2">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center border border-blue-200/50">
                  <p className="text-gray-600 text-xs font-medium mb-2 uppercase tracking-wide">
                    High
                  </p>
                  <p className="text-blue-600 text-4xl font-bold">
                    {weather.max_temp}°
                  </p>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-6 text-center border border-cyan-200/50">
                  <p className="text-gray-600 text-xs font-medium mb-2 uppercase tracking-wide">
                    Low
                  </p>
                  <p className="text-cyan-600 text-4xl font-bold">
                    {weather.min_temp}°
                  </p>
                </div>
              </div>

              {/* Weather Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💧</span>
                    <div>
                      <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">
                        Humidity
                      </p>
                      <p className="text-gray-900 text-lg font-semibold">
                        {weather.humidity}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💨</span>
                    <div>
                      <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">
                        Wind Speed
                      </p>
                      <p className="text-gray-900 text-lg font-semibold">
                        {weather.wind_speed} m/s
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
