

function TicTacToe() {
  this.board = [["","",""],
               ["","",""],
               ["","",""]];

  this.symbol = "X";
  this.opponent = "O";

  // Lose ["Lose", [[0,1][1,1][2,1]];
  // Win ["Win", [[0,0][1,1][2,2], [1,1]];
  // Move ["Move", [0,0]];
  this.results = [];

  // Move and pirority
  // 1 = Win, 0 = block, empty = no critical move
  //[[1,1], 1]
  this.nextMove = [];

  // [[1,1],[0,0],[1,2],[2,1]]
  this.emptySpaces = [];

  this.lastMove = "";
}

TicTacToe.prototype.eraseBoard = function () {
  this.board = [["","",""],
               ["","",""],
               ["","",""]];
 this.results = [];
 this.nextMove = [];
 this.emptySpaces = [];
};

TicTacToe.prototype.checkHorizontal = function() {

  //Check horizontal
  //Only check for empty spaces here
  this.emptySpaces = [];
  for (var row = 0; row < 3; row++) {
    // For checking condition of rows
    var checkRow = "";
    var checkedSpaces = [];
    var lastEmptySpace = [];
    for(var col = 0; col < 3; col++) {
      var box = this.board[row][col];
      checkedSpaces.push([[row, col]]);
      if(!box){
        this.emptySpaces.push([row, col]);
        lastEmptySpace = [row, col];
      }
      else {
        checkRow += box;
      }
    }

    var currentDecision = this.decision(checkRow, checkedSpaces, lastEmptySpace);
    if(this.results.length !== 0)
      return;
  }
};

TicTacToe.prototype.checkVertical = function() {

  //Check vertical
  //Only check for empty spaces here
  for (var col = 0; col < 3; col++) {
    // For checking condition of rows
    var checkRow = "";
    var checkedSpaces = [];
    var lastEmptySpace = [];
    for(var row = 0; row < 3; row++) {
      var box = this.board[row][col];
      checkedSpaces.push([[row, col]]);
      if(!box){
        lastEmptySpace = [row, col];
      }
      else {
        checkRow += box;
      }
    }

    var currentDecision = this.decision(checkRow, checkedSpaces, lastEmptySpace);
    if(this.results.length !== 0)
      return;

  }
};

TicTacToe.prototype.checkDiagonal = function() {

  var checkRow = "";
  var checkedSpaces = [];
  var lastEmptySpace = [];
  for (var i = 0; i < 3; i++) {
    var box = this.board[i][i];
    checkedSpaces.push([[i, i]]);
    if(!box){
      lastEmptySpace = [i, i];
    }
    else {
      checkRow += box;
    }
  }

  var currentDecision = this.decision(checkRow, checkedSpaces, lastEmptySpace);
  if(this.results.length !== 0)
    return;

  var checkRow = "";
  var checkedSpaces = [];
  var lastEmptySpace = [];
  var coord = [[0,2],[1,1],[2,0]];
  for (var index in coord){
    var loc = coord[index]
    var box = this.board[loc[0]][loc[1]];
    checkedSpaces.push(loc);
    if(!box){
      lastEmptySpace = loc;
    }
    else {
      checkRow += box;
    }
  }


  var currentDecision = this.decision(checkRow, checkedSpaces, lastEmptySpace);
  if(this.results.length !== 0)
    return;

}




TicTacToe.prototype.decision = function(checkRow, checkedSpaces, lastEmptySpace) {
  var currentDecision = [];
  //Check for winning by looking for 'XXX', 'OOO'
  //Checking for critcal spots like 'XXX', 'OOO'
  var condition = this.check(checkRow);
  if (condition == "lose"){
    currentDecision = (["Lose", checkedSpaces]);
  }
  else if (condition == "win") {
    currentDecision = (["Win", checkedSpaces]);
  }
  else if (condition == "prevent") {
    currentDecision = (["Move", [lastEmptySpace, 0]]);
  }
  else if (condition == "priority") {
    currentDecision = (["Move", [lastEmptySpace, 1]]);
  }
  else {
    currentDecision = [];
  }


  if (currentDecision[0] == "Lose") {
    this.results = currentDecision;
  }
  else if (currentDecision[0] == "Win") {
    this.results = currentDecision;
  }
  else if (currentDecision[0] == "Move") {
    if(this.nextMove.length === 0) {
      this.nextMove = currentDecision[1];
    }
    else if(this.nextMove[1] < currentDecision[1][1]) {
      this.nextMove = currentDecision[1];
    }
  }

};

TicTacToe.prototype.check = function(string) {
  if(string === "XXX" || string === "OOO") {
    if(string[0] === this.opponent){
      return "lose";
    }
    else  {
      return "win";
    }
  }
  else if(string === "XX" || string === "OO"){
    if(string[0] === this.opponent){
      return "prevent";
    }
    else {
      return "priority"
    }
  }
  else {
    return "";
  }
};

TicTacToe.prototype.makeMove = function () {
  var move = [];
  if(board[1][1] === "") {
    move = [1,1];
  }
  else if(board[1][1] === this.opponent){
    move = this.cornerSpace();
  }
  else {
    if (this.lastMove == "" || this.lastMove == "corner") {
      move = this.middleSpace();
      this.lastMove = "middle";
    }
    else {
      move = this.cornerSpace();
      this.lastMove = "corner";
    }
  }

  if(move.length === 0) {
    move = this.emptySpaces[0];
  }

  this.nextMove =[move, 1]
};

TicTacToe.prototype.middleSpace = function() {
  var valid = [];
  for(var index in this.emptySpaces) {
    var x = this.emptySpaces[index][0];
    var y = this.emptySpaces[index][1];
    if(x == 1 || y == 1)
      valid.push([x,y]);
  }
  if (valid.length > 0)
    return this.randomSpace(valid);
  else
    return [];
}

TicTacToe.prototype.cornerSpace = function() {
  var valid = [];
  for(var index in this.emptySpaces) {
    var x = this.emptySpaces[index][0];
    var y = this.emptySpaces[index][1];
    if (y == 1 || x == 1)
      continue;
    else if(x == 0|| x == 2 )
      valid.push([x,y]);
  }
  if (valid.length > 0)
    return this.randomSpace(valid);
  else
    return [];
}

TicTacToe.prototype.randomSpace = function(spaces) {
  var random = Math.floor(Math.random() * (spaces.length));
  return spaces[random];
}

TicTacToe.prototype.checkBoard = function () {
  this.checkHorizontal();
  this.checkVertical();
  this.checkDiagonal();
};

TicTacToe.prototype.updateBoard = function() {
  this.results = [];
  this.nextMove = [];
  this.emptySpaces = [];
  this.checkBoard();
  if(this.nextMove.length === 0){
    this.makeMove();
  }
  if(this.results.length > 0) {
    return this.results;
  }
  if(this.emptySpaces.length == 0) {
    this.results = ["Draw"]

    return this.results;
  }

  var x = this.nextMove[0][0];
  var y = this.nextMove[0][1];
  this.board[x][y] = this.symbol;
  this.checkBoard();
  if(this.results.length > 0) {
    if(this.results[0] === "Win") {
      this.results.push([x,y]);

      return this.results;
    }
    else {
    }
  }
  else {
    this.results = ["Move", [x,y]];
    return this.results;
    }

};
