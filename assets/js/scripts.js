

// Button triggers
// geolocation of city entered
// fetch to pull data
// sort data by current and 5 day forecast
//
// current
// city, current date - Icon
// temp. wind, humidity, uv index
// forecast
// date, icon, temp, wind, humidity

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
                    console.log("from fetch", lat);
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
// returns something
function getWeather(lat, lon) {
    const apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,alerts&units=metric&appid=1b06c75812b8caa0f23e09c99756195a";
    console.log('getweather', lat, lon);
}

getGeoCode("sydney")