// ----- HTML Elements ----- //
var citySearchForm = $('#city-search-form')
var citySearchInput = $('#city-search')
var cityList = $('#selected-cities-list')

// ----- City Array to fill with Local Storage ----- //
var cityArray = [];

// ----- Weather API ----- // 
var APIkey = "d706a8baa5538ab15ced6f4891dbff96";
var city;
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey + "&units=imperial";

// ----- Test ----- //
var queryURLTest = "http://api.openweathermap.org/data/2.5/weather?q=" + "philadelphia" + "&appid=" + APIkey + "&units=imperial";

// Accept user input for city search form
var handleFormSubmit = function (event) {
    event.preventDefault();

    city = citySearchInput.val();

    if (city) {
        // Push value to the cityArray
        cityArray.push(city)

        // Save city in local storage
        localStorage.setItem("cities", JSON.stringify(cityArray))
    } else {
        alert("City input cannot be empty")
    }

    // Create city list item
    var createLi = document.createElement('li');
    createLi.textContent = city
    createLi.classList.add("list-group-item", "text-center", "text-white", "bg-black", "bg-gradient", "my-1")

    //Append the li to the city list
    cityList.append(createLi) 
}

// Function that adds each city as a list item under the city search form.
function displayCities() {
    let storedCities = JSON.parse(localStorage.getItem("cities"));
    // console.log(storedCities)
    // console.log(storedCities.length)

    if (storedCities != null) {
        cityArray = storedCities;
    }

    for (i=0; i < storedCities.length; i++) {
        // Create city list item
        var createLi = document.createElement('li');
        createLi.textContent = storedCities[i]
        createLi.classList.add("list-group-item", "text-center", "text-white", "bg-black", "bg-gradient", "my-1")

        //Append the li to the city list
        cityList.append(createLi)   
    }
}









// Fetch the weather data and turn it into JSON data to be parsed & displayed on screen
fetch(queryURLTest)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // Get specific data and store them in the variables below
        var temp = data.main.temp;
        var wind = data.wind.speed;
        var humidity = data.main.humidity;

        // Create elements to display on screen
        // console.log('Fetch Response \n-------------');
        // console.log("Temp: " + temp)
        // console.log("Wind Speed: " + wind)
        // console.log("Humidity: " + humidity)
        // console.log(data);

        // TODO: Set the elements' text to be the weather data

        // TODO: Append the elements to be displayed on screen
    });

// Handle city form submit button on page load
citySearchForm.on('submit', handleFormSubmit);

// Display locally stored cities on page load
displayCities();