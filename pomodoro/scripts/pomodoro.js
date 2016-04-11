//Object Pomodoro Timer
function Pomodoro(func){
  //Time tracking variables
  this.lastTime = 0;
  this.currentTime = 0;
  this.paused = true;
  this.timerID = null;
  this.finished = false;
  this.workIntervals = 4;
  this.workSessions = 0;


  //function to call to return time
  this.displayFunc = func;

  //variables for timers lengths
  this.workLength = 25*60*1000;

  this.intervalType = {
      "work" : .05*60*1000,
      "short" : .025*60*1000,
      "long" : .1*60*1000,
  }

  //variables for current set time lengths
  this.currentInterval;
  this.currentIntervalType;
  this.defaultIntervalType = "work";

  //getters and setters
  this.getWorkLength = function(){
    return this.intervalType.work/1000/60;
  }
  this.setWorkLength = function(val){
    this.intervalType.work = val*60*1000;

  }
  this.getBreakLength = function(){
    return this.intervalType.short/1000/60;
  }
  this.setBreakLength = function(val){
    this.intervalType.short = val*60*1000;
  }
  this.getLongBreakLength = function(){
    return this.intervalType.long/1000/60;
  }
  this.setLongBreakLength = function(val){
    this.intervalType.long = val*60*1000;
  }


}
Pomodoro.format = function(time) {
  var milliseconds = String(time%1000);
  var seconds = String(((time - milliseconds) / 1000) % 60);
  var minutes =  String(Math.floor(time/1000/60));
  milliseconds = ("000" + milliseconds).slice(-3);
  seconds = ("00" + seconds).slice(-2);
  var temp = [milliseconds, seconds, minutes]

  return temp;
}

Pomodoro.prototype.pause = function () {
    this.update();
    this.paused = true;
    clearInterval(this.timerID);
};

Pomodoro.prototype.reset = function (type) {
    this.pause();
    this.setup(type);
    this.update();
};
Pomodoro.prototype.nextInterval = function () {
  if(this.currentIntervalType == "work"){
    this.workSessions += 1;
    if(this.workSessions === this.workIntervals) {
      this.workSessions = 0;
      return "long";
    }
    else
      return  "short";
  }
  else {
    return "work";
  }
};


Pomodoro.prototype.update = function () {
  var time = Date.now();
  if(this.paused)
    this.lastTime = time;

  this.currentTime += (time - this.lastTime);

  if(this.displayFunc){
    var format = Pomodoro.format(this.currentInterval - this.currentTime);
    this.displayFunc(format);
  }
  this.lastTime = time;

  if(!this.paused && this.currentTime >= this.currentInterval){
    this.paused = true;
    this.finished = true;
    this.reset(this.nextInterval());
    this.displayFunc(Pomodoro.format(0));
  }
};

Pomodoro.prototype.start = function () {
  this.finished = false;
  this.paused = false;
  this.lastTime = Date.now();
  this.update();
  var that = this;
  this.timerID = setInterval(function(){
    that.update();
  }, 100);
};

Pomodoro.prototype.setup = function(type) {
  if(!type) {
     type = this.defaultIntervalType;
     this.workSessions = 0;
   }
  this.currentInterval = this.intervalType[type];
  this.currentIntervalType = type;
  this.currentTime = 0;
  this.paused = true;
  this.finished = false;
  this.update();
}
