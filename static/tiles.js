/**
 * @param {DOMRect} rect1
 * @param {DOMRect} rect2
 */
function overlaps(rect1, rect2) {
   return (
      rect1.right > rect2.left && rect1.left <= rect2.right && rect1.bottom > rect2.top && rect1.top <= rect2.bottom
   );
}

/**
 * @param {HTMLDivElement} tile
 */
function setupTile(tile) {
   tile.onpointerdown = (event) => {
      event.preventDefault();

      //Pick up tile
      tile.classList.add("dragging");
      tile.classList.remove("played");

      //Center on cursor
      tile.style.top = event.clientY - tile.clientHeight / 2 + "px";
      tile.style.left = event.clientX - tile.clientWidth / 2 + "px";
      tile.style.gridArea = "";

      //Pull out of parent
      document.body.appendChild(tile);

      //Prepare dragging
      tile.onpointerup = dropTile;
      document.onpointermove = dragTile;
   };

   function dragTile(event) {
      event.preventDefault();

      //Center on cursor
      tile.style.top = event.clientY - tile.clientHeight / 2 + "px";
      tile.style.left = event.clientX - tile.clientWidth / 2 + "px";
   }

   function dropTile(event) {
      event.preventDefault();

      //Remove dragging
      document.onpointermove = null;

      //Calculate where we dropped it
      const tileBounds = tile.getBoundingClientRect();
      const boardBounds = board.getBoundingClientRect();
      const rackBounds = rack.getBoundingClientRect();

      if (overlaps(tileBounds, boardBounds)) {
         playOnBoard(tile, tileBounds, boardBounds);
      } else if (overlaps(tileBounds, rackBounds)) {
         reorderRack(tile, tileBounds);
      } else {
         rack.appendChild(tile);
      }

      //Reset dragging styles
      tile.classList.remove("dragging");
      tile.style.top = "0px";
      tile.style.left = "0px";
   }
}

function isOpen(rowIndex, colIndex) {
   for (const child of tileBoard.children) {
      if (child.style.gridRow - 1 == rowIndex && child.style.gridColumn - 1 == colIndex) {
         return false;
      }
   }
   return true;
}

/**
 *
 * @param {HTMLDivElement} tile
 * @param {DOMRect} tileBounds
 * @param {DOMRect} boardBounds
 */
function playOnBoard(tile, tileBounds, boardBounds) {
   const tile_COUNT = 9;
   const boardTileSize = boardBounds.width / tile_COUNT;
   const rowIndex = Math.min(Math.max(Math.round((tileBounds.top - boardBounds.top) / boardTileSize), 0), 8);
   const colIndex = Math.min(Math.max(Math.round((tileBounds.left - boardBounds.left) / boardTileSize), 0), 8);

   if (!isOpen(rowIndex, colIndex)) {
      rack.appendChild(tile);
      tile.classList.add("invalid");
      setTimeout(() => {
         tile.classList.remove("invalid");
      }, 2000);
   } else {
      tile.style.gridRow = rowIndex + 1;
      tile.style.gridColumn = colIndex + 1;
      tileBoard.appendChild(tile);
      tile.classList.add("played");
   }
}

function reorderRack(tile, tileBounds) {
   let placed = false;
   for (const rackTile of document.querySelectorAll(".tile:not(.dragging)")) {
      if (rackTile.getBoundingClientRect().left > tileBounds.left) {
         rackTile.insertAdjacentElement("beforebegin", tile);
         placed = true;
         break;
      }
   }
   if (!placed) {
      rack.appendChild(tile);
   }
}

/**
 *
 * @returns {string[][]}
 */
function boardToTileArray() {
   const tileArray = new Array(9).fill().map((_) => new Array(9).fill("-"));
   for (const child of tileBoard.children) {
      const x = child.style.gridColumn - 1;
      const y = child.style.gridRow - 1;
      tileArray[x][y] = child.dataset["letter"];
   }
   return tileArray;
}

function getBoardWords() {
   const board = boardToTileArray();

   const verticalWords = [];
   const horizontalWords = [];

   const workingHorizontalWords = [];
   for (let x = 0; x < board.length; x++) {
      let currentVWord = "";

      for (let y = 0; y < board[0].length; y++) {
         const currentLetter = board[x][y];

         if (currentLetter == "-") {
            if (currentVWord != "") {
               if (currentVWord.length > 1) {
                  verticalWords.push(currentVWord);
               }
               currentVWord = "";
            }

            if (workingHorizontalWords[y] != "") {
               if (workingHorizontalWords[y]?.length > 1) {
                  horizontalWords.push(workingHorizontalWords[y]);
               }
               workingHorizontalWords[y] = "";
            }
         }

         if (currentLetter != "-") {
            workingHorizontalWords[y] ??= "";
            workingHorizontalWords[y] += currentLetter;
            currentVWord += currentLetter;
         }
      }
   }

   return [verticalWords, horizontalWords];
}
