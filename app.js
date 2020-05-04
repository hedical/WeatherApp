$(document).ready(function () {

    //Global variables
    var apiKey = "8e623ab0e181b517c6b8e0e96602279c";
    var userInput = "";
    var history = JSON.parse(window.localStorage.getItem("city")) || [];

    // Init functions
    renderHistory(history)
    $("main").hide()

    //Button start find my weather on landing page
    $("#findMyWeather").on("click", function (e) {
        e.preventDefault();
        $("#start").hide()
        $("main").show()

        userInput = $("#firstTextInput").val();
        apiCalls(userInput).then(function () {
            if (history.length > 7) {
                history.splice(0, 1)
            }
            history.push(userInput);
            window.localStorage.setItem("city", JSON.stringify(history));
            renderHistory(history)
            $("#textInput").val("")
        })
    })

    // Button submit to start a new search
    $("#submitBtn").on("click", function (e) {

        e.preventDefault();
        userInput = $("#textInput").val();


        apiCalls(userInput).then(function () {
            if (history.length > 7) {
                history.splice(0, 1)
            }
            history.push(userInput);
            window.localStorage.setItem("city", JSON.stringify(history));
            renderHistory(history)
            $("#textInput").val("")
        })
    })

    // Button on last search items
    $(document).on("click", "li", function () {
        var citySelection = $(this).text()

        apiCalls(citySelection)

    })

    // Function to render information on the city researched
    function renderCity(str1, str2, str3, str4, str5) {
        $("#mainCityName").text(str1 + " - " + str2)
        $("#mainTemp").text("Temperature : " + str3 + " °F")
        $("#mainHum").text("Humidity : " + str4 + " %")
        $("#mainWind").text("Wind Speed : " + str5 + " mph")
    }


    // Function to render the last search on the side
    function renderHistory(arr1) {
        if (!arr1) {
            return;
        }
        $(".list-group").html("");

        for (i = 0; i < arr1.length; i++) {

            $(".list-group").prepend(`<li class="btn list-group-item mb-2" style="opacity:85%">${arr1[i]}</li>`)

        }
    }
    // Function containing all API calls
    function apiCalls(str1) {

        // Call Open weather, weather info
        return $.ajax({ // Return to handle a 404
            type: "GET",
            url: `https://api.openweathermap.org/data/2.5/weather?q=${str1},us&units=imperial&appid=${apiKey}`,
            dataType: "json",
        }).then(function (response) {
            var cityMain = response.name;
            var temp = response.main.temp;
            var hum = response.main.humidity;
            var wind = response.wind.speed;
            var lat = parseInt(response.coord.lat);
            var lon = parseInt(response.coord.lon);
            var date = moment().format('LL');


            renderCity(cityMain, date, temp, hum, wind)


            // API Call to get the UV index and display it on screen
            $.ajax({
                type: "GET",
                url: `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`,
                dataType: "json",
            }).then(function (response) {
                var uv = response.value

                $("#mainUV").text(uv)
            })

            // API Call to get the forecast and display it on screen
            $.ajax({
                type: "GET",
                url: `https://api.openweathermap.org/data/2.5/forecast/?q=${cityMain}&cnt=5&units=imperial&appid=${apiKey}`,
                dataType: "json",
            }).then(function (response) {

                $("#forecast").html("");
                for (i = 0; i < response.list.length; i++) {
                    $("#forecast").append(`
                    <div class="card col-2 mt-2 ml-4 mb-0">
                        <div class="card-body">
                            <h6 class="card-title">${moment.unix(response.list[i].dt)}</h6>
                            <img alt="overcast clouds" src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}.png" width="50" height="50">
                            <p class="card-text">${response.list[i].main.temp} °F</p>
                            <p class="card-text">${response.list[i].main.humidity} %</p>
                        </div>
                    </div>
                    `)
                }

                // API Call to get the picture and display it on screen
            })
            $.ajax({
                type: "GET",
                url: `https://api.unsplash.com/search/photos?query=${str1}&client_id=Elzsl33OBI9SNVw59U94xkqfvIZvqNJhrqwNF8lXvXA`,
                dataType: "json",
            }).then(function (response) {
                $("#bgimg").attr("src", "")

                $("body").attr("style", `background-image: url(${response.results[0].urls.full})
                ;background-size: 100%; background-repeat: no-repeat;`)
            })
        })

    }
})

