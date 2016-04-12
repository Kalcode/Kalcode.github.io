
// Global Variables
var flashing = false;

// Setup
var clock = new Pomodoro(update);
clock.setup();


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


// Button's functions
function reset(){
  clock.reset();
  stopAudio();
  $(".content").removeClass("flash");
  showNotice(false);
}
function start(){
  $(".content").removeClass("flash");
  stopAudio();
  if(clock.paused && clock.currentTime == 0)
    showNotice(false);
  clock.start();
}
function pause() {
  $(".content").removeClass("flash");
  stopAudio();
  clock.pause();
}

// Prevent settings panel from closing if interacting with timer buttons
$(".timer-buttons").click(function(evt){
  evt.stopPropagation();
});
//Open settings panel
$(".settings-btn").click(function(evt){
  evt.stopPropagation();
  $(".settings").toggle("slide",{direction: 'right'}, 400);
});
//close settings panel clicking outside it
$(".container-fluid").click(function(evt) {
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
  var intervalType = titleCase(clock.currentIntervalType);
  var displayTime = val[2]+":"+val[1];
  $(".title").html(intervalType + " : " + clock.workSessions);
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
      return;
      break;
    case "mute":
      $("audio").each(function() {
        if($("#mute")[0].checked)
          this.muted = true;
        else
          this.muted = false;
      });
      return;
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
  if(clock.paused && clock.currentTime === 0){
    clock.setup(clock.currentIntervalType);
    pause();
    showNotice(false);
  }
  else {
    showNotice(true);
  }

}


//Fired when timer finishes
function alarm(){
  $(".content").addClass("flash");
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
