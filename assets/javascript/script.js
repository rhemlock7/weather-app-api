var APIkey = "d706a8baa5538ab15ced6f4891dbff96";
var city;
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey + "&units=imperial";

// ----- Test ----- //
var queryURLTest = "http://api.openweathermap.org/data/2.5/weather?q=" + "philadelphia" + "&appid=" + APIkey + "&units=imperial";

// TODO: Accept user input for city



// TODO: Append the city to the city list



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
        console.log('Fetch Response \n-------------');
        console.log("Temp: " + temp)
        console.log("Wind Speed: " + wind)
        console.log("Humidity: " + humidity)
        console.log(data);

        // TODO: Set the elements' text to be the weather data

        // TODO: Append the elements to be displayed on screen
    });