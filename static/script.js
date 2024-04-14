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
 * @param {HTMLDivElement} cell
 */

function setupCell(cell) {
   cell.onpointerdown = (event) => {
      let x = event.clientX;
      let y = event.clientY;

      event.preventDefault();

      cell.classList.add("dragging");
      cell.classList.remove("played");

      cell.style.top = y - cell.clientHeight / 2 + "px";
      cell.style.left = x - cell.clientWidth / 2 + "px";
      cell.style.gridArea = "";

      document.body.appendChild(cell);

      cell.onpointerup = () => {
         document.onpointermove = null;

         const cellBounds = cell.getBoundingClientRect();
         const boardBounds = board.getBoundingClientRect();
         const rackBounds = rack.getBoundingClientRect();

         if (overlaps(cellBounds, boardBounds)) {
            const CELL_COUNT = 9;
            const boardTileSize = boardBounds.width / CELL_COUNT;
            const rowIndex = Math.min(Math.max(Math.round((cellBounds.top - boardBounds.top) / boardTileSize), 0), 8);
            const colIndex = Math.min(Math.max(Math.round((cellBounds.left - boardBounds.left) / boardTileSize), 0), 8);

            cell.style.gridRow = rowIndex + 1;
            cell.style.gridColumn = colIndex + 1;
            tileBoard.appendChild(cell);
            cell.classList.add("played");
         } else if (overlaps(cellBounds, rackBounds)) {
            //Reorder rack
            for (const rackTile of document.querySelectorAll(".cell:not(.dragging)")) {
               if (rackTile.getBoundingClientRect().left > cellBounds.left) {
                  rackTile.insertAdjacentElement("beforebegin", cell);
                  break;
               }
            }
            rack.appendChild(cell);
         } else {
            rack.appendChild(cell);
         }
         cell.classList.remove("dragging");
         cell.style.top = "0px";
         cell.style.left = "0px";
      };

      document.onpointermove = (event) => {
         event.preventDefault();
         x = event.clientX;
         y = event.clientY;

         cell.style.top = y - cell.clientHeight / 2 + "px";
         cell.style.left = x - cell.clientWidth / 2 + "px";
      };
   };
}

document.querySelectorAll(".cell").forEach((cell) => setupCell(cell));
const board = document.querySelector(".board");
const rack = document.querySelector(".rack");
const tileBoard = document.querySelector("#playedtiles");
