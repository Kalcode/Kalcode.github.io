var lcd = $(".digits");
var memory = "";
var operator = "";
var val = Number(lcd.text());
$(document).ready(function () {

lcd.text("0");
$("button").click(button);

});

function button() {
  var input = $(this).text();
  val = Number(lcd.text());

  switch(input){
    case "C":
      display("0");
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
    default:
      if(lcd.width() > 350) {
        return;
      }
      display(input, true);
  }




}


function display(number, append = false) {
  lcd = $(".digits");
  if(lcd.text() == '0') lcd.text("");
  if(append) {
    lcd.text(lcd.text() + number);
  }
  else {
    lcd.text(number);
  }
}

function memoryFunc(func){
  var memDiv = $(".memory");
  if (func == "clear")
  {
    memory = "";
    memDiv.hide();
  }
  else if( func === "recall" & memory != ""){
    display(memory);
  }
  else if( func == "add"){
    if(!memory) memory = 0;
    memory += val;
  }
  else if( func == "minus"){
    if(!memory) memory = 0;
    memory -= val;
  }

  if (memory) memDiv.show();

}
