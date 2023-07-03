const pieces = [
  "r",
  "n",
  "b",
  "q",
  "k",
  "b",
  "n",
  "r",
  "p",
  "p",
  "p",
  "p",
  "p",
  "p",
  "p",
  "p",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "P",
  "P",
  "P",
  "P",
  "P",
  "P",
  "P",
  "P",
  "R",
  "N",
  "B",
  "Q",
  "K",
  "B",
  "N",
  "R",
];

let selectedPiece = null;
let selectedCell = null;
let isWhiteTurn = true;
const capturedPieces = {
  white: [],
  black: [],
};

function createBoard() {
  const board = document.getElementById("board");
  for (let i = 0; i < 64; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    // Add class for square color
    if ((i + Math.floor(i / 8)) % 2 === 0) {
      cell.classList.add("square-light");
    } else {
      cell.classList.add("square-dark");
    }

    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
  }
}

function updateBoard() {
  const cells = document.getElementsByClassName("cell");
  for (let i = 0; i < 64; i++) {
    const cell = cells[i];
    cell.innerHTML = "";
    cell.classList.remove("selected");
    const piece = pieces[i];
    if (piece !== "") {
      const pieceElement = document.createElement("span");
      pieceElement.classList.add("piece");

      if (piece === piece.toUpperCase()) {
        pieceElement.classList.add("white-piece");
      } else {
        pieceElement.classList.add("black-piece");
      }
      pieceElement.setAttribute("data-piece", getPieceUnicode(piece));
      cell.appendChild(pieceElement);
    }
  }
}

function getPieceUnicode(piece) {
  switch (piece.toLowerCase()) {
    case "r":
      return "\u2656"; // White Rook
    case "n":
      return "\u2658"; // White Knight
    case "b":
      return "\u2657"; // White Bishop
    case "q":
      return "\u2655"; // White Queen
    case "k":
      return "\u2654"; // White King
    case "p":
      return "\u2659"; // White Pawn
    default:
      return "";
  }
}

function handleCellClick() {
  const index = Array.from(this.parentNode.children).indexOf(this);
  const piece = pieces[index];

  // Deselect the piece if the same piece is clicked again
  if (selectedPiece === piece) {
    selectedPiece = null;
    selectedCell.classList.remove("selected");
    selectedCell = null;
    return;
  }

  if (selectedPiece === null) {
    if (
      piece !== "" &&
      (isWhiteTurn
        ? piece === piece.toUpperCase()
        : piece === piece.toLowerCase())
    ) {
      selectedPiece = piece;
      selectedCell = this;
      this.classList.add("selected");
    }
  } else {
    const isValidMove = validateMove(selectedCell, this);
    if (isValidMove) {
      const sourceIndex = Array.from(selectedCell.parentNode.children).indexOf(
        selectedCell
      );
      const targetIndex = index;
      const targetPiece = pieces[targetIndex];

      // Check if target cell has a friendly piece
      if (
        targetPiece !== "" &&
        ((isWhiteTurn && targetPiece === targetPiece.toUpperCase()) ||
          (!isWhiteTurn && targetPiece === targetPiece.toLowerCase()))
      ) {
        selectedPiece = null;
        selectedCell.classList.remove("selected");
        return;
      }

      pieces[targetIndex] = selectedPiece;
      pieces[sourceIndex] = "";
      isWhiteTurn = !isWhiteTurn;
      selectedPiece = null;
      selectedCell.classList.remove("selected");
      updateBoard();
      updateCapturedPieces();
      updateStatus();
    }
  }
}

