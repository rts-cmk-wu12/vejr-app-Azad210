import React, { useState } from 'react';
import './style/index.css';
import vejret from "./video/inputMovie.mp4";
import VideoBg from "reactjs-videobg";

const API_KEY = 'de2a1c64ee2e49cbc2cc310422a8bbe1';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  const getWeather = async () => {
    try {
      setError('');
      setWeatherData(null);

      if (!city.trim()) {
        setError('Indtast et bynavn');
        return;
      }

      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoRes.json();

      if (!geoData.length) {
        setError('By ikke fundet.');
        return;
      }

      const { lat, lon, name } = geoData[0];

      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const weather = await weatherRes.json();

      setWeatherData({
        name,
        temp: Math.round(weather.main.temp),
        icon: weather.weather[0].icon,
        description: weather.weather[0].description
      });
    } catch (err) {
      setError('Noget gik galt. Prøv igen.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getWeather();
    }
  };

  return (
    <div className="app-wrapper">



<div className='video-bg'>
<video muted loop autoPlay src={vejret}></video>
</div>
      <div className="container">
        <h1>Søg på vejret her:</h1>
        <div className="form">
          <input
            className="input"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Indtast bynavn"
          />
          <button className="button" onClick={getWeather}>Søg</button>
        </div>

        {error && <p className="error">{error}</p>}

        {weatherData && (
          <div className="result">
            <h2>{weatherData.name}</h2>
            <p className="temperature">{weatherData.temp}°C</p>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
              alt={weatherData.description}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
