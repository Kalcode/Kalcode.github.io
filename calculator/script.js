// Calculator
function Calculator() {
  this.power = true;
  this.memory = 0;

  this.operation = "";
  this.lastOperation = "";

  this.operating = false;
  this.newInput = false;

  this.current = 0;
  this.buffer = 0;
  this.display = 0;
}
//set current buffer and clearNewinput
Calculator.prototype.setCurrent = function(value) {
  if(typeof(value) != "number"){
    value = Number(value)
    if(isNaN(value)) value = 0;
  }
  if(this.newInput){
    this.newInput = false;
    if(this.operation)
      this.operating = true;
    if(this.lastOperation)
      this.lastOperation = "";
  }
  this.current = value;
  this.display = this.current;
};

Calculator.prototype.setMemory = function(type) {
  if (type === "add")
    this.memory += this.current;
  else
    this.memory -= this.current;

  this.newInput = true;
};

Calculator.prototype.clearMemory = function() {
  this.memory = 0;
};

Calculator.prototype.recallMemory = function () {
  this.setCurrent(this.memory)
  this.newInput = true;
};

Calculator.prototype.setOperation = function(sign) {
  if(!this.operating & !this.operation) {
    this.buffer = this.current;
    this.current = 0;
    this.display = this.buffer;
  }
  else if (this.operating && this.buffer && this.operation) {
    this.evauluate();
    this.setOperation(sign);
    this.display = this.buffer;
  }
  this.operation = sign;
  this.newInput = true;
};

Calculator.prototype.sqrt = function() {
  this.current = Math.sqrt(this.current)
  this.setCurrent(this.current);
  this.newInput = true;
}

Calculator.prototype.negate = function () {
  if(this.operation && !this.operating)
  {
    this.buffer = this.buffer * -1;
    this.display = this.buffer;
  }
  else {
    this.current = this.current * -1;
    this.display = this.current;
  }
};

Calculator.prototype.percent = function () {
    this.current = this.buffer * (this.current/100);
    this.setCurrent(this.current);
};

Calculator.prototype.evauluate = function() {
  if(this.operation !="" & this.operating)
    this.lastOperation = this.operation + this.current;
  this.current = eval(this.buffer + this.operation + "(" +this.current + ")");
  this.operating = false;
  this.operation = "";
  this.buffer = 0;
  this.newInput = true;

};

Calculator.prototype.equals = function() {
  if(this.operation && this.operating){
    this.evauluate();
  }
  else if(this.operation && !this.operating){
    this.current = this.buffer;
    this.lastOperation = this.operation+this.buffer;
    this.evauluate();
  }
  else if(this.lastOperation) {
    this.buffer = this.current;
    var length = this.lastOperation.length;
    this.operation = this.lastOperation[0];
    this.current = this.lastOperation.slice(1,length);
    this.evauluate();
  }
  this.operation = "";
  this.operating = false;
  this.display = this.current;
};

Calculator.prototype.clear = function(all = false) {
  this.current = 0;
  this.display = 0;
  this.buffer = 0;
  this.operation = "";
  this.lastOperation = "";
  this.newInput = false;
  this.operating = false;
  if (all){
    this.memory = 0;
  }


};

Calculator.prototype.clearEntry = function () {
  if(!this.operation && this.newInput){
    this.clear();
    return;
  }

  this.operation = "";
  if(this.newInput && !this.operating)
    this.operating = true;
  this.setCurrent(0);
  this.newInput = true;

};


var digits = ["1","2","3","4","5","6","7","8","9","0", "."];


