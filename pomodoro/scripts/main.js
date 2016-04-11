var clock = new Pomodoro(update);
clock.setup();

$(".start").click(function() {
  clock.start();
  $(".content").removeClass("flash");
});

$(".pause").click(function() {
  // if(clock.paused){
  //   start();
  // }
  // else {
  //   pause();
  // }
  pause();
});

// Document watched events
// $(document).click(function(){
//   $(".warning").each(function(){
//     $(this).removeClass("warning");
//   });
// });


//reset function
$(".reset").click(function() {
  reset();
});

$(".settings-btn").click(function(evt){
  evt.stopPropagation();
  $(".settings").toggle("slide",{direction: 'right'}, 400);
});

$(".container-fluid").click(function(evt) {
  // console.log(evt.target);
  // if(evt.target == $(".settings-btn")[0]) return;
  if( $(".settings").css("display") !== "none" )
    $(".settings").hide("slide",{direction: 'right'}, 400);

});
$(".close").click(function(evt) {
  $(".settings").toggle("slide",{direction: 'right'}, 400);
})

$("input").change(function(evt){
  if(this.id == "workLength" || this.id == "shortLength" || this.id == "longLength")
    if(this.value < 1) {
      var warningDiv = $("<div class='warning'>Must be 1 or higher!</div>")
      $(this).parent().append(warningDiv);
      warningDiv.click(clearWarnings);
      warningDiv.show("slow");
      this.value = 1;
      setTimeout(function() {
        clearWarnings(warningDiv);
      }, 2000);
    }
});

//Clear any warnings
function clearWarnings(div) {
  if(this.className == "warning")
    div = this;
  $(div).unbind("click", clearWarnings);
  //var that = this;
  $(div).hide("slow").delay(1000);
  setTimeout(function(){
    $(div).remove();
  }, 2000);
}


function update(val){
  if(clock.finished) {
    alarm();
  }

  $(".title").html(clock.currentIntervalType + " : " + clock.workSessions);
  $(".clock").html(val[2]+":"+val[1]+"."+val[0][0]);
}


function alarm(){
  $(".content").addClass("flash");
  $("audio")[0].play();
}

function reset(){
  clock.reset();
  stopAudio();
  $(".content").removeClass("flash");
}

function start(){
  $(".content").removeClass("flash");
  stopAudio();
  clock.start();
}

function pause() {
  $(".content").removeClass("flash");
  stopAudio();
  clock.pause();
}

function stopAudio(){
  $("audio").each(function(){
    this.pause();
    this.currentTime = 0;
  });
}
