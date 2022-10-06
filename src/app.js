function formatDate() {
  let today = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[today.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[today.getMonth()];
  let hour = today.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = today.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let date = today.getDate();

  let currentDateTime = `${day} ${hour}:${minutes} ${month} ${date}`;

  return currentDateTime;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
       <div class="col">
            <div class="weather-forecast-date">${formatDay(
              forecastDay.dt
            )}</div>
            <img
              src="http://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png"
              alt=""
              width="50"
            />
            <div class="weather-forecast-temperatures">
              <span class="weather-forecast-temperature-max">  ${Math.round(
                forecastDay.temp.max
              )}°  </span>
              <span class="weather-forecast-temperature-min">  ${Math.round(
                forecastDay.temp.min
              )}° </span>
            </div>
          </div>
          `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "bf54175800a55e59e6c4d6461deeef12";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showTempCity(response) {
  let temperature = Math.round(response.data.main.temp);
  let city = response.data.name;
  let description = response.data.weather[0].description;
  let humidity = response.data.main.humidity;
  let wind = Math.round(response.data.wind.speed);

  let currentTemp = document.querySelector("#current-temp");
  let cityName = document.querySelector("#city");
  let descriptionCondition = document.querySelector("#current-condition");
  let humidityLevel = document.querySelector("#humidity-level");
  let windLevel = document.querySelector("#wind-level");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;

  cityName.innerHTML = `${city},`;
  currentTemp.innerHTML = `${temperature}`;
  descriptionCondition.innerHTML = `${description} `;
  humidityLevel.innerHTML = `${humidity} %`;
  windLevel.innerHTML = `${wind} km/h`;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);

  let todayDate = document.querySelector("#today");
  todayDate.innerHTML = formatDate(new Date());
}

function retrieveCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#enter-city").value;
  let units = "metric";
  let apiKey = "bf54175800a55e59e6c4d6461deeef12";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${apiEndpoint}q=${cityInput}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showTempCity);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("click", retrieveCity);

function changeToF(event) {
  event.preventDefault();
  let searchTemperature = document.querySelector("#current-temp");

  tempCelsius.classList.remove("active");
  tempFarenheit.classList.add("active");

  let tempInF = celsiusTemperature * 1.8 + 32;
  searchTemperature.innerHTML = Math.round(tempInF);
}

let tempFarenheit = document.querySelector("#fahrenheit-link");
tempFarenheit.addEventListener("click", changeToF);

function changeToC(event) {
  event.preventDefault();
  let searchTemperature = document.querySelector("#current-temp");

  tempCelsius.classList.add("active");
  tempFarenheit.classList.remove("active");

  searchTemperature.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let tempCelsius = document.querySelector("#celsius-link");
tempCelsius.addEventListener("click", changeToC);
