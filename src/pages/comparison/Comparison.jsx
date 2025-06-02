import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Comparison.css";

const WeatherResult = ({ result, onBookmark }) => (
  <div className="result-box">
    <h2>
      {result.location.name}, {result.location.country}
    </h2>
    <button className="bookmark-btn" onClick={() => onBookmark(result)}>
      ⭐ Додати в закладки
    </button>
    <p><strong>📍 Координати:</strong> {result.location.lat}, {result.location.lon}</p>
    <p><strong>🕒 Локальний час:</strong> {result.location.localtime}</p>
    <hr />
    <h3>Поточна погода</h3>
    <img src={`https:${result.current.condition.icon}`} alt={result.current.condition.text} />
    <p><strong>{result.current.condition.text}</strong></p>
    <p>🌡️ Температура: {result.current.temp_c}°C (відчувається як {result.current.feelslike_c}°C)</p>
    <p>💨 Вітер: {result.current.wind_kph} км/год, напрям: {result.current.wind_dir}</p>
    <p>💧 Вологість: {result.current.humidity}%</p>
    <p>☁️ Хмарність: {result.current.cloud}%</p>
    <hr />
    <h3>Прогноз на 7 днів</h3>
    <div className="forecast-list">
      {result.forecast.forecastday.map((day) => (
        <div key={day.date} className="forecast-item">
          <p><strong>{day.date}</strong></p>
          <p>{day.day.condition.text}</p>
          <p>🌡️ {day.day.mintemp_c}°C – {day.day.maxtemp_c}°C</p>
          <p>🌞 Схід: {day.astro.sunrise}, Захід: {day.astro.sunset}</p>
        </div>
      ))}
    </div>
  </div>
);

const Comparison = () => {
  const [city, setCity] = useState("");
  const [city2, setCity2] = useState("");
  const [result, setResult] = useState(null);
  const [result2, setResult2] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backgroundClass, setBackgroundClass] = useState("");

  useEffect(() => {
    if (result?.current?.condition) {
      const code = result.current.condition.code;
      if ([1000].includes(code)) {
        setBackgroundClass("clear-sky");
      } else if ([1003, 1006, 1009].includes(code)) {
        setBackgroundClass("cloudy");
      } else if ([1030, 1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) {
        setBackgroundClass("rain");
      } else if ([1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225].includes(code)) {
        setBackgroundClass("snow");
      } else {
        setBackgroundClass("default-bg");
      }
    } else {
      setBackgroundClass("default-bg");
    }
  }, [result]);

  const handleSearch = async () => {
    if (!city.trim() || !city2.trim()) {
      setError("Будь ласка, введіть обидва міста");
      setResult(null);
      setResult2(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [res1, res2] = await Promise.all([
        axios.get("https://api.weatherapi.com/v1/forecast.json", {
          params: {
            key: "3035a3aa463a4aeea0f203951253005",
            q: city,
            days: 7,
            lang: "ua",
          },
        }),
        axios.get("https://api.weatherapi.com/v1/forecast.json", {
          params: {
            key: "3035a3aa463a4aeea0f203951253005",
            q: city2,
            days: 7,
            lang: "ua",
          },
        }),
      ]);

      setResult(res1.data);
      setResult2(res2.data);
      updateHistory(city);
      updateHistory(city2);
    } catch (err) {
      setError("Місто не знайдено або помилка запиту");
      setResult(null);
      setResult2(null);
    } finally {
      setLoading(false);
    }
  };

  const updateHistory = (cityName) => {
    const historyKey = "weatherHistory";
    const existing = JSON.parse(localStorage.getItem(historyKey)) || [];

    const filtered = existing.filter(
      (entry) => entry.city.toLowerCase() !== cityName.toLowerCase()
    );

    const updated = [
      { city: cityName, timestamp: new Date().toISOString() },
      ...filtered,
    ];

    localStorage.setItem(historyKey, JSON.stringify(updated.slice(0, 10)));
  };

  const addToBookmarks = (res) => {
    if (!res?.location?.name) return;

    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedCities")) || [];
    if (!bookmarks.includes(res.location.name)) {
      bookmarks.push(res.location.name);
      localStorage.setItem("bookmarkedCities", JSON.stringify(bookmarks));
    } else {
      alert(`Місто ${res.location.name} вже є в закладках`);
    }
  };

  return (
    <div className={`app ${backgroundClass}`}>
      <h1>Порівняння погоди</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Місто 1"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Місто 2"
          value={city2}
          onChange={(e) => setCity2(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Завантаження..." : "Порівняти"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && result2 && (
        <div className="compare-container">
          <WeatherResult result={result} onBookmark={addToBookmarks} />
          <WeatherResult result={result2} onBookmark={addToBookmarks} />
        </div>
      )}
    </div>
  );
};

export default Comparison;
