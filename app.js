$(document).ready(function () {

    //Global variables
    var apiKey = "8e623ab0e181b517c6b8e0e96602279c";
    var userInput = "";
    var history = JSON.parse(window.localStorage.getItem("city"));

    // Init functions
    renderHistory(history)


    // Button submit to start
    $("#submitBtn").on("click", function (e) {
        e.preventDefault();
        userInput = $("#textInput").val();

        //API Call to get weather information and rendering it
        $.ajax({
            type: "GET",
            url: `https://api.openweathermap.org/data/2.5/weather?q=${userInput},us&units=imperial&appid=${apiKey}`,
            dataType: "json",
        }).then(function (response) {
            var cityMain = response.name;
            var temp = response.main.temp;
            var hum = response.main.humidity;
            var wind = response.wind.speed;
            var lat = parseInt(response.coord.lat);
            var lon = parseInt(response.coord.lon);
            var date = moment().format('LL');

            console.log(response)

            renderCity(cityMain, date, temp, hum, wind)


            if (history.length > 7) {
                history.splice(0, 1);
                history.push(userInput);
                window.localStorage.setItem("city", JSON.stringify(history));
                renderHistory(history)
            }
            $("#textInput").val("")


            // API Call to get the UV index and display it on screen
            $.ajax({
                type: "GET",
                url: `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`,
                dataType: "json",
            }).then(function (response) {
                var uv = response.value
                console.log(response)

                $("#mainUV").text(uv)
            })

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






                console.log(response)
            })
            $.ajax({
                type: "GET",
                url: `https://api.unsplash.com/search/photos?query=${userInput}&client_id=Elzsl33OBI9SNVw59U94xkqfvIZvqNJhrqwNF8lXvXA`,
                dataType: "json",
            }).then(function (response) {
                $("#bgimg").attr("src", "")
                console.log(response);

                console.log(response.results[0].urls.full);
                $("#result").prepend(`<img src="${response.results[0].urls.thumb}">`)
            })
        })

    })

    $(document).on("click", "li", function () {
        var citySelection = $(this).text()

        $.ajax({
            type: "GET",
            url: `https://api.openweathermap.org/data/2.5/weather?q=${citySelection},us&units=imperial&appid=${apiKey}`,
            dataType: "json",
        }).then(function (response) {
            var cityMain = response.name;
            var temp = response.main.temp;
            var hum = response.main.humidity;
            var wind = response.wind.speed;
            var lat = parseInt(response.coord.lat);
            var lon = parseInt(response.coord.lon);
            var date = moment().format('LL');

            console.log(response)

            renderCity(cityMain, date, temp, hum, wind)


            // API Call to get the UV index and display it on screen
            $.ajax({
                type: "GET",
                url: `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`,
                dataType: "json",
            }).then(function (response) {
                var uv = response.value
                console.log(response)

                $("#mainUV").text(uv)
            })

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


                console.log(response)
            })
            $.ajax({
                type: "GET",
                url: `https://api.unsplash.com/search/photos?query=${citySelection}&client_id=Elzsl33OBI9SNVw59U94xkqfvIZvqNJhrqwNF8lXvXA`,
                dataType: "json",
            }).then(function (response) {
                $("#bgimg").attr("src", "")
                console.log(response);

                console.log(response.results[0].urls.full);
                $("#result").prepend(`<img id="bgimg" src="${response.results[0].urls.thumb}">`)
                // $("main").attr("style", `background-image: url(${response.results[0].urls.regular})
                // ;background-size: 100%;`)
            })
        })


    })

    function renderCity(str1, str2, str3, str4, str5) {
        $("#mainCityName").text(str1 + " - " + str2)
        $("#mainTemp").text("Temperature : " + str3 + " °F")
        $("#mainHum").text("Humidity : " + str4 + " %")
        $("#mainWind").text("Wind Speed : " + str5 + " mph")
    }


    function renderHistory(arr1) {
        $(".list-group").html("");
        arr1 = JSON.parse(window.localStorage.getItem("city"));

        for (i = 0; i < arr1.length; i++) {

            $(".list-group").prepend(`<li class="list-group-item">${arr1[i]}</li>`)
        }

    }

})

