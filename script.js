let grid = Array(9).fill("");
let activePlayer = "X";
let gameOn = false;
let pX = "Player X";
let pO = "Player O";
let vsAI = false;

const winCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const allCells = document.querySelectorAll(".cell");
const msg = document.getElementById("message");
const board = document.getElementById("gameGrid");
const reset = document.getElementById("resetBtn");

allCells.forEach(cell => {
  cell.addEventListener("click", () => onCellClick(cell));
});

function initializeGame() {
  const name1 = document.getElementById("nameX").value.trim();
  const name2 = document.getElementById("nameO").value.trim();
  const mode = document.getElementById("gameMode").value;

  pX = name1 || "Player X";
  pO = name2 || (mode === "ai" ? "Computer" : "Player O");

  vsAI = mode === "ai";
  activePlayer = "X";
  gameOn = true;
  grid.fill("");

  allCells.forEach(cell => cell.textContent = "");
  msg.textContent = `${pX}'s Turn (X)`;
  board.style.display = "grid";
  reset.style.display = "inline-block";
  document.getElementById("setupPanel").style.display = "none";
}

function onCellClick(cell) {
  const idx = cell.dataset.index;
  if (grid[idx] || !gameOn) return;

  executeMove(idx, activePlayer);

  if (!gameOn || !vsAI || activePlayer !== "O") return;

  setTimeout(() => {
    const aiChoice = getRandomMove();
    if (aiChoice !== -1) executeMove(aiChoice, "O");
  }, 400);
}

function executeMove(index, player) {
  if (grid[index] !== "") return;

  grid[index] = player;
  allCells[index].textContent = player;
  allCells[index].classList.add("clicked");

  if (checkWin()) {
    const winner = player === "X" ? pX : pO;
    msg.textContent = `${winner} wins! 🎉`;
    gameOn = false;
    return;
  }

  if (!grid.includes("")) {
    msg.textContent = "Match Drawn!";
    gameOn = false;
    return;
  }

  activePlayer = activePlayer === "X" ? "O" : "X";
  const next = activePlayer === "X" ? pX : pO;
  msg.textContent = `${next}'s Turn (${activePlayer})`;
}

function getRandomMove() {
  const empty = grid.map((val, i) => (val === "" ? i : null)).filter(i => i !== null);
  return empty.length ? empty[Math.floor(Math.random() * empty.length)] : -1;
}

function checkWin() {
  return winCombos.some(([a, b, c]) => (
    grid[a] === activePlayer && grid[b] === activePlayer && grid[c] === activePlayer
  ));
}

function resetBoard() {
  grid.fill("");
  activePlayer = "X";
  gameOn = true;
  allCells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("clicked");
  });
  msg.textContent = `${pX}'s Turn (X)`;
}
