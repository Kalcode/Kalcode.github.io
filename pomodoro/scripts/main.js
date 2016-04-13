
// Global Variables
var flashing = false;
var timeHand = "";
var intervalType = "Work";
var currentInterval = 1;
var workIntervals;
var workLength;
var shortLength;
var longLength;
var volume;
var mute;
var currentTheme;



// Setup
var clock = new Pomodoro(update);
clock.setup();
clockHand("reset");
displayIntervalType(true);
fetchCookies();
setup();

// Buttons on timer
$(".start").click(function() {
  start();
});
$(".pause").click(function() {
  pause();
});
$(".reset").click(function() {
  reset();
});


function devMode(){
  workIntervals = 4;
  workLength = .05;
  shortLength = .025;
  longLength = .1;
  volume = 1;
  mute = false;
  currentTheme = "tomato";
  setup();
}


function setup() {
  changeTheme(currentTheme);
  var settings = [];
  settings.push($("#workLength").val(workLength));
  settings.push($("#shortLength").val(shortLength));
  settings.push($("#longLength").val(longLength));
  settings.push($("#mute").prop("checked", mute));
  settings.push($("#volume").val(volume));
  settings.push($("#workIntervals").val(workIntervals));
  for (var index in settings) {
    updatedSettings(settings[index][0]);
  }
  clock.setup();
  clockHand("reset");
  displayIntervalType(true);
}

// Delete Cookies
function deleteCookies() {
  var cookies = ["workLength", "shortLength",, "longLength", "mute", "volume", "workIntervals", "theme" ];
  for (var index in cookies) {
    Cookies.remove(cookies[index]);
  }
}

// Fetch cookies
function fetchCookies() {
  workIntervals = Cookies.get("workIntervals")? Cookies.get("workIntervals") : 4;
  workLength = Cookies.get("workLength")? Cookies.get("workLength") : 25;
  shortLength = Cookies.get("shortLength")? Cookies.get("shortLength") : 5;
  longLength = Cookies.get("longLength")? Cookies.get("longLength") : 15;
  volume = Cookies.get("volume")? Cookies.get("volume") : 1;
  mute = Cookies.get("mute")? Cookies.get("mute") : false;
  mute = mute === "true" ? true : false;
  currentTheme = Cookies.get("theme")? Cookies.get("theme") : "tomato";
}

// Button's functions
function reset(){
  clock.reset();
  stopAudio();
  alarm("stop");
  showNotice(false);
  clockHand("reset");
}
function start(){
  alarm("stop");
  stopAudio();
  if(clock.paused && clock.currentTime == 0) {
    showNotice(false);
  }
  if(clock.paused) {
    clock.start();
    clockHand("play");
  }
}
function pause() {
  alarm("stop");
  stopAudio();
  if(!clock.paused) {
    clock.pause();
    clockHand("pause");
  }
}

// Prevent settings panel from closing if interacting with timer buttons
$(".cbtn").click(function(evt){
  evt.stopPropagation();
});
//Open settings panel
$(".settings-btn").click(function(evt){
  evt.stopPropagation();
  $(".settings").toggle("slide",{direction: 'right'}, 400);
});
//close settings panel clicking outside it
$(document).click(function(evt) {
  if( $(".settings").css("display") !== "none" )
    $(".settings").hide("slide",{direction: 'right'}, 400);
});
//close button in panel
$(".close").click(function(evt) {
  $(".settings").toggle("slide",{direction: 'right'}, 400);
})

//If input chanes, check values and update settings
$("input").change(function(evt){
  if(this.id == "workLength" || this.id == "shortLength" || this.id ==
   "longLength" || this.id == "workIntervals") {
    if(this.value < 1) {
      this.value = 1;
      setAlert("Must be 1 or higher!", $(this).parent() );
    }
    else if(this.value > 9999)
    {
      this.value = 9999;
      setAlert("Must be lower than 9999", $(this).parent() );
    }
  }
  //Call update settings and pass new settings to clock
  updatedSettings(this);
});

$(".theme-btn").click(function(){
  var theme = this.innerText.toLocaleLowerCase();
  changeTheme(theme);
});



// Reset settings to default
$(".default").click(function(){
  changeTheme("tomato");
  deleteCookies();
  fetchCookies();
  setup();
  showNotice(false);
});



// Set a warning/alert
function setAlert(msg ,div) {
  div = $(div);
  var warningDiv = $("<div class='warning'>"+msg+"</div>");
  warningDiv.click(clearWarnings);
  div.append(warningDiv);
  warningDiv.show("fade");
  setTimeout(function() {
   clearWarnings(warningDiv);
  }, 2000);
  return warningDiv;
}


