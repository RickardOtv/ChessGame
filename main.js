// Add click event listeners to each square and piece
var squares = document.getElementsByClassName('square');
for (var i = 0; i < squares.length; i++) {
    squares[i].addEventListener('click', squareClick);
    var piece = squares[i].querySelector('.piece');
    if (piece) {
        piece.addEventListener('click', pieceClick);
    }
}

var selectedPiece = null;

// Function to handle square click event
// Function to handle square click event
function squareClick() {
  if (selectedPiece) {
      var currentSquare = selectedPiece.parentElement;
      var targetSquare = this;

      var distance = Math.abs(getRowIndex(targetSquare) - getRowIndex(currentSquare));

      if (
          isSameColumn(currentSquare, targetSquare) &&
          !isPieceInTargetSquare(targetSquare) &&
          isValidMove(currentSquare, targetSquare)
      ) {
          targetSquare.appendChild(selectedPiece);
      } else if (
          isDiagonalMove(currentSquare, targetSquare) &&
          isCaptureValid(currentSquare, targetSquare)
      ) {
          targetSquare.innerHTML = '';
          targetSquare.appendChild(selectedPiece);
      }

      selectedPiece.classList.remove('selected');
      selectedPiece = null;
  }
}


// Function to handle piece click event
function pieceClick(event) {
    event.stopPropagation(); // Prevent the square click event from firing
    if (selectedPiece) {
        selectedPiece.classList.remove('selected');
    }
    selectedPiece = this;
    selectedPiece.classList.add('selected');
}

// Function to check if two squares are in the same column
function isSameColumn(square1, square2) {
    var square1Index = Array.prototype.indexOf.call(square1.parentElement.children, square1);
    var square2Index = Array.prototype.indexOf.call(square2.parentElement.children, square2);

    return square1Index === square2Index;
}

// Function to check if the target square is a valid diagonal move
function isDiagonalMove(currentSquare, targetSquare) {
    var currentRowIndex = getRowIndex(currentSquare);
    var targetRowIndex = getRowIndex(targetSquare);
    var columnIndexDiff = Math.abs(
        Array.prototype.indexOf.call(currentSquare.parentElement.children, currentSquare) -
        Array.prototype.indexOf.call(targetSquare.parentElement.children, targetSquare)
    );

    return columnIndexDiff === 1 && Math.abs(targetRowIndex - currentRowIndex) === 1;
}

// Function to check if there is a piece in the target square
function isPieceInTargetSquare(targetSquare) {
    return targetSquare.querySelector('.piece') !== null;
}

// Function to check if the move from currentSquare to targetSquare is valid
function isValidMove(currentSquare, targetSquare) {
    var currentRowIndex = getRowIndex(currentSquare);
    var targetRowIndex = getRowIndex(targetSquare);
    var selectedPieceColor = selectedPiece.classList.contains('white') ? 'white' : 'black';

    if (selectedPieceColor === 'white') {
        if (currentRowIndex === 6 && targetRowIndex === 4) {
            var middleSquare = currentSquare.parentElement.children[getSquareIndex(currentSquare) + 1];
            return (
                !isPieceInTargetSquare(targetSquare) &&
                !isPieceInTargetSquare(middleSquare)
            );
        } else {
            return targetRowIndex < currentRowIndex;
        }
    } else {
        if (currentRowIndex === 1 && targetRowIndex === 3) {
            var middleSquare = currentSquare.parentElement.children[getSquareIndex(currentSquare) - 1];
            return (
                !isPieceInTargetSquare(targetSquare) &&
                !isPieceInTargetSquare(middleSquare)
            );
        } else {
            return targetRowIndex > currentRowIndex;
        }
    }
}

// Function to check if the capture from currentSquare to targetSquare is valid
function isCaptureValid(currentSquare, targetSquare) {
    var currentRowIndex = getRowIndex(currentSquare);
    var targetRowIndex = getRowIndex(targetSquare);
    var columnIndexDiff = Math.abs(
        Array.prototype.indexOf.call(currentSquare.parentElement.children, currentSquare) -
        Array.prototype.indexOf.call(targetSquare.parentElement.children, targetSquare)
    );
    var selectedPieceColor = selectedPiece.classList.contains('white') ? 'white' : 'black';

    if (selectedPieceColor === 'white') {
        return targetRowIndex < currentRowIndex && columnIndexDiff === 1 && isOpponentPiece(targetSquare);
    } else {
        return targetRowIndex > currentRowIndex && columnIndexDiff === 1 && isOpponentPiece(targetSquare);
    }
}

// Function to check if a square contains an opponent's piece
function isOpponentPiece(square) {
    var piece = square.querySelector('.piece');
    if (piece) {
        return !piece.classList.contains(selectedPiece.classList[1]);
    }
    return false;
}

// Function to get the row index of a square
function getRowIndex(square) {
    var row = square.parentElement;
    var rowIndex = Array.prototype.indexOf.call(row.parentElement.children, row);

    return rowIndex;
}

// Function to get the index of a square within its row
function getSquareIndex(square) {
    return Array.prototype.indexOf.call(square.parentElement.children, square);
}
