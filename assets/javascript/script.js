var APIkey = "d706a8baa5538ab15ced6f4891dbff96";
var city;
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;

fetch(queryURL);
