window.addEventListener("DOMContentLoaded", () => {
  const chessboard = document.getElementById("chessboard");
  const squares = 8;

  for (let row = 0; row < squares; row++) {
    for (let col = 0; col < squares; col++) {
      const square = document.createElement("div");
      square.classList.add("square");

      if ((row + col) % 2 === 0) {
        square.classList.add("white");
      } else {
        square.classList.add("black");
      }

      // Add click event listener to each square
      square.addEventListener("click", function () {
        this.classList.toggle("selected");
      });

      chessboard.appendChild(square);
    }
  }
});