//buttons
function button() {
  var input = $(this).text();
  if(input === "\u2022")
  {
    if (lcd.text().indexOf(".") > -1 && !calc.newInput)
      return;
    else
      input = ".";
  }

  if (input == "OFF" || lcd.css("display") == "none"){
    if(input == "CON") {
      lcd.show();
    }
    else {
      calc.clear(true);
      lcd.hide();
      display("0");
      return;
    }
  }



  if(digits.indexOf(input) > -1){
      if(!calc.newInput && lcd.text().length > 13 ) {
        return;
      }
      var append = calc.newInput === true ? false : true;
      display(input, append);

      //pass current numbers to calculator
      calc.setCurrent(lcd.text());
  }
  else {
    switch(input){
      case "Debug":
        break;
      case "CE":
        calc.clearEntry();
        break;
      case "CON":
        calc.clear();
        break;
      case "MC":
        calc.clearMemory()
        break;
      case "MR":
        calc.recallMemory();
        break;
      case "M+":
        calc.setMemory("add");
        break;
      case "M-":
        calc.setMemory("minus");
        break;
      case "%":
        calc.percent();
        break;
      case "+/-":
        calc.negate();
        break;
      case "\u221A":
        calc.sqrt();
        break;
      case "X":
        calc.setOperation("*");
        break;
      case "\u00F7":
        calc.setOperation("/");
        break;
      case "-":
        calc.setOperation("-");
        break;
      case "+":
        calc.setOperation("+");
        break;
      case "=":
        calc.equals();
        break;
    }
    display(calc.display);
  }
  // debug();
}

//write to the div lcd-display
function display(string, append = false) {
  //if lcd is already zero dont add more zeros
  if(lcd.text() === "0"){
    if(string === "0") return;
    lcd.text("")
  }
  //check operator symbol and set
  $(".function").text(operatorDisplay());
  //check calculators memoery and set symnol
  calc.memory === 0 ? $(".memory").hide() : $(".memory").show();
  // if sppending
  if(append) {
    string = lcd.text() + string;
  }
  //constrain results to specific length.
  string = checkLength(string);
  lcd.text(string);
}

function operatorDisplay(){
  var sign = calc.operation;
  if( sign == "/") sign = "\u00F7";
  else if(sign == "*") sign = "\u00D7";
  return sign;
}

//Check length, too long then cut it short.
function checkLength(string){
  string = String(string);
  if (string.length > 14) {
    var number = Number(string);
    string = number.toPrecision(11);
  }
  return string;
}



//translate the keyboard input into button clicks
function keyboard(e){
  var keycode = e.which
  if(keycode >= 96 && 105 >= keycode)
  {
    keycode -= 48;
    var btn = "."+String.fromCharCode(keycode);
  }
  else if (keycode >= 48 && 57 >= keycode) {
    var btn = "."+String.fromCharCode(keycode);
  }
  else {
    switch(keycode){
      case 107:
        var btn = ".plus";
        break;
      case 187:
        if(e.shiftKey)
          var btn = ".equals";
        else
          var btn = ".plus";
        break;
      case 13:
        var btn = ".equals";
        break;
      case 189:
      case 109:
        var btn = ".minus";
        break;
      case 110:
        var btn = ".period";
        break;
      case 111:
        var btn = ".divide";
        break;
      case 106:
        var btn = ".multiply";
        break;
      case 27:
        var btn = ".clear";
        break;
      case 8:
        var btn = ".erase";
        break;
    }
  }
  btn = $(btn);
  //console.log(btn);
  btn.mousedown();


}

//Main
var lcd = $(".digits");
var calc = new Calculator();
$("button").mousedown(button);
$(document).keydown(keyboard);
lcd.text('0');


// $(".info").click(debug);
// debug();
// function debug(){
//   var calculator = calc;
//   var debugDiv = $(".debug");
//   var log =
//             "Status: " + calculator.power + "<br>" +
//             " Memory: " + calculator.memory + "<br><br>" +
//             " operation: " + calculator.operation + "<br>" +
//             " lastOperation: " + calculator.lastOperation + "<br><br>" +
//             " operating: " + calculator.operating + "<br>" +
//             " newInput: " + calculator.newInput + "<br><br>" +
//             " current: " + calculator.current + "<br>" +
//             " buffer: " + calculator.buffer + "<br>" +
//             " display: " + calculator.display;
//   debugDiv.html(log);
// }
