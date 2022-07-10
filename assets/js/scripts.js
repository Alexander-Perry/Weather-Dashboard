

// Button triggers
// geolocation of city entered
// fetch to pull data
// sort data by current and 5 day forecast
//


// getGeoCode function
// args: city
// runs getWeather function on success
function getGeoCode(city) {
    const apiURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=1b06c75812b8caa0f23e09c99756195a";
    fetch(apiURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    let lat = data[0].lat;
                    let lon = data[0].lon;
                    // Run getWeather function
                    console.log("geocode")
                    console.log(data);
                    $(current_city).html(data[0].name);
                    getWeather(lat, lon);
                });
            } else {
                alert("City not found");
                return;
            };
        });
};

// getWeather function
// args: lat, lon
// Updates Current weather HTML, and 5 day average. 
// Forecast: index[0] is current day
function getWeather(lat, lon) {
    const apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=metric&appid=1b06c75812b8caa0f23e09c99756195a";
    console.log('getweather', lat, lon);
    fetch(apiURL)
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    // Current Weather
                    $(current_city).append('<img src="http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '.png" alt="current weather icon" />')
                    $(current_temp).html('Temp: ' + data.current.temp + "°C");
                    $(current_wind).html('Wind: ' + data.current.wind_speed + 'kph');
                    $(current_humidity).html('Humidity: ' + data.current.humidity + '%');
                    $(current_UV).html('UV Index: '+ data.current.uvi);
                    console.log("weatherdata");
                    console.log(data);

                    // 5 Day forecast
                    // date, icon, temp, wind, humidity, 
                    $(".day").each(function (index) {
                        console.log(index);
                        console.log(data.daily[index + 1].dt);
                        let icon = data.daily[index + 1].weather[0].icon;
                        $(this).html(
                            "<ul><li><h4>" + moment.unix(data.daily[index + 1].dt).format("DD/MM/YYYY") + "</h4></li>" +
                            '<li><img src="http://openweathermap.org/img/wn/' + icon + '.png" alt = "weather icon" /></li>' +
                            "<li>Temp: " + data.daily[index + 1].temp.day + "°C</li>" +
                            "<li>Wind: " + data.daily[index + 1].wind_speed + "kph</li>" +
                            "<li>Humidity: " + data.daily[index + 1].humidity + "%</li></ul>"
                        );
                    })
                })
            } else alert("Error getting weather data");
    })
};

//Search button handler.
$("#btnSearch").on("click", function () {
    const city = $("#cityInput").val();
    console.log(city);
    //save to local storage
    saveLocal(city);
    // run geocode function => weather function
    getGeoCode(city);
});

function saveLocal() {
    //funtion data here
}

function loadLocal() {
 //funtion data here
}