"use strict";
async function verify(word) {
   return await fetch(`http://localhost:8080/api/verify?word=${word}`).then((data) => data.json());
}

/**
 *
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
      let x = event.clientX;
      let y = event.clientY;

      event.preventDefault();

      tile.classList.add("dragging");
      tile.classList.remove("played");

      tile.style.top = y - tile.clientHeight / 2 + "px";
      tile.style.left = x - tile.clientWidth / 2 + "px";
      tile.style.gridArea = "";

      document.body.appendChild(tile);

      tile.onpointerup = () => {
         document.onpointermove = null;

         const tileBounds = tile.getBoundingClientRect();
         const boardBounds = board.getBoundingClientRect();
         const rackBounds = rack.getBoundingClientRect();

         if (overlaps(tileBounds, boardBounds)) {
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
         } else if (overlaps(tileBounds, rackBounds)) {
            //Reorder rack
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
         } else {
            rack.appendChild(tile);
         }
         tile.classList.remove("dragging");
         tile.style.top = "0px";
         tile.style.left = "0px";
      };

      document.onpointermove = (event) => {
         event.preventDefault();
         x = event.clientX;
         y = event.clientY;

         tile.style.top = y - tile.clientHeight / 2 + "px";
         tile.style.left = x - tile.clientWidth / 2 + "px";
      };
   };
}

document.querySelectorAll(".tile").forEach((tile) => setupTile(tile));
const board = document.querySelector(".board");
const rack = document.querySelector(".rack");
const tileBoard = document.querySelector("#playedtiles");

let gameId = "";
let socket = new WebSocket("ws://localhost:8080");

function isOpen(rowIndex, colIndex) {
   for (const child of tileBoard.children) {
      if (child.style.gridRow - 1 == rowIndex && child.style.gridColumn - 1 == colIndex) {
         return false;
      }
   }
   return true;
}

async function startGame() {
   gameId = JSON.parse(await fetch("api/newgame", { method: "POST" }).then((data) => data.json())).id;
   socket.addEventListener("message", (response) => {
      const data = JSON.parse(response.data);

      console.log(data);
      switch (data.type) {
         case "bagdraw":
            for (const tile of data.data.tiles) {
               rack.appendChild(makeTile(tile.letter, tile.score));
            }
      }
   });

   socket.send(JSON.stringify({ type: "draw", gameid: gameId, amount: 5 }));
}

function draw() {
   socket.send(JSON.stringify({ type: "draw", gameid: gameId, amount: 1 }));
}

function makeTile(letter, score) {
   const tile = document.createElement("div");
   tile.setAttribute("data-letter", letter);
   tile.setAttribute("data-score", score);
   tile.classList.add("tile");
   setupTile(tile);
   return tile;
}
