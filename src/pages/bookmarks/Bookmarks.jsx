import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Bookmarks.css";

const Bookmarks = () => {
  const [bookmarkedCities, setBookmarkedCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarkedCities")) || [];
    setBookmarkedCities(storedBookmarks);
  }, []);

  const handleCityClick = async (city) => {
    setSelectedCity(city);
    setWeatherData(null);
    setError(null);
    setLoading(true);
    try {
      const response = await axios.get("https://api.weatherapi.com/v1/forecast.json", {
        params: {
          key: "3035a3aa463a4aeea0f203951253005",
          q: city,
          days: 7,
          lang: "ua",
        },
      });
      setWeatherData(response.data);
    } catch (err) {
      setError("Не вдалося отримати погоду для цього міста");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = (cityToRemove) => {
    const updated = bookmarkedCities.filter((city) => city !== cityToRemove);
    localStorage.setItem("bookmarkedCities", JSON.stringify(updated));
    setBookmarkedCities(updated);

    // Якщо видаляється активне місто — очищаємо погоду
    if (selectedCity === cityToRemove) {
      setWeatherData(null);
      setSelectedCity(null);
    }
  };

  return (
    <div className="bookmarks-container">
      <h1>📌 Закладки</h1>

      {bookmarkedCities.length === 0 ? (
        <p>У вас ще немає збережених міст.</p>
      ) : (
        <ul className="bookmarks-list scrollable">
          {bookmarkedCities.map((city, index) => (
            <li key={index} className="bookmark-item">
              <span onClick={() => handleCityClick(city)}>{city}</span>
              <button className="remove-btn" onClick={() => handleRemoveBookmark(city)}>✕</button>
            </li>
          ))}
        </ul>
      )}

      {loading && <p>Завантаження погоди...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {weatherData && (
        <div className="weather-box">
          <h2>
            {weatherData.location.name}, {weatherData.location.country}
          </h2>
          <p>🕒 {weatherData.location.localtime}</p>
          <img
            src={`https:${weatherData.current.condition.icon}`}
            alt={weatherData.current.condition.text}
          />
          <p>
            <strong>{weatherData.current.condition.text}</strong>
          </p>
          <p>🌡️ Температура: {weatherData.current.temp_c}°C</p>
          <p>💧 Вологість: {weatherData.current.humidity}%</p>
          <p>💨 Вітер: {weatherData.current.wind_kph} км/год</p>

          <hr />

          <h3>Прогноз на 7 днів</h3>
          <div className="forecast-list">
            {weatherData.forecast.forecastday.map((day) => (
              <div key={day.date} className="forecast-item">
                <p><strong>{day.date}</strong></p>
                <img
                  src={`https:${day.day.condition.icon}`}
                  alt={day.day.condition.text}
                />
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

export default Bookmarks;
