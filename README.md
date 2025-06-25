# Weather Application

A modern and responsive weather application that allows users to check weather conditions for any location worldwide. The application provides real-time weather data including temperature, humidity, wind speed, and weather conditions.

## Features

- Search weather by city name
- Display current temperature
- Show weather conditions with icons
- Display additional weather details (feels like temperature, humidity, wind speed)
- Responsive design for all devices
- Optional geolocation support to get local weather
- Error handling for invalid locations

## Setup Instructions

1. First, you need to get an API key from OpenWeatherMap:
   - Go to [OpenWeatherMap](https://openweathermap.org/)
   - Sign up for a free account
   - Get your API key from your account dashboard

2. Open `script.js` and replace `'YOUR_API_KEY'` with your actual OpenWeatherMap API key:
   ```javascript
   const API_KEY = 'your_actual_api_key_here';
   ```

3. Open the `index.html` file in a web browser to run the application.

## Usage

1. Enter a city name in the search box
2. Press Enter or click the search button
3. View the weather information for the specified location

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- OpenWeatherMap API
- Font Awesome Icons

## Optional Features

- Uncomment the `getLocationWeather();` line in `script.js` to automatically fetch weather for the user's current location when the page loads.

## Note

Make sure to keep your API key private and never share it publicly. For production use, it's recommended to set up a backend server to handle API calls and protect your API key. 