//Clear any warnings
function clearWarnings(div) {
  if(this.className == "warning")
    div = this;
  $(div).unbind("click", clearWarnings);
  //var that = this;
  $(div).hide("fade").delay(2000);
  setTimeout(function(){
    $(div).remove();
  }, 2000);
}

//Update the display of the clock
function update(val){
  if(clock.finished) {
    alarm();
  }
  if(clock.currentTime == 0 && clock.paused) {
      clockHand("reset");
  }
  var tempintervalType = titleCase(clock.currentIntervalType);
  if(tempintervalType !== intervalType) {
    var tempIntervals = clock.workSessions+1;
    intervalType = tempintervalType;
    if(currentInterval !== tempIntervals && intervalType === "Work") {
      currentInterval = tempIntervals;
      displayIntervalType(true);
    }
    else {
      displayIntervalType();
    }


  }
  var displayTime = val[2]+":"+val[1];
  $(".clock-display").html(displayTime+"."+val[0][0]);
  document.title = intervalType+":"+displayTime;
}

//Setting Change notification
function showNotice(bool) {
  if(bool){
    $("#updatedSettings").show("fade", 1000);
  }
  else
    $("#updatedSettings").hide("fade", 1000);
}

//Update Values from setting panel
function updatedSettings(input) {
  var prop = input.id;
  var val = Number(input.value);
  switch (prop) {
    case "volume":
      $("audio").each(function() {
        this.volume = val;
      });

      break;
    case "mute":
      $("audio").each(function() {
        if($("#mute")[0].checked)
          this.muted = true;
        else
          this.muted = false;
      });
      val = $("#mute")[0].checked;
      break;
    case "workLength":
      clock.setWorkLength(val);
      break;
    case "shortLength":
      clock.setBreakLength(val);
      break;
    case "longLength":
      clock.setLongBreakLength(val);
      break;
    case "workIntervals":
      clock.workIntervals = val;
      break;
    default:

  }
  //show notice that settings won't have immediate effect
  var skip = !(prop === "mute" || prop === "volume")
  if( skip && clock.paused && clock.currentTime === 0){
    clock.setup(clock.currentIntervalType);
    pause();
    showNotice(false);
  }
  else if(skip) {
    showNotice(true);
  }
  Cookies.set(prop, val);

}


// Change Theme
function changeTheme(theme){
  $(".clock-face").removeClass(currentTheme);
  $(".clock-display").removeClass(currentTheme);
  currentTheme = theme;
  $(".clock-face").addClass(currentTheme);
  $(".clock-display").addClass(currentTheme);

  Cookies.set("theme", currentTheme);
}


//Fired when timer finishes
function alarm(condtion){
  if (condtion == "stop") {
      $(".clock-face").removeClass("flash");
      return;
  }
  $(".clock-face").addClass("flash");
  $("audio")[0].play();
  flashing = true;
  flashTitle();
}
//Stop all audio
function stopAudio(){
  $("audio").each(function(){
    this.pause();
    this.currentTime = 0;
  });
  flashing = false;
}


// Change string to capitalize each word
function titleCase(string){
  var strArray = string.split(" ");
  var results = [];
  for (var index in strArray){
    var capWord = strArray[index][0].toUpperCase() +
    strArray[index].slice(1, strArray[index].length);
    results.push(capWord);
  }
  return results.join(" ");
}

// Flashing title
function flashTitle() {
    if(flashing){
      document.title = "Time's Up";
      setTimeout(function(){
        if(!flashing) return;
        document.title = "0:00";
        setTimeout(function(){
          if(!flashing) return;
          flashTitle();
        },500);
      },500);
    }
    else {

    }
}


//Clock face animation
function clockHand(state){
  var hand = $(".clock-hand");
  var currentState = hand.css("animation-play-state");
  if(state == "pause") {
    hand.css("animation-play-state", "paused");
  }
  else if(state == "play") {
    hand.css("animation-play-state", "running");
  }
  else if(state == "reset") {
    var newTime = clock.currentInterval/1000 + "s";
    hand.removeClass("hand-animation").animate({"nothing":null}, 1, function(){
      $(this).addClass("hand-animation");
    });
    hand.css("animation-duration", newTime);
    hand.css("animation-play-state", "paused");
  }

}

function displayIntervalType(intervals) {
  if(intervals)
    $(".interval-count").addClass("interval-type-scroll");
  $(".interval-type").addClass("interval-type-scroll");
  setTimeout(function(){
    $(".interval-type").text(intervalType);
    $(".interval-count").text(currentInterval);
    setTimeout(function(){
      $(".interval-type").removeClass("interval-type-scroll");
      $(".interval-count").removeClass("interval-type-scroll");
    },500);
  },500);
}
