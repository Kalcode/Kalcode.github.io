var lcd = $(".digits");
var memory = "";
var operatorDisplay = "";
var operator = "";
var equation = lcd.text();
var clear = true;
var save = "";

$(document).ready(function () {

lcd.text("0").hide();
$("button").mousedown(button);
$(document).keydown(keyboard);

});

function button() {
  var input = $(this).text();
  if (input == "OFF" || lcd.css("display") == "none"){
    if(input == "CON") {
      lcd.show();
    }
    else {
      clearDisplay(true);
      memoryFunc("clear");
      lcd.hide();
      return;
    }
  }
  switch(input){
    case "CE":
      clearDisplay();
      break;
    case "CON":
      clearDisplay(true);
      break;
    case "MC":
      memoryFunc("clear");
      break;
    case "MR":
      memoryFunc("recall");
      break;
    case "M+":
      memoryFunc("add");
      break;
    case "M-":
      memoryFunc("minus");
      break;
    case "%":
    case "+/-":
    case "\u221A":
    case "X":
    case "\u00F7":
    case "-":
    case "+":
      operate(input);
      break;
    case "=":
      equals();
      break;
    default:
      if(!clear && lcd.text().length > 13 ) {
        return;
      }
      if(input === "\u2022") input = ".";
      display(input, true);
  }




}

function operate(sign){
  save = "";
  if(sign == "\u221A") {
    display(checkLength(Math.sqrt(Number(getDisplay()))));
    clear = true;
    return;
  }
  if(sign == "+/-"){
    var saveClear = clear;
    display(checkLength(Number(getDisplay()*-1)));
    clear = saveClear;
    if(equation !== "" && clear){
      equation = String(Number(equation) * -1);
    }
    return;
  }
  if(sign == "%" ) {
    var results = Number("0" + equation.replace(/[\/\*\-\+]/g, "")) * (Number(getDisplay())/100);
    //operatorDisplay = " ";
    display(results);
    if (equation === "") clear = true;
    return;
  }

  if(operator != "") {
    equals();
  }

  if (equation == "")
    equation += getDisplay();
  switch(sign){
    case "+":
      operator = "+";
      operatorDisplay = "+";
      break;
    case "-":
      operator = "-";
      operatorDisplay = "-";
      break;
    case "\u00F7":
      operator = "/";
      operatorDisplay = "\u00F7";
      break;
    case "X":
      operator = "*";
      operatorDisplay = "\u00D7";
      break;

  }


  display(lcd.text());
  clear = true;
}

function equals() {

  if(!operator || clear == true && save == "")
  {
    if (save){
      equation = String(eval(getDisplay() + save ));
      display(checkLength(equation));
      equation = "";
      clear = true;
      return;
    }
    else
      return;
  }
  console.log(equation+operator+getDisplay()+"="+String(eval(equation + operator + "(" + getDisplay()+")")));
  equation = String(eval(equation + operator + "(" + getDisplay() + ")" ));
  save = operator+ "(" + getDisplay() + ")";
  operatorDisplay = "";
  operator = "";
  display(checkLength(equation));

  equation = "";

  clear = true;

}

function getDisplay()
{
  return lcd.text();
}

function clearDisplay(all = false){
  if (all) {
    equation = "";
    operatorDisplay = "";
    operator = "";
    display("0");

  }
  else {
    operatorDisplay = "";
    operator = "";
    display("0");
  }
  clear = true;

}

function checkLength(string){
  string = String(string);
  if (string.length > 14) {
    var number = Number(string);
    string = number.toPrecision(11);
  }
  return string;
}

function display(string, append = false) {
  if (string === "." && lcd.text().indexOf(".") > -1 && !clear) 
    return;

  if(clear) {
    lcd.text("");
    clear = false;
  }
  $(".function").text(operatorDisplay);

  if(append) {
    lcd.text(lcd.text() + string);
  }
  else {
    lcd.text(string);
  }
}

function memoryFunc(func){
  var memDiv = $(".memory");
  if (func == "clear")
  {
    memory = "";
    memDiv.hide();
    return;
  }
  else if( func === "recall" & memory !== ""){
    display(memory);
  }
  else if( func == "add"){
    if(!memory) memory = 0;
    memory += Number(lcd.text());
  }
  else if( func == "minus"){
    if(!memory) memory = 0;
    memory -= Number(lcd.text());
  }

  if (memory) memDiv.show();
  clear = true;

}

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
