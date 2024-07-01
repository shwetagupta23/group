const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const weatherCardsDiv = document.querySelector(".weathr-card");

const API_KEY = "98c52c9d2c1a150cedc2eb19af3cbfd0";


const createWeatherCard = (weatherItem) => {
  return `
    <li class="card">
      <h3>${weatherItem.dt_txt.split(" ")[0]}</h3> 
      <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon" height="80px">
      <h4>Temp : ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
      <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
      <h4>Humidity : ${weatherItem.main.humidity}%</h4>
    </li>`;
};

const getWeatherDetails = (cityName, lat, lon) => {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  fetch(WEATHER_API_URL).then(res => {
    if (!res.ok) {
      throw new Error('Network response was not ok ' + res.statusText);
    }
    return res.json();
  }).then(data => {
    const uniqueForecastDays = [];
    const fiveDaysForecast = data.list.filter(forecast => {
      const forecastDate = new Date(forecast.dt_txt).getDate();
      if (!uniqueForecastDays.includes(forecastDate)) {
        uniqueForecastDays.push(forecastDate);
        return true;
      }
      return false;
    });

    console.log(fiveDaysForecast);

    weatherCardsDiv.innerHTML = '';
    fiveDaysForecast.forEach(weatherItem => {
      weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem));
    });
  }).catch(error => {
    alert("An error occurred while fetching the weather data: " + error.message);
  });
};

const getCoordinates = () => {
  const cityName = cityInput.value.trim();
  if (!cityName) return;
  const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  fetch(GEOCODING_API_URL).then(res => {
    if (!res.ok) {
      throw new Error('Network response was not ok ' + res.statusText);
    }
    return res.json();
  }).then(data => {
    if (!data.length) return alert(`No coordinates found for ${cityName}`);
    const { name, lat, lon } = data[0];
    getWeatherDetails(name, lat, lon);
  }).catch(error => {
    alert("An error occurred while fetching the coordinates: " + error.message);
  });
};

searchButton.addEventListener("click", getCoordinates)