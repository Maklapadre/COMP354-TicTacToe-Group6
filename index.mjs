// Select the instructions container
let instuctions = document.querySelector(".popup-container");

// Select the buttons for player 1 and player 2
let Player1Buttun = document.querySelector(".player1-btn");
let Player2Buttun = document.querySelector(".player2-btn");

// Select the custom container element
let customContainer = document.querySelector(".container-custom");

// Adding functionalities to the instructions container
// Add event listener to the player 1 button
Player1Buttun.addEventListener("click", () => {
  singlePlayer(); // Start single player mode
  instuctions.style.display = "none"; // Hide the instructions container
  customContainer.style.display = "flex"; // Show the custom container
});

// Add event listener to the player 2 button
Player2Buttun.addEventListener("click", () => {
  twoPlayer(); // Start two player mode
  instuctions.style.display = "none"; // Hide the instructions container
  customContainer.style.display = "flex"; // Show the custom container
});
