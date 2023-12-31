// ----- HTML Elements ----- //
var citySearchForm = $('#city-search-form')
var citySearchInput = $('#city-search')
var cityList = $('#selected-cities-list')
var clearListButton = $('#clear-list-button')
var currentWeatherDisplay = $('#current-weather-display')
var fiveDayForecast = $('#five-day-forecast-container');
var forecastDetailContainer = document.createElement('div');
forecastDetailContainer.classList.add('row');
var cityButtonId = $('#city-button')
var weatherDetailsContainer = $('#weather-details-container')

// ----- City Array to fill with Local Storage ----- //
var cityArray = [];

// ----- Weather API ----- // 
var APIkey = "d706a8baa5538ab15ced6f4891dbff96";
var city;

// Accept user input for city search form
var handleFormSubmit = function (event) {
    event.preventDefault();

    cityInput = citySearchInput.val();
    city = cityInput.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');

    if (city) {
        if (cityArray.includes(city) === false) {
            // Push value to the cityArray
            cityArray.push(city)
            // Save city in local storage
            localStorage.setItem("cities", JSON.stringify(cityArray))

            // Create city button
            var createButton = document.createElement('button');
            createButton.textContent = city
            createButton.setAttribute("data-city", city)
            createButton.setAttribute("id", "city-button")
            createButton.classList.add("list-group-item", "text-center", "text-white", "bg-black", "bg-gradient", "my-1")


            //Append the li to the city list
            cityList.append(createButton)
        }
    } else {
        alert("City input cannot be empty")
        return;
    }

    // API
    locationCoordinates = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIkey;

    // fetch with locationCoordinates url
    fetch(locationCoordinates)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            latitude = data[0].lat;
            longitude = data[0].lon;
            getWeatherData(latitude, longitude)
        })

}

// Function that adds each city as a list item under the city search form.
function displayCities() {
    let storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities != null) {
        cityArray = storedCities;
    } else {
        localStorage.setItem("cities", JSON.stringify(cityArray))
    }

    if (storedCities.length != 0) {
        for (i = 0; i < storedCities.length; i++) {
            // Create city list item
            var createButton = document.createElement('button');
            createButton.textContent = storedCities[i]
            createButton.setAttribute("id", "city-button")
            createButton.setAttribute("data-city", storedCities[i])
            createButton.setAttribute("class", "list-group-item text-center text-white bg-black bg-gradient my-1")

            //Append the li to the city list
            cityList.append(createButton)
        }
    }
}

function clearList() {
    cityArray = [];
    localStorage.setItem("cities", JSON.stringify(cityArray))
}


