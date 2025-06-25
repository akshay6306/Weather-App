// OpenWeatherMap API configuration
const API_KEY = '900f9adb9fc3db239fa60bb94065e72a'; // TODO: Replace this with your API key from https://openweathermap.org/
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// DOM elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const weatherInfo = document.querySelector('.weather-info');
const errorMessage = document.querySelector('.error-message');
const forecastContainer = document.querySelector('.forecast-container');
const forecastBoxes = document.querySelector('.forecast-boxes');

// Weather information elements
const cityElement = document.querySelector('.city');
const countryElement = document.querySelector('.country');
const dateTimeElement = document.querySelector('.current-date-time');
const tempElement = document.querySelector('.temp');
const weatherIcon = document.querySelector('.weather-icon');
const conditionElement = document.querySelector('.condition');
const feelsLikeElement = document.querySelector('.feels-like');
const humidityElement = document.querySelector('.humidity');
const windSpeedElement = document.querySelector('.wind-speed');
const sunriseElement = document.querySelector('.sunrise');
const sunsetElement = document.querySelector('.sunset');

// Event listeners
searchButton.addEventListener('click', () => getWeatherData(searchInput.value.trim()));
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeatherData(searchInput.value.trim());
    }
});

// Function to format date
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }).format(date);
}

// Function to format time
function formatTime(timestamp) {
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }).format(new Date(timestamp * 1000));
}

// Function to update date and time
function updateDateTime() {
    dateTimeElement.textContent = formatDate(new Date());
}

// Function to fetch weather data
async function getWeatherData(city, coords = null) {
    if (!city && !coords) return;

    try {
        let weatherUrl;
        let forecastUrl;

        if (coords) {
            const { latitude, longitude } = coords;
            weatherUrl = `${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
            forecastUrl = `${FORECAST_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
        } else {
            weatherUrl = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;
            forecastUrl = `${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric`;
        }

        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(weatherUrl),
            fetch(forecastUrl)
        ]);

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        if (weatherData.cod === '404') {
            showError();
            return;
        }

        updateWeatherUI(weatherData);
        updateForecastUI(forecastData);
        hideError();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError();
    }
}

// Function to update the UI with weather data
function updateWeatherUI(data) {
    weatherInfo.classList.remove('hidden');
    
    // Update location
    cityElement.textContent = data.name;
    countryElement.textContent = `, ${data.sys.country}`;
    
    // Update date and time
    updateDateTime();
    
    // Update temperature
    tempElement.textContent = Math.round(data.main.temp);
    
    // Update weather condition and icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    conditionElement.textContent = data.weather[0].description;
    
    // Update weather details
    feelsLikeElement.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidityElement.textContent = `${data.main.humidity}%`;
    windSpeedElement.textContent = `${Math.round(data.wind.speed)} m/s`;
    
    // Update sunrise and sunset times
    sunriseElement.textContent = formatTime(data.sys.sunrise);
    sunsetElement.textContent = formatTime(data.sys.sunset);
}

// Function to update the forecast UI
function updateForecastUI(data) {
    forecastContainer.classList.remove('hidden');
    forecastBoxes.innerHTML = '';

    // Group forecast by day and get daily data
    const dailyData = data.list.reduce((acc, item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = {
                date: new Date(item.dt * 1000),
                temp_min: item.main.temp_min,
                temp_max: item.main.temp_max,
                icon: item.weather[0].icon
            };
        }
        return acc;
    }, {});

    // Create forecast boxes (limit to 5 days)
    Object.values(dailyData).slice(0, 5).forEach(day => {
        const forecastBox = document.createElement('div');
        forecastBox.className = 'forecast-box';
        forecastBox.innerHTML = `
            <div class="date">${new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(day.date)}</div>
            <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="weather icon">
            <div class="temps">
                <span class="temp-max">${Math.round(day.temp_max)}°</span>
                <span class="temp-min">${Math.round(day.temp_min)}°</span>
            </div>
        `;
        forecastBoxes.appendChild(forecastBox);
    });
}

// Function to show error message
function showError() {
    weatherInfo.classList.add('hidden');
    forecastContainer.classList.add('hidden');
    errorMessage.classList.remove('hidden');
}

// Function to hide error message
function hideError() {
    errorMessage.classList.add('hidden');
}

// Get weather for user's current location on page load
function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => getWeatherData(null, position.coords),
            (error) => {
                console.error('Error getting location:', error);
                // Default to a major city if location access is denied
                getWeatherData('London');
            }
        );
    } else {
        // Default to a major city if geolocation is not supported
        getWeatherData('London');
    }
}

// Update date and time every minute
setInterval(updateDateTime, 60000);

// Initialize the app
getLocationWeather(); 