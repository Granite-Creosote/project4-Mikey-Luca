// GLOBAL STUFF
const runApp = {};
runApp.apiKey = `AIzaSyBXaDLbvS9m_4euOEdcVxbnybx8D7202C4`;
runApp.apiKeyTwo = `12db71466624332600c66c1d7e474f6d`;
let userlocation;
let locationReturn = {};

//array of blurbs that will be printed to DOM depending on the temperature of userlocation
const blurbArray =  [
    ["Comment One", "Comment Two", "Comment Three"],
    ["Comment Four", "Comment Five", "Comment 6ix"],
    ["Comment Seven", "Comment Eight", "Comment Nine"]
];

// LOCATION FUNCTION & GOOGLE API AJAX CALL
runApp.geocode = function (userlocation) {
    $.ajax({
        url: `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBXaDLbvS9m_4euOEdcVxbnybx8D7202C4`,
        method: "GET",
        dataType: "JSON",
        data: {
            address: userlocation
        }
    }).then((res) => {
        console.log(res);
        // let geoLocation = res.results[0].geometry.location;
        locationReturn.locationName = res.results[0].formatted_address;
        locationReturn.lat = res.results[0].geometry.location.lat;
        locationReturn.lng = res.results[0].geometry.location.lng;
        runApp.weatherInfo(locationReturn.lat, locationReturn.lng);
    });
};

// WEATHER FUNCTION & DARK SKY API AJAX CALL
runApp.weatherInfo = function (res1, res2) {
    $.ajax({
        url: `https://api.darksky.net/forecast/${runApp.apiKeyTwo}/${locationReturn.lat},${locationReturn.lng}`,
        method: "GET",
        dataType: "JSONP",
        data: {
            units: "si"
        }
    }).then((res) => {

        //creating the object that contains out GET request from darksky
        const weatherReturn = {
            icon: res.currently.icon,
            temperature: res.currently.apparentTemperature,
            summary: res.currently.summary,
            humidity: res.currently.humidity,
            windspeed: res.currently.windSpeed, //meters per second

            //requesting the weather forecast
            longIcon: res.hourly.data[2].icon,
            longTemperature: res.hourly.data[2].apparentTemperature,
            longSummary: res.hourly.data[2].summary,
            longHumidity: res.hourly.data[2].humidity,
            longWindspeed: res.hourly.data[2].windSpeed //meters per second
        };

        

        //call function that prints weatherReturn to DOM
        runApp.weatherPrinter(weatherReturn);
        runApp.blurbCondition(weatherReturn.temperature);
        runApp.headingPrinter(locationReturn.locationName);
    });
};

// SUBMIT EVENT LISTENER FOR LOCATION
runApp.listenForSubmit = function(){
    //listen for submit of the form
    $("form").on("submit", function (e) {
        e.preventDefault();
        let userlocation = $("#location").val();
        console.log(userlocation);
        runApp.geocode(userlocation);
        $(".returnedContent").addClass("returnedContentShow");
    });
}

// FUNCTION THAT APPENDS CURRENT WEATHER TO DOM
runApp.weatherPrinter = function (weatherReturn) {
    
    //printing of current weather
    $(".weather").empty();
    $(".longWeather").empty();
    $(".weather").append(`<canvas id="${weatherReturn.icon}" width="80" height="80"></canvas>`);
    $(".weather").append(`<p>Feels Like: ${Math.floor(weatherReturn.temperature)} °C</p>`); //---- used math to round down the temperature
    $(".weather").append(`<p>${weatherReturn.summary}</p>`);
    $(".weather").append(`<p>Humidity: ${Math.floor(weatherReturn.humidity * 100)} %</p>`);
    $(".weather").append(`<p>Wind Speed: ${(weatherReturn.windspeed * 3.6).toFixed(2)} km/h</p>`); // ----- used math to convert m/s into km/h and move decimal point

    //printing of the weather forecast
    $(".longWeather").append(`<canvas id="${weatherReturn.longIcon} 2" width="80" height="80"></canvas>`);
    $(".longWeather").append(`<p>Feels Like: ${Math.floor(weatherReturn.longTemperature)} °C</p>`); // ---- used math to round down the temperature
    $(".longWeather").append(`<p>${weatherReturn.longSummary}</p>`);
    $(".longWeather").append(`<p>Humidity: ${Math.floor(weatherReturn.longHumidity * 100)} %</p>`);
    $(".longWeather").append(`<p>Wind Speed: ${(weatherReturn.longWindspeed * 3.6).toFixed(2)} km/h</p>`); // ----- used math to convert m/s into km/h and move decimal point
    runApp.skyConLoader();
};

// CREATING SKYCONS FUNCTION
runApp.skyConLoader = function(){
    let icons = new Skycons({ "color": "black" });
    icons.set("clear-day", Skycons.CLEAR_DAY);
    icons.set("clear-day 2", Skycons.CLEAR_DAY);
    icons.set("clear-night", Skycons.CLEAR_NIGHT);
    icons.set("clear-night 2", Skycons.CLEAR_NIGHT);
    icons.set("partly-cloudy-day", Skycons.PARTLY_CLOUDY_DAY);
    icons.set("partly-cloudy-day 2", Skycons.PARTLY_CLOUDY_DAY);
    icons.set("partly-cloudy-night", Skycons.PARTLY_CLOUDY_NIGHT);
    icons.set("partly-cloudy-night 2", Skycons.PARTLY_CLOUDY_NIGHT);
    icons.set("cloudy", Skycons.CLOUDY);
    icons.set("cloudy 2", Skycons.CLOUDY);
    icons.set("rain", Skycons.RAIN);
    icons.set("rain 2", Skycons.RAIN);
    icons.set("sleet", Skycons.SLEET);
    icons.set("sleet 2", Skycons.SLEET);
    icons.set("snow", Skycons.SNOW);
    icons.set("snow 2", Skycons.SNOW);
    icons.set("wind", Skycons.WIND);
    icons.set("wind 2", Skycons.WIND);
    icons.set("fog", Skycons.FOG);
    icons.set("fog 2", Skycons.FOG);
    icons.play();
};

// USING GOOGLE AUTOCOMPLETE FUNCTION
runApp.initAutocomplete = (id) => {
    new google.maps.places.Autocomplete(document.getElementById(id));
}

// RUNNING FUNCTIONS - INIT
runApp.init = function(){
    runApp.listenForSubmit();
    runApp.initAutocomplete("location");
    // runApp.geocode();
    // runApp.weatherInfo();
}

// Document function ready. runApp init calling other functions
$(function(){
    runApp.init();
});

runApp.blurbCondition = (temperature) => {
    let finalBlurb;
    console.log(finalBlurb);
    if (temperature < 0) {
        finalBlurb = (blurbArray[0][Math.floor(Math.random()
            * blurbArray.length)]);
    } else if (temperature < 12) {
        finalBlurb = (blurbArray[1][Math.floor(Math.random()
            * blurbArray.length)]);
    } else {
        finalBlurb = (blurbArray[2][Math.floor(Math.random()
            * blurbArray.length)]);
    }
    console.log(finalBlurb);
    // this where we would append said Var to DOM 
    runApp.blurbPrinter(finalBlurb);
};

runApp.headingPrinter = (location) => {
    $("#locationHeading").html(`${location}`);
}





runApp.blurbPrinter = (blurb) => {
    $(".blurb").empty();
    $('.blurb').append(`${blurb}`);

};


runApp.switchermadinger = () => {
    $(".switch").on("click", function(e){
        $(".longWeather").toggleClass("open");
        $(".weather").toggleClass("close");
    });
}

runApp.switchermadinger();







