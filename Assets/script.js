function createCityList(citySearchList) {
  $("#city-list").empty();

  var keys = Object.keys(citySearchList);
  for (var i = 0; i < keys.length; i++) {
    var cityListEntry = $("<button>");
    cityListEntry.addClass("list-group-item list-group-item-action");

    var splitStr = keys[i].toLowerCase().split(" ");
    for (var j = 0; j < splitStr.length; j++) {
      splitStr[j] =
        splitStr[j].charAt(0).toUpperCase() + splitStr[j].substring(1);
    }
    var titleCasedCity = splitStr.join(" ");
    cityListEntry.text(titleCasedCity);

    $("#city-list").append(cityListEntry);
  }
}

function populateCityWeather(city, citySearchList) {
  createCityList(citySearchList);

  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=f0aec341f964791825b4d29149bf83bc";

  var queryURL2 =
    "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=f0aec341f964791825b4d29149bf83bc";

  var lat;

  var lon;

  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // Store all of the retrieved data inside of an object called "weather"
    .then(function (weather) {
      // Log the queryURL
      console.log(queryURL);

      // Log the resulting object
      console.log(weather);

      var nowMoment = moment();

      var displayMoment = $("<h3>");
      $("#city-name").empty();
      $("#city-name").append(
        displayMoment.text("(" + nowMoment.format("M/D/YYYY") + ")")
      );

      var cityName = $("<h3>").text(weather.name);
      $("#city-name").prepend(cityName);

      var weatherIcon = $("<img>");
      weatherIcon.attr(
        "src",
        "https://openweathermap.org/img/wn/" + weather.weather[0].icon + ".png"
      );
      $("#weather-icon").empty();
      $("#weather-icon").append(weatherIcon);

      // $("#current-temp").text("Temperature: " + weather.main.temp + " °F");
      $("#current-temp").text("Temperature: " + 
      (weather.main.temp - 273.15).toFixed(2) + " " + String.fromCharCode(176) + "C (" +
      ((weather.main.temp - 273.15) * 9/5 + 32).toFixed(2) + " " + String.fromCharCode(176) + "F)");
      $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
      $("#current-wind").text("Wind Speed: " + weather.wind.speed + " MPH");

      lat = weather.coord.lat;
      lon = weather.coord.lon;

      var queryURL3 =
        // "https://api.openweathermap.org/data/2.5/uvi?appid=f0aec341f964791825b4d29149bf83bc" +
        // "&lat=" + lat + "&lon=" + lon;
        "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=f0aec341f964791825b4d29149bf83bc&q=" +
        "&lat=" + lat + "&lon=" + lon;

      $.ajax({
        url: queryURL3,
        method: "GET"
        // Store all of the retrieved data inside of an object called "uvIndex"
      }).then(function (uvIndex) {
        console.log(uvIndex);

        var uvIndexDisplay = $("<button>");
        uvIndexDisplay.addClass("btn btn-danger");

        $("#current-uv").text("UV Index: ");
        $("#current-uv").append(uvIndexDisplay.text(uvIndex[0].value));
        console.log(uvIndex[0].value);

        $.ajax({
          url: queryURL2,
          method: "GET"
          // Store all of the retrieved data inside of an object called "forecast"
        }).then(function (forecast) {
          console.log(queryURL2);

          console.log(forecast);

          for (var i = 6; i < forecast.list.length; i += 8) {
            var forecastDate = $("<h5>");

            var forecastPosition = (i + 2) / 8;

            console.log("#forecast-date" + forecastPosition);

            $("#forecast-date" + forecastPosition).empty();
            $("#forecast-date" + forecastPosition).append(
              forecastDate.text(nowMoment.add(1, "days").format("M/D/YYYY"))
            );

            var forecastIcon = $("<img>");
            forecastIcon.attr(
              "src",
              "https://openweathermap.org/img/wn/" + forecast.list[i].weather[0].icon + ".png"
            );

            $("#forecast-icon" + forecastPosition).empty();
            $("#forecast-icon" + forecastPosition).append(forecastIcon);

            console.log(forecast.list[i].weather[0].icon);
            console.log(forecastIcon);

            // $("#forecast-temp" + forecastPosition).text(
            //   "Temp: " + forecast.list[i].main.temp + " °F"
            // );

            $("#forecast-temp" + forecastPosition).text("Temperature: " + 
            (forecast.list[i].main.temp - 273.15).toFixed(2) + " " + String.fromCharCode(176) + "C (" +
            ((forecast.list[i].main.temp - 273.15) * 9/5 + 32).toFixed(2) + " " + String.fromCharCode(176) + "F)");

            $("#forecast-humidity" + forecastPosition).text(
              "Humidity: " + forecast.list[i].main.humidity + "%"
            );

            $(".forecast").attr(
              "style",
              "background-color:dodgerblue; color:white"
            );
          }
        });
      });
    });
}

$(document).ready(function () {
  var citySearchListStringified = localStorage.getItem("citySearchList");

  var citySearchList = JSON.parse(citySearchListStringified);

  if (citySearchList == null) {
    citySearchList = {};
  }

  createCityList(citySearchList);

  $("#current-weather").hide();
  $("#forecast-weather").hide();



  $("#city-search").on("click", function (event) {
    event.preventDefault();
    var city = $("#city-input")
      .val()
      .trim()
      .toLowerCase();

    if (city != "") {
      citySearchList[city] = true;
      localStorage.setItem("citySearchList", JSON.stringify(citySearchList));

      populateCityWeather(city, citySearchList);

      $("#current-weather").show();
      $("#forecast-weather").show();
    }


  });

  $("#city-list").on("click", "button", function (event) {
    event.preventDefault();
    var city = $(this).text();

    populateCityWeather(city, citySearchList);

    $("#current-weather").show();
    $("#forecast-weather").show();
  });
});