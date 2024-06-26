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

      if (tile.classList.contains("played")) {
         for (let i = 0; i < turnTiles.length; i++) {
            if (tile.dataset["x"] == turnTiles[i].dataset["x"] && tile.dataset["y"] == turnTiles[i].dataset["y"]) {
               turnTiles.splice(i, 1);
            }
         }
         sendPickupTile(tile.dataset["x"], tile.dataset["y"]);
      }

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
         console.log("drop on board!");
      } else if (overlaps(tileBounds, rackBounds)) {
         reorderRack(tile, tileBounds);
         console.log("drop on rack!");
      } else {
         rack.appendChild(tile);
      }

      //Reset dragging styles
      tile.style.top = "0px";
      tile.style.left = "0px";
      tile.classList.remove("dragging");
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
   const TILE_COUNT = 9;
   const boardTileSize = boardBounds.width / TILE_COUNT;
   const rowIndex = Math.min(
      Math.max(Math.round((tileBounds.top - boardBounds.top) / boardTileSize), 0),
      TILE_COUNT - 1
   );
   const colIndex = Math.min(
      Math.max(Math.round((tileBounds.left - boardBounds.left) / boardTileSize), 0),
      TILE_COUNT - 1
   );

   if (!isOpen(rowIndex, colIndex)) {
      rack.appendChild(tile);
      tile.classList.add("invalid");
      setTimeout(() => {
         tile.classList.remove("invalid");
      }, 2000);
   } else {
      turnTiles.push(tile);
      placeTile(tile, colIndex, rowIndex);
      sendTilePlaced(tile.dataset["letter"], colIndex, rowIndex);
   }
}

/**
 * @param {HTMLDivElement} tile
 */
function placeTile(tile, x, y) {
   tile.style.gridColumn = x + 1;
   tile.style.gridRow = y + 1;
   tile.setAttribute("data-x", x);
   tile.setAttribute("data-y", y);
   tileBoard.appendChild(tile);
   tile.classList.add("played");
}

function reorderRack(tile, tileBounds) {
   let placed = false;
   for (const rackTile of rack.querySelectorAll(".tile")) {
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

async function validateBoard() {
   const board = boardToTileArray();

   const verticalWords = [];
   const horizontalWords = [];

   const workingHorizontalWords = [];

   let firstX = null;
   let firstY = null;

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
            firstX ??= x;
            firstY ??= y;
            workingHorizontalWords[y] ??= "";
            workingHorizontalWords[y] += currentLetter;
            currentVWord += currentLetter;
         }
      }
   }

   const words = await batchValidateWords(horizontalWords.concat(verticalWords));

   //Flood Fill to check for contiguousness
   const contiguous = isContiguous(board, [], [firstX, firstY]);

   return { contiguous, words };
}

function isContiguous(board, visited, [x, y]) {
   return contiguousCount(board, visited, [x, y]) == board.flat().filter((c) => c != "-").length;
}

function contiguousCount(board, visited, [x, y]) {
   if (x < 0 || x >= board.length || y < 0 || y >= board[0].length) {
      return 0;
   }

   for (const [pX, pY] of visited) {
      if (x == pX && y == pY) {
         return 0;
      }
   }
   visited.push([x, y]);

   if (board[x][y] != "-") {
      return (
         1 +
         contiguousCount(board, visited, [x + 1, y]) +
         contiguousCount(board, visited, [x - 1, y]) +
         contiguousCount(board, visited, [x, y + 1]) +
         contiguousCount(board, visited, [x, y - 1])
      );
   } else {
      return 0;
   }
}

function getWordsFrom(x, y) {
   const words = boardToTileArray();

   let verticalWord = [];
   let horizontalWord = [];

   for (let up = y; up >= 0; up--) {
      if (words[x][up] == "-") {
         break;
      }
      verticalWord.unshift({ x, y: up, letter: words[x][up] });
   }

   for (let down = y + 1; down < words[x].length; down++) {
      if (words[x][down] == "-") {
         break;
      }
      verticalWord.push({ x, y: down, letter: words[x][down] });
   }

   for (let left = x; left >= 0; left--) {
      if (words[left][y] == "-") {
         break;
      }

      horizontalWord.unshift({ x: left, y, letter: words[left][y] });
   }

   for (let right = x + 1; right < words[x].length; right++) {
      if (words[right][y] == "-") {
         break;
      }
      horizontalWord.push({ x: right, y, letter: words[right][y] });
   }

   const wordsObject = {
      vertical: {
         x: verticalWord.map((tile) => tile.x),
         y: verticalWord.map((tile) => tile.y),
         word: verticalWord.map((tile) => tile.letter).join(""),
      },
      horizontal: {
         x: horizontalWord.map((tile) => tile.x),
         y: horizontalWord.map((tile) => tile.y),
         word: horizontalWord.map((tile) => tile.letter).join(""),
      },
   };
   return wordsObject;
}

function getAllWordsFromTiles(tiles) {
   let tileObjs = [];
   for (const tile of tiles) {
      tileObjs.push(getWordsFrom(+tile.dataset["x"], +tile.dataset["y"]));
   }
   const allObjs = [];
   tileObjs.forEach((tileObj) => {
      if (tileObj.horizontal.word.length > 1) {
         allObjs.push(tileObj.horizontal);
      }
      if (tileObj.vertical.word.length > 1) {
         allObjs.push(tileObj.vertical);
      }
   });
   const deDuplicated = new Map();
   for (const word of allObjs) {
      deDuplicated.set(word.x.join("") + "," + word.y.join(""), word.word);
   }
   return deDuplicated;
}

function removeTile({ x, y }) {
   for (const child of tileBoard.children) {
      if (child.dataset["x"] == x && child.dataset["y"] == y) {
         child.remove();
         return;
      }
   }
}

function addPermanantTile({ letter, score, x, y }) {
   const tile = document.createElement("div");
   tile.setAttribute("data-letter", letter);
   tile.setAttribute("data-score", score);
   tile.setAttribute("data-x", x);
   tile.setAttribute("data-y", y);
   tile.classList.add("permanant");
   tile.classList.add("tile");
   tile.style.gridArea = `${y + 1} / ${x + 1}`;
   tileBoard.appendChild(tile);
}
