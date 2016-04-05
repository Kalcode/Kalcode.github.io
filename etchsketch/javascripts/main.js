
container = $('body').append('<div class="container"></div>');
var button = $("<div class='btn'><button onclick='reset()'>Reset</button></div>");

container.append(button);

var gridSize = 50;

var gridHtml  = create_grid(gridSize);

container.append(gridHtml);

$(".box").on("mouseover", function(){
  $(this).addClass("box-color");

});




function create_grid(gridSize) {
  var grid = $("<div class='wrapper'></div>");
  var size = gridSize;
  var percent = (100/size) + "%";
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      var box = $("<div></div>");
      box.addClass("box");
      box.css("width", percent);
      box.css("height", percent);
      grid.append(box);
    }
    grid.append('<br>');
  }
  return grid;
}

function reset() {
  $(".box").each(function(){

    $(this).removeClass("box-color");

  });

}
