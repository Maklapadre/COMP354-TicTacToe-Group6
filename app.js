// Variables to manage game state
let play_board = ["", "", "", "", "", "", "", "", ""]; // Tic-tac-toe board
let player = "O"; // Player symbol
let computer = "X"; // Computer symbol
let gameMode = 1; // 1 for single-player, 2 for two players
let board_full = false; // Flag to check if the board is full
let ai_level; // AI difficulty level
let lastMove = null; // Variable to store the last move for undo functionality

// Function to render the board
const render_board = () => {
  const board_container = document.querySelector(".play-area");
  board_container.innerHTML = "";
  play_board.forEach((e, i) => {
    board_container.innerHTML += `<div id="block_${i}" class="block" onclick="addPlayerMove(${i})">${play_board[i]}</div>`;
    if (e == player || e == computer) {
      document.querySelector(`#block_${i}`).classList.add("occupied");
    }
  });
};

// Function to configure AI level
const configure_ai = () => {
  let ai_select = document.querySelector("#ai_level");
  ai_level = Array.from(ai_select.options).filter(
    (option) => option.defaultSelected == true
  )[0].value;
  ai_select.addEventListener("change", (event) => {
    ai_level = event.target.options[event.target.selectedIndex].value;
  });
};

// Facebook Instant Game initialization
FBInstant.initializeAsync().then(function () {
  var progress = 0;
  var interval = setInterval(function () {
    if (progress >= 95) {
      clearInterval(interval);
      FBInstant.startGameAsync().then(function () {
        console.log("Game Loaded");
      });
    }
    FBInstant.setLoadingProgress(progress);
    progress += 5;
  }, 100);
});

// Function to reset the game to two-player mode
const twoPlayer = () => {
  document.getElementById("Player1").innerHTML = " Player 1(O)";
  document.getElementById("Player2").innerHTML = " Player 2(X)";
  gameMode = 2;
  reset_board();
};

// Function to reset the game to single-player mode
const singlePlayer = () => {
  document.getElementById("Player1").innerHTML = " Player";
  document.getElementById("Player2").innerHTML = " Computer";
  gameMode = 1;
  player = "O"; // Default player settings for single-player
  computer = "X";
  reset_board();
};

// Initial render and AI configuration
render_board();
configure_ai();

// Function to check if the board is full
const checkBoardComplete = () => {
  let flag = true;
  play_board.forEach((element) => {
    if (element == "") {
      flag = false;
    }
  });
  board_full = flag;
};

// Main game loop to render board, check for completeness, and check for a winner
const game_loop = () => {
  render_board();
  checkBoardComplete();
  checkWinner();
};

// Function to display whose move it is
const showPlayer = (mode, player) => {
  if (mode == 1) {
    // Mode 1 is single-player
    if (player == 1) document.getElementById("move").innerHTML = "Player Move!";
  } else {
    // Mode 2 is for two players
    if (player == 1)
      document.getElementById("move").innerHTML = "Player 1 Move!";
    else document.getElementById("move").innerHTML = "Player 2 Move";
  }
};

// Function to randomize starting player
const randomizeStart = () => {
  if (play_board.every((item) => item === "")) {
    const COMPUTER = 1;
    const start = Math.round(Math.random());
    if (start === COMPUTER) {
      if (gameMode == 1) {
        addComputerMove(ai_level);
      } else {
        showPlayer(2, 2);
      }
      console.log("COMPUTER STARTED");
    } else {
      if (gameMode == 1) showPlayer(1, 1);
      else showPlayer(2, 1);
      console.log("PLAYER STARTS");
    }
  }
};

// Function to handle player moves
const addPlayerMove = (e) => {
  if (play_board[e] == "" && !board_full) {
    document.querySelector("#ai_level").disabled = true;
    lastMove = [...play_board]; // Store the current state for undo functionality
    play_board[e] = player;
    game_loop();
    if (gameMode == 1) {
      addComputerMove(ai_level);
      showPlayer(1, 1);
    } else {
      // Toggle player
      if (player == "X") {
        player = "O";
        showPlayer(2, 1);
      } else {
        player = "X";
        showPlayer(2, 2);
      }
    }
  }
};

