// ----- HTML Elements ----- //
var citySearchForm = $('#city-search-form')
var citySearchInput = $('#city-search')
var cityList = $('#selected-cities-list')
var clearListButton = $('#clear-list-button')
var currentWeatherDisplay = $('#current-weather-display')
var fiveDayForecast = $('#5-day-forecast-container');

// ----- City Array to fill with Local Storage ----- //
var cityArray = [];

// ----- Weather API ----- // 
var APIkey = "d706a8baa5538ab15ced6f4891dbff96";
var city;
var queryURL;

// Accept user input for city search form
var handleFormSubmit = function (event) {
    event.preventDefault();

    cityInput = citySearchInput.val();

    if (cityInput) {
        // Push value to the cityArray
        cityArray.push(cityInput)

        // Save city in local storage
        localStorage.setItem("cities", JSON.stringify(cityArray))
    } else {
        alert("City input cannot be empty")
        return city;
    }

    // Create city list item
    var createLi = document.createElement('li');
    createLi.textContent = cityInput
    createLi.classList.add("list-group-item", "text-center", "text-white", "bg-black", "bg-gradient", "my-1")

    //Append the li to the city list
    cityList.append(createLi)

    city = cityInput;

    // API
    queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + ",us&cnt=5&appid=" + APIkey + "&units=imperial";

    console.log(city);
    console.log(queryURL);
    getWeatherData(queryURL)
}

// Function that adds each city as a list item under the city search form.
function displayCities() {
    let storedCities = JSON.parse(localStorage.getItem("cities"));
    // console.log(storedCities)
    // console.log(storedCities.length)

    if (storedCities != null) {
        cityArray = storedCities;
    } else {
        localStorage.setItem("cities", JSON.stringify(cityArray))
    }

    if (storedCities.length != 0) {
        for (i = 0; i < storedCities.length; i++) {
            // Create city list item
            var createLi = document.createElement('li');
            createLi.textContent = storedCities[i]
            createLi.classList.add("list-group-item", "text-center", "text-white", "bg-black", "bg-gradient", "my-1")

            //Append the li to the city list
            cityList.append(createLi)
        }
    }
}

function clearList() {
    cityArray = [];
    localStorage.setItem("cities", JSON.stringify(cityArray))
}


// Fetch the weather data and turn it into JSON data to be parsed & displayed on screen
function getWeatherData(url) {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Get specific data and store them in the variables below
            var temp = data.main.temp;
            var wind = data.wind.speed;
            var humidity = data.main.humidity;

            // Create elements to display on screen
            console.log('Fetch Response \n-------------');
            console.log("Temp: " + temp)
            console.log("Wind Speed: " + wind)
            console.log("Humidity: " + humidity)
            console.log(data);

            // Create the HTML elements to be displayed in the PRIMARY weather block
            var weatherH2 = document.createElement('h2');
            var weatherParagraph1 = document.createElement('p');
            var weatherParagraph2 = document.createElement('p');
            var weatherParagraph3 = document.createElement('p');

            // Set the elements' text to be the weather data
            currentWeatherDisplay.css('display', 'block');
            weatherH2.classList.add("mb-4");
            weatherH2.textContent = "The current weather in " + data.name + ": " + data.weather[0].icon
            weatherParagraph1.textContent = "Temp: " + temp + "℉";
            weatherParagraph2.textContent = "Wind Speed: " + wind + "mph";
            weatherParagraph3.textContent = "Humidity : " + humidity;

            // Append the elements to be displayed on screen
            currentWeatherDisplay.append(weatherH2);
            currentWeatherDisplay.append(weatherParagraph1);
            currentWeatherDisplay.append(weatherParagraph2);
            currentWeatherDisplay.append(weatherParagraph3);
            

            // Create 5-Day forcast HTML elements
            for (i=0; i < 5; i++) {
                // Create HTML elements
                var forecastDiv = document.createElement('div');
                forecastDiv.classList.add('bg-black', 'bg-gradient', 'text-white', 'p-2', 'col-2', 'mx-2');
                var forecastH4 = document.createElement('h4');
                var forecastTemp = document.createElement('p');
                var forecastWind = document.createElement('p');
                var forecastHumidity = document.createElement('p');

                // Set text content of each element
                forecastH4.textContent = "12/5/23"
                forecastTemp.textContent = "Temp: "
                forecastWind.textContent = "Wind: "
                forecastHumidity.textContent = "Humidity: "

                // Append elements to the 5-Day Forecast container
                forecastDiv.append(forecastH4);
                forecastDiv.append(forecastTemp);
                forecastDiv.append(forecastWind);
                forecastDiv.append(forecastHumidity);

                // Append the forecast container to the screen
                fiveDayForecast.append(forecastDiv)
            }
        });
}

// Handle city form submit button on page load
citySearchForm.on('submit', handleFormSubmit);
clearListButton.on('click', clearList)

// Display locally stored cities on page load
displayCities();