// Fetch the weather data and turn it into JSON data to be parsed & displayed on screen
function getWeatherData(lat, lon) {
    currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=imperial`
    fiveDayWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=imperial`

    fetch(currentWeatherURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (currentData) {

            if (currentData) {

                if (weatherDetailsContainer.hasClass('no-data')) {

                    // Remove the no-data class and replace it with "data" class
                    weatherDetailsContainer.removeClass('no-data')
                    weatherDetailsContainer.addClass('data')


                    // Get specific data and store them in the variables below
                    var temp = currentData.main.temp;
                    var wind = currentData.wind.speed;
                    var humidity = currentData.main.humidity;

                    // Create elements to display on screen


                    // Create the HTML elements to be displayed in the PRIMARY weather block
                    var weatherH2 = document.createElement('h2');
                    var currentDateH3 = document.createElement('h3');
                    var currentWeatherIcon = document.createElement('img');
                    var weatherParagraph1 = document.createElement('p');
                    var weatherParagraph2 = document.createElement('p');
                    var weatherParagraph3 = document.createElement('p');

                    var currentDataIcon = currentData.weather[0].icon;
                    var iconAlt = currentData.weather[0].description;

                    // Set the elements' text to be the weather currentData
                    currentWeatherDisplay.css('display', 'block');
                    fiveDayForecast.css('display', 'block');
                    weatherH2.classList.add("mb-4");
                    currentWeatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + currentDataIcon + ".png")
                    currentWeatherIcon.setAttribute("alt", iconAlt)
                    currentWeatherIcon.setAttribute("style", "padding-bottom:10px")
                    weatherH2.textContent = "The current weather in " + currentData.name + ": " + currentData.weather[0].main;
                    currentDateH3.textContent = dayjs().format("dddd, MMM D, YYYY")
                    weatherParagraph1.textContent = "Temp: " + temp + "℉";
                    weatherParagraph2.textContent = "Wind Speed: " + wind + "mph";
                    weatherParagraph3.textContent = "Humidity : " + humidity + "g/kg";

                    // Append the elements to be displayed on screen
                    currentWeatherDisplay.append(weatherH2);
                    currentWeatherDisplay.append(currentDateH3);
                    currentWeatherDisplay.append(currentWeatherIcon);
                    currentWeatherDisplay.append(weatherParagraph1);
                    currentWeatherDisplay.append(weatherParagraph2);
                    currentWeatherDisplay.append(weatherParagraph3);

                    // Fetch 5-Day forecast and display the 5 cards
                    fetch(fiveDayWeatherURL)
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (data) {

                            // Calculate average of Forecast Data in batches of 8. 40 data entries divided by groups of 8 equals 5 averages
                            function weatherAverage(arr, num, dataExtractor) {
                                var averageForecast = [];

                                // Ensure there are enough elements to form batches
                                if (arr.length >= num) {
                                    // Adjust the loop condition to iterate in batches of 'num'
                                    for (let i = 0; i < arr.length; i = i + num) {
                                        var batch = arr.slice(i, i + num);

                                        // Calculate the average data for the batch
                                        var avg = batch.reduce((sum, day) => sum + dataExtractor(day), 0) / batch.length;

                                        // Round the average to two decimal places
                                        avg = Number(avg.toFixed(2));

                                        averageForecast.push(avg);
                                    }
                                } else {
                                    console.error('Not enough elements in the array to form batches.');
                                }

                                return averageForecast;
                            }

                            var forecastList = data.list;

                            // Extracting 'main.temp' = Average temperatures
                            var tempAverages = weatherAverage(forecastList, 8, (day) => day.main.temp);

                            // Extracting 'wind.speed' = Average wind speeds
                            var windAverages = weatherAverage(forecastList, 8, (day) => day.wind.speed);

                            // Extracting 'main.humidity' = Humidity Averages
                            var humidityAverages = weatherAverage(forecastList, 8, (day) => day.main.humidity);

                            // Loop through data and pull dates
                            var forecastDates = [];
                            var forecastIcons = [];
                            var forecastIconAlt = []

                            for (i = 0; i < forecastList.length; i = i + 8) {
                                var date = forecastList[i].dt_txt;
                                var icon = forecastList[i].weather[0].icon;
                                var alt = forecastList[i].weather[0].main;

                                // Format Date
                                var formattedDate = dayjs(date.substr(0, 10)).format("M/D/YY");
                                forecastDates.push(formattedDate);

                                forecastIcons.push(icon);
                                forecastIconAlt.push(alt)
                            }

                            // Create 5-Day forcast HTML elements
                            for (i = 0; i < 5; i++) {
                                // Create HTML elements
                                var forecastDiv = document.createElement('div');
                                forecastDiv.setAttribute("id", "forecast-div")
                                forecastDiv.classList.add('bg-black', 'bg-gradient', 'text-white', 'p-2', 'col-xl-2', 'col-12' ,'m-2');
                                var forecastH4 = document.createElement('h4');
                                var forecastImg = document.createElement('img');
                                var forecastTempEl = document.createElement('p');
                                var forecastWindEl = document.createElement('p');
                                var forecastHumidityEl = document.createElement('p');

                                // Set text content of each element
                                forecastH4.textContent = forecastDates[i];
                                forecastImg.setAttribute("src", "https://openweathermap.org/img/wn/" + forecastIcons[i] + ".png")
                                forecastImg.setAttribute("alt", forecastIconAlt[i])
                                forecastTempEl.textContent = "Temp: " + tempAverages[i] + "℉";
                                forecastWindEl.textContent = "Wind: " + windAverages[i] + "mph";
                                forecastHumidityEl.textContent = "Humidity: " + humidityAverages[i] + "g/kg";

                                // Append elements to the 5-Day Forecast container
                                forecastDiv.append(forecastH4);
                                forecastDiv.append(forecastImg);
                                forecastDiv.append(forecastTempEl);
                                forecastDiv.append(forecastWindEl);
                                forecastDiv.append(forecastHumidityEl);

                                // Append the forecast container to the screen
                                forecastDetailContainer.append(forecastDiv)
                            }

                            // Append the container to the screen
                            fiveDayForecast.append(forecastDetailContainer);
                        });
                } else {
                    // REMOVE ELEMENTS FIRST
                    currentWeatherDisplay.contents().remove()

                    for (i = 0; i < 5; i++) {
                        $('#forecast-div').remove()
                    }

                    // Remove the no-data class and replace it with "data" class
                    weatherDetailsContainer.removeClass('no-data')
                    weatherDetailsContainer.addClass('data')


                    // Get specific data and store them in the variables below
                    var temp = currentData.main.temp;
                    var wind = currentData.wind.speed;
                    var humidity = currentData.main.humidity;

                    // Create elements to display on screen


                    // Create the HTML elements to be displayed in the PRIMARY weather block
                    var weatherH2 = document.createElement('h2');
                    var currentDateH3 = document.createElement('h3');
                    var currentWeatherIcon = document.createElement('img');
                    var weatherParagraph1 = document.createElement('p');
                    var weatherParagraph2 = document.createElement('p');
                    var weatherParagraph3 = document.createElement('p');

                    var currentDataIcon = currentData.weather[0].icon;
                    var iconAlt = currentData.weather[0].description;

                    // Set the elements' text to be the weather currentData
                    currentWeatherDisplay.css('display', 'block');
                    fiveDayForecast.css('display', 'block');
                    weatherH2.classList.add("mb-4");
                    currentWeatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + currentDataIcon + ".png")
                    currentWeatherIcon.setAttribute("alt", iconAlt)
                    currentWeatherIcon.setAttribute("style", "padding-bottom:10px")
                    weatherH2.textContent = "The current weather in " + currentData.name + ": " + currentData.weather[0].main;
                    currentDateH3.textContent = dayjs().format("dddd, MMM D, YYYY")
                    weatherParagraph1.textContent = "Temp: " + temp + "℉";
                    weatherParagraph2.textContent = "Wind Speed: " + wind + "mph";
                    weatherParagraph3.textContent = "Humidity : " + humidity + "g/kg";

                    // Append the elements to be displayed on screen
                    currentWeatherDisplay.append(weatherH2);
                    currentWeatherDisplay.append(currentDateH3);
                    currentWeatherDisplay.append(currentWeatherIcon);
                    currentWeatherDisplay.append(weatherParagraph1);
                    currentWeatherDisplay.append(weatherParagraph2);
                    currentWeatherDisplay.append(weatherParagraph3);

                    // Fetch 5-Day forecast and display the 5 cards
                    fetch(fiveDayWeatherURL)
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (data) {

                            // Calculate average of Forecast Data in batches of 8. 40 data entries divided by groups of 8 equals 5 averages
                            function weatherAverage(arr, num, dataExtractor) {
                                var averageForecast = [];

                                // Ensure there are enough elements to form batches
                                if (arr.length >= num) {
                                    // Adjust the loop condition to iterate in batches of 'num'
                                    for (let i = 0; i < arr.length; i = i + num) {
                                        var batch = arr.slice(i, i + num);

                                        // Calculate the average data for the batch
                                        var avg = batch.reduce((sum, day) => sum + dataExtractor(day), 0) / batch.length;

                                        // Round the average to two decimal places
                                        avg = Number(avg.toFixed(2));

                                        averageForecast.push(avg);
                                    }
                                } else {
                                    console.error('Not enough elements in the array to form batches.');
                                }

                                return averageForecast;
                            }

                            var forecastList = data.list;

                            // Extracting 'main.temp' = Average temperatures
                            var tempAverages = weatherAverage(forecastList, 8, (day) => day.main.temp);

                            // Extracting 'wind.speed' = Average wind speeds
                            var windAverages = weatherAverage(forecastList, 8, (day) => day.wind.speed);

                            // Extracting 'main.humidity' = Humidity Averages
                            var humidityAverages = weatherAverage(forecastList, 8, (day) => day.main.humidity);

                            // Loop through data and pull dates
                            var forecastDates = [];
                            var forecastIcons = [];
                            var forecastIconAlt = []

                            for (i = 0; i < forecastList.length; i = i + 8) {
                                var date = forecastList[i].dt_txt;
                                var icon = forecastList[i].weather[0].icon;
                                var alt = forecastList[i].weather[0].main;

                                // Format Date
                                var formattedDate = dayjs(date.substr(0, 10)).format("M/D/YY");
                                forecastDates.push(formattedDate);

                                forecastIcons.push(icon);
                                forecastIconAlt.push(alt)
                            }

                            // Create 5-Day forcast HTML elements
                            for (i = 0; i < 5; i++) {
                                // Create HTML elements
                                var forecastDiv = document.createElement('div');
                                forecastDiv.classList.add('bg-black', 'bg-gradient', 'text-white', 'p-2', 'col-xl-2', 'col-12' ,'m-2');
                                forecastDiv.setAttribute("id", "forecast-div")
                                var forecastH4 = document.createElement('h4');
                                var forecastImg = document.createElement('img');
                                var forecastTempEl = document.createElement('p');
                                var forecastWindEl = document.createElement('p');
                                var forecastHumidityEl = document.createElement('p');

                                // Set text content of each element
                                forecastH4.textContent = forecastDates[i];
                                forecastImg.setAttribute("src", "https://openweathermap.org/img/wn/" + forecastIcons[i] + ".png")
                                forecastImg.setAttribute("alt", forecastIconAlt[i])
                                forecastTempEl.textContent = "Temp: " + tempAverages[i] + "℉";
                                forecastWindEl.textContent = "Wind: " + windAverages[i] + "mph";
                                forecastHumidityEl.textContent = "Humidity: " + humidityAverages[i] + "g/kg";

                                // Append elements to the 5-Day Forecast container
                                forecastDiv.append(forecastH4);
                                forecastDiv.append(forecastImg);
                                forecastDiv.append(forecastTempEl);
                                forecastDiv.append(forecastWindEl);
                                forecastDiv.append(forecastHumidityEl);

                                // Append the forecast container to the screen
                                forecastDetailContainer.append(forecastDiv)
                            }

                            // Append the container to the screen
                            fiveDayForecast.append(forecastDetailContainer);
                        });

                }

            } else {
                console.log("No data recieved");
            }
        })

}

// Handle city form submit button on page load
citySearchForm.on('submit', handleFormSubmit);
clearListButton.on('click', clearList)

// Displaying weather data on city button click
cityList.on('click', 'button', function (button) {
    var clickedButtonValue = $(button.target).attr("data-city");

    // API
    locationCoordinates = "https://api.openweathermap.org/geo/1.0/direct?q=" + clickedButtonValue + "&appid=" + APIkey;

    // fetch with locationCoordinates url
    fetch(locationCoordinates)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            latitude = data[0].lat;
            longitude = data[0].lon;
            getWeatherData(latitude, longitude)
        })
})

// Display locally stored cities on page load
displayCities();