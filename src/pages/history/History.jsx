import React, { useEffect, useState } from "react";
import "./History.css";

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    setHistory(storedHistory);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("weatherHistory");
    setHistory([]);
  };

  return (
    <div className="history-container">
      <h1>Історія переглядів</h1>
      {history.length === 0 ? (
        <p>Історія порожня.</p>
      ) : (
        <>
          <ul className="history-list">
            {history.map(({ city, timestamp }, index) => (
              <li key={index} className="history-item">
                <strong>{city}</strong>{" "}
                <span className="timestamp">
                  {new Date(timestamp).toLocaleString("uk-UA")}
                </span>
              </li>
            ))}
          </ul>
          <button className="clear-btn" onClick={clearHistory}>
            Очистити історію
          </button>
        </>
      )}
    </div>
  );
};

export default History;
