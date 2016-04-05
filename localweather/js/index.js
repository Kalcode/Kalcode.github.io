$(document).ready(function() {

  getWeather();

  $(".convert").click(function() {
    if (temp === "??")
      return;
    if ($(this).text() == "Celcius") {
      setTemp("C");
      $(this).text("Fahrenheit");
    } else {
      setTemp("F");
      $(this).text("Celcius");
    }

  });
  
  //process zipcode to get data
  $("button.zipcode").click(function(){
    var zipcode = $("input.zipcode").val().trim();
    if(!zipcode ||zipcode == old_zipcode)
      return;
    if (zipcode.length != 5 || zipcode.replace(/\d+/g, "").length > 0) {
      $(".city").text("Please Enter 5 Digit Valid Zipcode");
      $("input.zipcode").val("");
      return;
    }
    old_zipcode = zipcode;
    getWeather(zipcode);
  });
  
  //Click button on enter
  $('input.zipcode').keypress(function (e) {
     var key = e.which;
     if (key == 13) 
     {
       $('button.zipcode').click();
       return false;
     }
   });

});

var temp = "??";
var hitemp = "??";
var lowtemp = "??";
var old_zipcode;

function getWeather(zipcode) {
  var lat;
  var long;

  var url = "http://api.openweathermap.org/data/2.5/weather?";
  var units = "&units=imperial";
  var appid = "&APPID=5a78f1e8f5592e6c7ef38fa50f21c65b";
  if (navigator.geolocation && !zipcode) {
    navigator.geolocation.getCurrentPosition(function(position) {
      $(".lat").text(Math.floor(position.coords.latitude));
      $(".lon").text(Math.floor(position.coords.longitude));

      lat = position.coords.latitude;
      long = position.coords.longitude;
      
      var latUrl = "lat=" + lat;
      var longUrl = "&lon=" + long;
      

      url += latUrl + longUrl + units + appid;
      //console.log(url);
      getWeatherData(url);
    });
  }
  else if (zipcode) {
    url += "zip="+zipcode+",us&"+ units + appid;
    $(".coords").text("Zipcode: " + zipcode);
    getWeatherData(url);
  }

}

function setTemp(unit = "") {
  if (unit === "C") {
    temp = convertF(temp);
    hitemp = convertF(hitemp);
    lowtemp = convertF(lowtemp);
  } else if (unit === "F") {
    temp = convertC(temp);
    hitemp = convertC(hitemp);
    lowtemp = convertC(lowtemp);
  } else {
    unit = "F"
  }
  $(".temp").text(temp + "\u00B0" + unit);
  $(".hi").text(hitemp + "\u00B0" + unit);
  $(".low").text(lowtemp + "\u00B0" + unit);

}

function convertF(temp) {
  return Math.round(((temp - 32) * 5) / 9);
}

function convertC(temp) {
  return Math.round((temp * 9) / 5 + 32);
}

function getWeatherData(url) {
  $.get(url, function(data) {
    //console.log(data)
    //$.each(data, function(key, value){
    //  console.log(key+" : "+value);
    //});
    var name = data.name;
    temp = Math.round(data.main.temp);
    hitemp = Math.round(data.main.temp_max);
    lowtemp = Math.round(data.main.temp_min);
    var description = data.weather[0].description;
    var weather = data.weather[0].main.toLowerCase();
    //console.log(weather);
    if (!name) {
      name = "--";
    }

    setTemp();

    $(".city").text(name);
    $(".weather").text(description);

    $("#weather").removeClass();
    switch (weather) {
      case "clear":
        $("#weather").addClass("icon sunny");
        break;
      case "drizzle":
      case "rain":
        $("#weather").addClass("icon rainy");
        break;
      case "extreme":
      case "thunderstorm":
        $("#weather").addClass("icon thunder");
        break;
      case "snow":
        $("#weather").addClass("icon snow");
        break;
      case "clouds":
        $("#weather").addClass("icon partial");
        break;
      default:
        $("#weather").addClass("icon");
    }

  });

}