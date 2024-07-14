// Selecting DOM elements for instructions container and buttons
let instructions = document.querySelector(".popup-container");
let Player1Button = document.querySelector(".player1-btn");
let Player2Button = document.querySelector(".player2-btn");
let customContainer = document.querySelector(".container-custom");

// Adding event listener for the single player button
Player1Button.addEventListener("click", () => {
  singlePlayer(); // Call function to set up single player mode
  instructions.style.display = "none"; // Hide instructions popup
  customContainer.style.display = "flex"; // Show custom container
});

// Adding event listener for the two player button
Player2Button.addEventListener("click", () => {
  twoPlayer(); // Call function to set up two player mode
  instructions.style.display = "none"; // Hide instructions popup
  customContainer.style.display = "flex"; // Show custom container
});