// Function to undo the last move
const undoLastMove = () => {
  if (lastMove !== null) {
    play_board = [...lastMove];
    lastMove = null;
    game_loop();
  }
};

// Function to handle computer moves based on AI level
const addComputerMove = (ai_level) => {
  if (!board_full) {
    let score;
    let compare;
    switch (ai_level) {
      case "hard":
        score = -Infinity;
        compare = (a, b) => a > b;
        break;
      case "easy":
        score = Infinity;
        compare = (a, b) => a < b;
        break;
      case "normal":
        let guess = Math.random() * 100;
        if (guess <= 40) {
          score = Infinity;
          compare = (a, b) => a < b;
        } else {
          score = -Infinity;
          compare = (a, b) => a > b;
        }
        break;
    }
    let nextMove;
    for (let i = 0; i < play_board.length; i++) {
      if (play_board[i] == "") {
        play_board[i] = computer;
        let endScore = minimax(play_board, 0, false);
        play_board[i] = "";
        if (compare(endScore, score)) {
          score = endScore;
          nextMove = i;
        }
      }
    }
    play_board[nextMove] = computer;
    game_loop();
  }
};

// Minimax algorithm for AI decision making
let scores = { X: 1, O: -1, tie: 0 };

const minimax = (board, isMaximizing) => {
  let res = check_match();
  if (res != "") {
    return scores[res];
  }
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] == "") {
        board[i] = computer;
        let score = minimax(board, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] == "") {
        board[i] = player;
        let score = minimax(board, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

// Variables to manage game statistics and end music
var temp1 = 0;
var temp2 = 0;
var temp3 = 0;
var temp4 = 0;
var temp5 = 0;
var temp6 = 0;
var endMusic = null; // Audio object for end game music

// Function to check for a winner
const checkWinner = () => {
  let res = check_match();
  var playerstat1 = 0;
  var computerstat1 = 0;
  var loss1 = 0;
  var loss2 = 0;
  var draw1 = 0;
  var draw2 = 0;

  const winner_statement = document.getElementById("winner");
  const audio = document.querySelector("audio");

  if (res == "O") {
    if (gameMode == 1)
      winner_statement.innerText = "Player Won"; // Single-player mode
    else winner_statement.innerText = "Player 1 Won"; // Two-player mode
    winner_statement.classList.add("playerWin");
    board_full = true;
    playerstat1++;
    loss2++;
    temp1 = temp1 + playerstat1;
    temp3 = temp3 + loss2;
    console.log("player win");
    audio.pause();
    endMusic = new Audio("audio/win.wav");
    endMusic.play();
  } else if (res == "X") {
    if (gameMode == 1)
      winner_statement.innerText = "Computer Won"; // Single-player mode
    else winner_statement.innerText = "Player 2 Won"; // Two-player mode
    winner_statement.classList.add("computerWin");
    board_full = true;
    computerstat1++;
    loss1++;
    temp2 = temp2 + computerstat1;
    temp4 = temp4 + loss1;
    console.log("computer win");
    audio.pause();
    endMusic = new Audio("audio/gameover.wav");
    endMusic.play();
  } else if (board_full) {
    winner_statement.innerText = "Draw...";
    winner_statement.classList.add("draw");
    draw1++;
    draw2++;
    temp5 = temp5 + draw1;
    temp6 = temp6 + draw2;
    console.log("draw");
    audio.pause();
    endMusic = new Audio("audio/gameover.wav");
    endMusic.play();
  }

  // Update statistics on the webpage
  document.getElementById("playerstat1").innerText = temp1;
  document.getElementById("computerstat1").innerText = temp2;
  document.getElementById("loss1").innerText = temp4;
  document.getElementById("loss2").innerText = temp3;
  document.getElementById("draw1").innerText = temp5;
  document.getElementById("draw2").innerText = temp6;

  // Add mute button at the end of the game
  if (loss1 == 1 || loss2 == 1 || draw1 == 1 || draw2 == 1) {
    var btn = document.createElement("button");
    btn.className = "btn-sound";
    btn.innerHTML = "<i class='fa fa-volume-up' aria-hidden='true'></i>";
    btn.onclick = muteAudio;
    document.getElementsByClassName("div-end-of-game")[0].appendChild(btn);
  }
};

// Mute/unmute audio function
var x = document.getElementById("myAudio");

const muteAudio = () => {
  var btn = document.getElementsByClassName("btn-sound")[0];
  if (!x.muted) {
    x.muted = true;
    endMusic.muted = true;
    btn.innerHTML = "<i class='fa fa-volume-down' aria-hidden='true'></i>"; // Change icon when muted
  } else {
    x.muted = false;
    endMusic.muted = false;
    btn.innerHTML = "<i class='fa fa-volume-up' aria-hidden='true'></i>";
  }
};

// Function to check for a winning line
const check_line = (a, b, c) => {
  let status =
    play_board[a] == play_board[b] &&
    play_board[b] == play_board[c] &&
    (play_board[a] == player || play_board[a] == computer);
  if (status) {
    document.getElementById(`block_${a}`).classList.add("won");
    document.getElementById(`block_${b}`).classList.add("won");
    document.getElementById(`block_${c}`).classList.add("won");
  }
  return status;
};

// Function to check for a match (winner or tie)
const check_match = () => {
  for (let i = 0; i < 9; i += 3) {
    if (check_line(i, i + 1, i + 2)) {
      return play_board[i];
    }
  }
  for (let i = 0; i < 3; i++) {
    if (check_line(i, i + 3, i + 6)) {
      return play_board[i];
    }
  }
  if (check_line(0, 4, 8)) {
    return play_board[0];
  }
  if (check_line(2, 4, 6)) {
    return play_board[2];
  }
  checkBoardComplete();
  if (board_full) return "tie";
  return "";
};

// Function to reset the board
const reset_board = () => {
  const winner_statement = document.getElementById("winner");
  play_board = ["", "", "", "", "", "", "", "", ""];
  board_full = false;
  winner_statement.classList.remove("playerWin");
  winner_statement.classList.remove("computerWin");
  winner_statement.classList.remove("draw");
  winner_statement.innerText = "";
  document.querySelector("#ai_level").disabled = false;
  const audio = document.querySelector("audio");
  render_board();
  randomizeStart();

  var mute_sound_btn = document.getElementsByClassName("btn-sound")[0];
  if (mute_sound_btn != undefined)
    mute_sound_btn.parentNode.removeChild(mute_sound_btn); // Delete the button when resetting the board
};

// Function to select the first player and reset the board accordingly
const selectFirstPlayer = (symbol) => {
  reset_board1(symbol);
};

const reset_board1 = (firstPlayer) => {
  const winner_statement = document.getElementById("winner");
  play_board = ["", "", "", "", "", "", "", "", ""];
  board_full = false;
  winner_statement.classList.remove("playerWin");
  winner_statement.classList.remove("computerWin");
  winner_statement.classList.remove("draw");
  winner_statement.innerText = "";
  document.querySelector("#ai_level").disabled = false;
  render_board();
  setStartingPlayer(firstPlayer);

  var mute_sound_btn = document.getElementsByClassName("btn-sound")[0];
  if (mute_sound_btn != undefined)
    mute_sound_btn.parentNode.removeChild(mute_sound_btn); // Delete the button when resetting the board
};

// Function to set the starting player
const setStartingPlayer = (firstPlayer) => {
  if (play_board.every((item) => item === "")) {
    if (firstPlayer === "X") {
      if (gameMode == 1) {
        showPlayer(1, 1);
      } else {
        showPlayer(2, 1);
      }
      console.log("PLAYER STARTS");
    } else if (firstPlayer === "O") {
      if (gameMode == 1) {
        addComputerMove(ai_level);
      } else {
        showPlayer(2, 2);
      }
      console.log("COMPUTER STARTS");
    }
  }
};

// Initial render, AI configuration, and starting player randomization
render_board();
configure_ai();
randomizeStart();
