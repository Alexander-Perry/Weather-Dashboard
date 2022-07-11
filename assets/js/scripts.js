

// getGeoCode function
// args: city - from inputbox
// runs getWeather function on success
// saveLocal with the city name listed in the response
function getGeoCode(city) {
    const apiURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=1b06c75812b8caa0f23e09c99756195a";
    fetch(apiURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    // Alert and exit function if city not found
                    if (data.length == 0) {
                        alert("City: '" + city + "' not found");
                        return;
                    };
                    let lat = data[0].lat;
                    let lon = data[0].lon;
                    // Run getWeather function
                    $("#current_city").html(data[0].name);
                    saveLocal(data[0].name);
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
    fetch(apiURL)
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    // Current Weather
                    $("#current_city").append(moment.unix(data.current.dt).format(" (DD/MM/YYYY)") + '<img src="https://openweathermap.org/img/wn/' + data.current.weather[0].icon + '.png" alt="current weather icon" />')
                    $("#current_temp").html(data.current.temp);
                    $("#current_wind").html(data.current.wind_speed);
                    $("#current_humidity").html(data.current.humidity);
                    $("#current_UV").html(data.current.uvi);
                    switch (true) {
                        case (data.current.uvi <= 2):
                            $("#current_UV").removeClass("bg-warning bg-danger").addClass("bg-success");
                            break;
                        case (data.current.uvi >= 2 && data.current.uvi < 6):
                            $("#current_UV").removeClass("bg-danger bg-success").addClass("bg-warning");
                            break;
                        case (data.current.uvi >= 6):
                            $("#current_UV").removeClass("bg-success bg-warning").addClass("bg-danger");
                            break;
                    };

                    // 5 Day forecast
                    // date, icon, temp, wind, humidity, 
                    $(".day").each(function (index) {
                        let icon = data.daily[index + 1].weather[0].icon;
                        $(this).html(
                            "<h4 class='my-2'>" + moment.unix(data.daily[index + 1].dt).format("DD/MM/YYYY") + "</h4>" +
                            '<img src="https://openweathermap.org/img/wn/' + icon + '.png" alt = "weather icon" />' +
                            "<div class='my-2'>Temp: " + data.daily[index + 1].temp.day + "°C</div>" +
                            "<div class='my-2'>Wind: " + data.daily[index + 1].wind_speed + "km/h</div>" +
                            "<div class='my-2'>Humidity: " + data.daily[index + 1].humidity + "%</div>"
                        );
                    })
                })
            } else alert("Error getting weather data");
        })
};

// save to local storage function 
// Checks if the city exists in the localhistory already. Adds if not and then reloads the front-end data. 
function saveLocal(city) {
    const loadHistory = localStorage.getItem("Weather-Dashboard");
    // check to see if a localstorage item exists for 'weather-dashboard'
    if (loadHistory != null) {
        let searchHistory = JSON.parse(loadHistory);
        // If 'city' doesn't exist in the localStorage, add it. 
        if (!searchHistory.includes(city)) {
            searchHistory.push(city);
            localStorage.setItem("Weather-Dashboard", JSON.stringify(searchHistory));
        };
    } else {
        let searchHistory = [city];
        localStorage.setItem("Weather-Dashboard", JSON.stringify(searchHistory));
    };
    loadLocal(); // reload the search history in the front-end
};

// load from local storage and update front-end
function loadLocal() {
    const loadHistory = localStorage.getItem("Weather-Dashboard");
    if (loadHistory != null) {
        let searchHistory = JSON.parse(loadHistory);
        $("#searchHistory").html(""); //Blank the existing history
        $.each(searchHistory, function (index, value) {
            $("#searchHistory").append("<button class='btn btn-secondary col-12'>" + value + "</button>");
        });
        // Load the button click events for the generated buttons
        $("#searchHistory button").click(function (event) {
            const city = $(this).text();
            getGeoCode(city);
        });
    };
};

//Search button handler.
$("#btnSearch").on("click", function () {
    const city = $("#cityInput").val();
    if (city == "") {
        alert('Please enter a city to search');
        return;
    };
    // run geocode function => weather function
    getGeoCode(city);
});

// Clear the localstorage/search history
$("#clearHistory").on("click", function () {
    if (confirm("Are you sure you want to clear the history?")) {
        localStorage.removeItem("Weather-Dashboard");
        $("#searchHistory").html("");
    };
});
// run the localstorage load on page-load
loadLocal();
