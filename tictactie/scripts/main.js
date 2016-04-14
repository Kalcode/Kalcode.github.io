
//Board array
var board = [["","",""],
             ["","",""],
             ["","",""]];

var coords = [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]];
var numPlayers = 1;
var player1 = "O";
var player2 = "X";

var currentTurn = "Player - O";

var ai = new TicTacToe();
var aiThinking = false;

function printBoard(){
  for(var index in board){
    console.log(board[index][0]+" | "+board[index][1]+" | "+board[index][2]);
  }
}


function redrawBoard(){
  var boardIndex = 1;
  for (var row in board) {
    for(var col in board[row]){
      var currentBox = $("#"+boardIndex);
      boardIndex++;
      currentBox.text(board[row][col]);
    }
  }
}

function eraseBoard() {

  for (var row in board) {
    for(var col in board[row]){
      board[row][col] = "";
    }
  }
  redrawBoard();
}

function copyBoardHTML() {
  var boardIndex = 1;
  for (var row in board) {
    for(var col in board[row]){
      var currentBox = $(".id"+boardIndex);
      boardIndex++;
      board[row][col] = currentBox.text();
    }
  }
}


$(".box").click(function(){
  if(aiThinking || $(this).text() != "")
    return;
  if (numPlayers == 2) {
    if(currentTurn === "Player - O") {
      $(this).text(player1);
      var id = Number(this.id)-1;
      var x = coords[id][0];
      var y = coords[id][1];
      board[x][y] = player1;
      currentTurn = "Player - X"
    }
    else {
      $(this).text(player2);
      var id = Number(this.id)-1;
      var x = coords[id][0];
      var y = coords[id][1];
      board[x][y] = player2;
      currentTurn = "Player - O";
    }
    ai.board = board;
    ai.checkBoard();
    var results = ai.results;
    if(results[0] == "Win") {
      displayResults("Player X Won!");
    }
    else if(results[0] == "Lose") {
      displayResults("Player O Won!");
    }
    else if(results[0] == "Draw") {
      displayResults("It's a Tie!");
    }
    $(".turn").text(currentTurn);

  }
  else {
    $(this).text(player1)
    var id = Number(this.id)-1;
    var x = coords[id][0];
    var y = coords[id][1];
    board[x][y] = player1;
    ai.board[x][y] = player1;
    makeMove();
  }
});

$(".restart").click(function(){
  restart();
  $(".game-over-modal").hide("fade", "slow");
});

$(".turn-order").click(function(){
  if (player1 == "O") {
    this.innerText = "2nd (X)" ;
    player1 = "X";
    player2 = "O";
    ai.opponent = player1;
    ai.symbol = player2;
    $(".turn-order-selected").text("You go second (X)");
  }
  else {
    this.innerText = "1st (O)";
    player1 = "O";
    player2 = "X";
    ai.opponent = player1;
    ai.symbol = player2;
    $(".turn-order-selected").text("You go first (O)");
  }
});


$(".players2").click(function(){
  if(this.innerText == "Vs CPU") {
    $(".results").text("Player vs Player");
    this.innerText = "Vs Player";
    numPlayers = 2;
  }
  else {
    $(".results").text("Player vs CPU");
    this.innerText = "Vs CPU";
    numPlayers = 1;
  }
});

function makeMove() {
  $(".turn").text("CPU's Turn");
  aiThinking = true;
  setTimeout(function() {
    var results = ai.updateBoard();
    if(results[0] == "Move") {
      x = results[1][0];
      y = results[1][1]
      board[x][y] = player2;
    }
    else if(results[0] == "Win") {
      x = results[2][0];
      y = results[2][1]
      board[x][y] = player2;
      displayResults("You Lost!");
    }
    else if(results[0] == "Lose") {
      displayResults("You Won!");
    }
    else if(results[0] == "Draw") {
      displayResults("It's a Tie!");
    }
    redrawBoard();
    $(".turn").text("Your Turn");
    if(results[0] !== "Move"){

    }
    else {
      aiThinking = false;
    }
  },500);
}

function displayResults(result) {
  $(".game-over H1").text("Game Over");
  $(".results").text(result);
  $(".game-over-modal").show("fade", "slow");
  $(".game-over-modal").css("display","flex");
}

function restart() {
  eraseBoard();
  ai.eraseBoard();
  aiThinking = false;
  if(player1 == "X" && numPlayers == 1) {
    currentTurn = "CPU's Turn";
    $(".turn").text(currentTurn);
    makeMove();
  }
  else if(player1 == "O" && numPlayers == 1) {
    currentTurn = "Your Turn";
    $(".turn").text(currentTurn);
  }
  else if (numPlayers == 2){
    currentTurn = "Player - O";
    player1 = "O";
    player2 = "X";
    ai.opponent = player1;
    ai.symbol = player2;
    $(".turn").text(currentTurn);
  }
}
