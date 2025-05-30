import React, { useState } from "react";
import axios from "axios";
import "./Main.css";

const Main = () => {
  const [city, setCity] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Додав індикатор завантаження

  const handleSearch = async () => {
    if (!city.trim()) {
      setError("Будь ласка, введіть місто");
      setResult(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json`,
        {
          params: {
            key: "3035a3aa463a4aeea0f203951253005",
            q: city,
            days: 7,
            lang: "uk",
          },
        }
      );
      setResult(response.data);
    } catch (err) {
      setError("Місто не знайдено або помилка запиту");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Прогноз погоди</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Введіть місто"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }} // додано можливість запуску пошуку Enter-ом
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Завантаження..." : "Пошук"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div className="result-box">
          <h2>
            {result.location.name}, {result.location.country}
          </h2>
          <p>
            <strong>📍 Координати:</strong> {result.location.lat},{" "}
            {result.location.lon}
          </p>
          <p>
            <strong>🕒 Локальний час:</strong> {result.location.localtime}
          </p>

          <hr />

          <h3>Поточна погода</h3>
          <img
            src={`https:${result.current.condition.icon}`}
            alt={result.current.condition.text}
          />

          <p>
            <strong>{result.current.condition.text}</strong>
          </p>
          <p>
            🌡️ Температура: {result.current.temp_c}°C (відчувається як{" "}
            {result.current.feelslike_c}°C)
          </p>
          <p>
            💨 Вітер: {result.current.wind_kph} км/год, напрям:{" "}
            {result.current.wind_dir}
          </p>
          <p>💧 Вологість: {result.current.humidity}%</p>
          <p>☁️ Хмарність: {result.current.cloud}%</p>

          <hr />

          <h3>Прогноз на 7 днів</h3>
          <div className="forecast-list">
            {result.forecast.forecastday.map((day) => (
              <div key={day.date} className="forecast-item">
                <p>
                  <strong>{day.date}</strong>
                </p>
                {/* <img
                  src={`https:${day.day.condition.icon}`}
                  alt={day.day.condition.text}
                /> */}
                <p>{day.day.condition.text}</p>
                <p>
                  🌡️ {day.day.mintemp_c}°C – {day.day.maxtemp_c}°C
                </p>
                <p>
                  🌞 Схід: {day.astro.sunrise}, Захід: {day.astro.sunset}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
