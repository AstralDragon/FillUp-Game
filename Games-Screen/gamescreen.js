// Global variables
const grid = document.getElementById("grid");
const movesCountElement = document.getElementById("moves");
const colorButtons = document.querySelectorAll(".controls");
const clickSoundSource = document.getElementById("click-sound").src;

const colors = [
  "#ef3029",
  "#efdf4a",
  "#e4e2d1",
  "#8c8c8c",
  "#6fd0ef",
  "#5c4033",
];
const gridSize = 15;
let gridData = [];
let movesCount = 0;
let moveLimit = 30;
let level = 1;
let gameOver = false;

const endModal = document.getElementById("endModal");
const closeModal = document.getElementById("endmodal-close");

// Function definitions
function initGame() {
  gridData = generateGridData(gridSize, colors.length);
  movesCount = 0;
  gameOver = false;
  updateMovesCount();
  renderGrid();
  setColorButtons();

  // Calculate and display minimum moves required
  const minMoves = calculateMinMoves();
  console.log(`Minimum moves required to solve this board: ${minMoves}`);
}

function generateGridData(size, colorCount) {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.floor(Math.random() * colorCount))
  );
}

function updateMovesCount() {
  movesCountElement.innerHTML = `<strong>${
    moveLimit - movesCount
  }</strong> MOVES REMAINING`;
}

function renderGrid() {
  grid.innerHTML = "";
  gridData.forEach((row) => {
    row.forEach((colorIndex) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.style.backgroundColor = colors[colorIndex];
      grid.appendChild(cell);
    });
  });
}

function setColorButtons() {
  colorButtons.forEach((button, index) => {
    button.style.backgroundColor = colors[index];
    button.onclick = () => {
      if (!gameOver) {
        playClickSound();
        changeColor(index);
      }
    };
  });
}

function playClickSound() {
  const clickSound = new Audio(clickSoundSource);
  clickSound.play();
}

function changeColor(newColorIndex) {
  const oldColorIndex = gridData[0][0];
  movesCount++;
  updateMovesCount();

  if (newColorIndex !== oldColorIndex) {
    floodFillIterative(0, 0, oldColorIndex, newColorIndex);
    renderGrid();
  }

  checkWinOrLose();
}

function floodFillIterative(x, y, oldColorIndex, newColorIndex) {
  const stack = [[x, y]];
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (stack.length) {
    const [cx, cy] = stack.pop();
    if (
      cx < 0 ||
      cx >= gridSize ||
      cy < 0 ||
      cy >= gridSize ||
      gridData[cx][cy] !== oldColorIndex
    ) {
      continue;
    }

    gridData[cx][cy] = newColorIndex;
    directions.forEach(([dx, dy]) => stack.push([cx + dx, cy + dy]));
  }
}

function checkWinOrLose() {
  const allSameColor = gridData.flat().every((cell) => cell === gridData[0][0]);

  if (allSameColor) {
    gameOver = true;
    showWinModal();
  } else if (movesCount >= moveLimit) {
    gameOver = true;
    showLoseModal();
  }
}

function showModal(content, closeCallback) {
  document.getElementById("endmodal-body").innerHTML = content;
  endModal.style.display = "block";
  closeModal.onclick = closeCallback;
}

async function loadHTML(url) {
  const response = await fetch(url);
  return response.text();
}

async function showWinModal() {
  const content = await loadHTML("./win-condition/win.html");
  showModal(content, () => {
    endModal.style.display = "none";
    nextLevel();
  });
}

async function showLoseModal() {
  const content = await loadHTML("./lose-condition/lose.html");
  showModal(content, () => {
    endModal.style.display = "none";
  });
}

function nextLevel() {
  level++;
  moveLimit--;
  initGame();
}

function restartGame() {
  level = 1;
  moveLimit = 30;
  initGame();
}

function resetLevel() {
  initGame();
  playClickSound();
}

// Calculate minimum moves required
function calculateMinMoves() {
  const startColor = gridData[0][0];
  const visited = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => false)
  );
  const queue = [];
  queue.push([0, 0, startColor, 0]);
  visited[0][0] = true;

  let minMoves = Infinity;

  while (queue.length > 0) {
    const [x, y, originalColor, moves] = queue.shift();

    // Check if all cells can be changed to this color in minimal moves
    let canChange = true;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (gridData[i][j] !== originalColor && !visited[i][j]) {
          canChange = false;
          break;
        }
      }
      if (!canChange) break;
    }

    if (canChange) {
      minMoves = Math.min(minMoves, moves);
    }

    if (x < gridSize && y < gridSize) {
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          nx < gridSize &&
          ny >= 0 &&
          ny < gridSize &&
          !visited[nx][ny]
        ) {
          visited[nx][ny] = true;
          queue.push([nx, ny, originalColor, moves + 1]);
        }
      }
    }
  }
  return minMoves;
}

// Modal and event listener setup
const modal = document.getElementById("myModal");
const modal2 = document.getElementById("everBest");
const btn = document.getElementById("menu");
const btn2 = document.getElementById("bestscore");
const span = document.getElementsByClassName("close")[0];
const span2 = document.getElementsByClassName("close2")[0];

btn.onclick = async function () {
  modal.style.display = "block";
  const data = await loadHTML("levelmenu.html");
  document.getElementById("modalBody").innerHTML = data;
};

span.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

btn2.onclick = async function () {
  modal2.style.display = "block";
  const data = await loadHTML("../Games-Screen/best-result/bestresult.html");
  document.getElementById("scoreBody").innerHTML = data;
};

span2.onclick = () => {
  modal2.style.display = "none";
};

window.onclick = (event) => {
  if (event.target === modal2) {
    modal2.style.display = "none";
  }
};

// Initialize the game
initGame();