function validateMove(sourceCell, targetCell) {
  const sourceIndex = Array.from(sourceCell.parentNode.children).indexOf(
    sourceCell
  );
  const targetIndex = Array.from(targetCell.parentNode.children).indexOf(
    targetCell
  );
  const piece = pieces[sourceIndex];
  const targetPiece = pieces[targetIndex];
  const pieceType = piece.toLowerCase();

  const sourceRow = Math.floor(sourceIndex / 8);
  const sourceCol = sourceIndex % 8;
  const targetRow = Math.floor(targetIndex / 8);
  const targetCol = targetIndex % 8;

  if (sourceIndex === targetIndex) {
    return false;
  }

  if (pieceType === "p") {
    const direction = isWhiteTurn ? -1 : 1;
    if (targetCol === sourceCol && targetPiece === "") {
      if (targetRow === sourceRow + direction) {
        return true;
      } else if (
        ((isWhiteTurn && sourceRow === 6) ||
          (!isWhiteTurn && sourceRow === 1)) &&
        targetRow === sourceRow + 2 * direction &&
        pieces[sourceIndex + 8 * direction] === ""
      ) {
        return true;
      }
    } else if (
      (targetCol === sourceCol - 1 || targetCol === sourceCol + 1) &&
      targetRow === sourceRow + direction &&
      targetPiece !== "" &&
      (isWhiteTurn
        ? targetPiece === targetPiece.toLowerCase()
        : targetPiece === targetPiece.toUpperCase())
    ) {
      return true;
    }
  } else if (pieceType === "r") {
    if (sourceRow === targetRow || sourceCol === targetCol) {
      if (isPathClear(sourceRow, sourceCol, targetRow, targetCol)) {
        return true;
      }
    }
  } else if (pieceType === "n") {
    const rowDiff = Math.abs(targetRow - sourceRow);
    const colDiff = Math.abs(targetCol - sourceCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  } else if (pieceType === "b") {
    const rowDiff = Math.abs(targetRow - sourceRow);
    const colDiff = Math.abs(targetCol - sourceCol);
    if (rowDiff === colDiff) {
      if (isPathClear(sourceRow, sourceCol, targetRow, targetCol)) {
        return true;
      }
    }
  } else if (pieceType === "q") {
    if (sourceRow === targetRow || sourceCol === targetCol) {
      if (isPathClear(sourceRow, sourceCol, targetRow, targetCol)) {
        return true;
      }
    } else {
      const rowDiff = Math.abs(targetRow - sourceRow);
      const colDiff = Math.abs(targetCol - sourceCol);
      if (rowDiff === colDiff) {
        if (isPathClear(sourceRow, sourceCol, targetRow, targetCol)) {
          return true;
        }
      }
    }
  } else if (pieceType === "k") {
    const rowDiff = Math.abs(targetRow - sourceRow);
    const colDiff = Math.abs(targetCol - sourceCol);
    return (
      (rowDiff === 0 && colDiff === 1) ||
      (colDiff === 0 && rowDiff === 1) ||
      (rowDiff === 1 && colDiff === 1)
    );
  }

  return false;
}

function isPathClear(sourceRow, sourceCol, targetRow, targetCol) {
  const rowStep = targetRow > sourceRow ? 1 : targetRow < sourceRow ? -1 : 0;
  const colStep = targetCol > sourceCol ? 1 : targetCol < sourceCol ? -1 : 0;
  let row = sourceRow + rowStep;
  let col = sourceCol + colStep;

  while (row !== targetRow || col !== targetCol) {
    const index = row * 8 + col;
    if (pieces[index] !== "") {
      return false;
    }
    row += rowStep;
    col += colStep;
  }

  return true;
}

function updateCapturedPieces() {
  const capturedPiecesContainer = document.getElementById("captured-pieces");
  capturedPiecesContainer.innerHTML = "";

  for (const color in capturedPieces) {
    for (const piece of capturedPieces[color]) {
      const pieceElement = document.createElement("span");
      pieceElement.textContent = piece;
      pieceElement.classList.add("captured-piece");
      if (color === "white") {
        pieceElement.classList.add("white-piece");
      } else {
        pieceElement.classList.add("black-piece");
      }
      capturedPiecesContainer.appendChild(pieceElement);
    }
  }
}

function updateStatus() {
  const status = document.getElementById("status");
  if (isCheckmate()) {
    status.textContent = isWhiteTurn ? "Black wins!" : "White wins!";
  } else if (isStalemate()) {
    status.textContent = "Stalemate!";
  } else {
    status.textContent = isWhiteTurn ? "White's turn" : "Black's turn";
  }
}

function isCheckmate() {
  // TODO: Implement checkmate logic
  return false;
}

function isStalemate() {
  // TODO: Implement stalemate logic
  return false;
}

createBoard();
updateBoard();
updateStatus();
