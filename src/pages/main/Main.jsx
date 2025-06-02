import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Main.css";

const Main = () => {
  const [city, setCity] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [backgroundClass, setBackgroundClass] = useState("");

  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem("weatherBookmarks")) || [];
    setBookmarks(storedBookmarks);
  }, []);

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

  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      try {
        const locationRes = await axios.get("https://ipapi.co/json/");
        const cityFromIP = locationRes.data.city;
        if (cityFromIP) {
          setCity(cityFromIP);
          fetchWeather(cityFromIP);
        }
      } catch (err) {
        console.error("Не вдалося визначити місцезнаходження:", err);
      }
    };
  
    fetchLocationAndWeather();
  }, []);

  const fetchWeather = async (targetCity) => {
    if (!targetCity.trim()) {
      setError("Будь ласка, введіть місто");
      setResult(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json`, {
        params: {
          key: "3035a3aa463a4aeea0f203951253005",
          q: targetCity,
          days: 7,
          lang: "ua",
        },
      });
      setResult(response.data);
      updateHistory(targetCity);
    } catch (err) {
      setError("Місто не знайдено або помилка запиту");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const addToBookmarks = () => {
    if (!result?.location?.name) return;
  
    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedCities")) || [];
    if (!bookmarks.includes(result.location.name)) {
      bookmarks.push(result.location.name);
      localStorage.setItem("bookmarkedCities", JSON.stringify(bookmarks));
    } else {
      alert(`Місто ${result.location.name} вже є в закладках`);
    }
  };

  const handleSearch = () => {
    fetchWeather(city);
  };

  const updateHistory = (city) => {
    const historyKey = "weatherHistory";
    const existing = JSON.parse(localStorage.getItem(historyKey)) || [];
  
    const filtered = existing.filter(
      (entry) => entry.city.toLowerCase() !== city.toLowerCase()
    );
  
    const updated = [
      { city, timestamp: new Date().toISOString() },
      ...filtered,
    ];

    const limited = updated.slice(0, 10);
  
    localStorage.setItem(historyKey, JSON.stringify(limited));
  };

  return (
    <div className={`app ${backgroundClass}`}>
      <h1>Прогноз погоди</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Введіть місто"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
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
          <button className="bookmark-btn" onClick={addToBookmarks}>
            ⭐ Додати в закладки
          </button>

          <p>
            <strong>📍 Координати:</strong> {result.location.lat}, {result.location.lon}
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
      )}
    </div>
  );
};

export default Main;
