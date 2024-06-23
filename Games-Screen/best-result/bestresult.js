function updateBestMovesDisplay(minMoves) {
  const displayTextElement = document.querySelector(".displayText");
  if (displayTextElement) {
    displayTextElement.innerHTML = `The smartest person completed this <br /> puzzle in <strong>${minMoves}</strong> moves`;
  }
}