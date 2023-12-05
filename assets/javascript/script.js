// ----- HTML Elements ----- //
var citySearchForm = $('#city-search-form')
var citySearchInput = $('#city-search')
var cityList = $('#selected-cities-list')
var clearListButton = $('#clear-list-button')
var currentWeatherDisplay = $('#current-weather-display')

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
    queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + ",us&appid=" + APIkey + "&units=imperial";

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

            // TODO: Set the elements' text to be the weather data
            var weatherH2 = document.createElement('h2');
            var weatherParagraph1 = document.createElement('p');
            var weatherParagraph2 = document.createElement('p');
            var weatherParagraph3 = document.createElement('p');
            currentWeatherDisplay.css('display', 'block');
            weatherH2.classList.add("mb-4");
            weatherH2.textContent = "The current weather in " + data.name + ": " + data.weather[0].icon
            weatherParagraph1.textContent = "Temp: " + temp + "℉";
            weatherParagraph2.textContent = "Wind Speed: " + wind + "mph";
            weatherParagraph3.textContent = "Humidity : " + humidity;


            // TODO: Append the elements to be displayed on screen
            currentWeatherDisplay.append(weatherH2);
            currentWeatherDisplay.append(weatherParagraph1);
            currentWeatherDisplay.append(weatherParagraph2);
            currentWeatherDisplay.append(weatherParagraph3);
        });
}

// Handle city form submit button on page load
citySearchForm.on('submit', handleFormSubmit);
clearListButton.on('click', clearList)

// Display locally stored cities on page load
displayCities();