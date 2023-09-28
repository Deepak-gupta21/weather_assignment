// Constants
const apiKey = 'YOUR_API_KEY'; // Replace with your API key
const weatherInfoElement = document.getElementById('weatherInfo');
const locationInput = document.getElementById('locationInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const unitToggle = document.getElementById('unitToggle');

// Event listener for the "Get Weather" button
getWeatherBtn.addEventListener('click', () => {
    const location = locationInput.value;
    const unit = getSelectedUnit();
    
    // Check if location is empty
    if (!location) {
        showError("Please enter a location.");
        return;
    }

    // Fetch weather data
    fetchWeatherByCoordinates(location, unit); // Call fetchWeatherByCoordinates instead
});


// Function to fetch weather data from the API by coordinates

function fetchWeatherByCoordinates(latitude, longitude, unit) {
    // Replace 'YOUR_API_KEY' with your actual API key
    const apiKey = 'YOUR_API_KEY';

    // Construct the API request URL
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;

    // Make the API request
    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            displayWeatherData(data);
        })
        .catch((error) => {
            showError("An error occurred while fetching weather data. Please try again.");
        });
}




// Function to display weather data
function displayWeatherData(data) {
    // Extract relevant data from the API response
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const weatherDescription = data.weather[0].description;

    // Display the data on the page
    const weatherHtml = `
        <h2>Weather in ${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${temperature} &deg;${getSelectedUnitSymbol()}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>Description: ${weatherDescription}</p>
    `;

    weatherInfoElement.innerHTML = weatherHtml;
}

// Function to show an error message
function showError(message) {
    weatherInfoElement.innerHTML = `<p class="error">${message}</p>`;
}

// Function to get the selected temperature unit
function getSelectedUnit() {
    const unitRadioButtons = document.querySelectorAll('input[name="unit"]');
    for (const radioButton of unitRadioButtons) {
        if (radioButton.checked) {
            return radioButton.value;
        }
    }
    return 'metric'; // Default to Celsius
}

// Function to get the symbol for the selected temperature unit
function getSelectedUnitSymbol() {
    const unit = getSelectedUnit();
    if (unit === 'metric') {
        return 'C';
    } else if (unit === 'imperial') {
        return 'F';
    } else {
        return 'K';
    }
}

// Function to get weather based on geolocation
function getWeatherByGeolocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const unit = getSelectedUnit();
            
            // Fetch weather data using geolocation coordinates
            fetchWeatherByCoordinates(latitude, longitude, unit);
        }, function (error) {
            // Handle geolocation error
            if (error.code === error.PERMISSION_DENIED) {
                showError("Geolocation permission denied. Please enter a location.");
            } else {
                showError("Error getting geolocation data. Please try again.");
            }
        });
    } else {
        showError("Geolocation is not supported by your browser.");
    }
}

// Event listener for the "Use My Location" button
const geolocationBtn = document.getElementById('geolocationBtn');
geolocationBtn.addEventListener('click', getWeatherByGeolocation);
