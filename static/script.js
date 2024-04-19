"use strict";

const board = document.querySelector(".board");
const rack = document.querySelector(".rack");
const tileBoard = document.querySelector("#playedtiles");

let gameId = "";

const socket = io();

let turnTiles = [];

socket.on("draw", ({ tiles }) => {
   for (const tile of tiles) {
      rack.appendChild(makeTileHTML(tile.letter, tile.score));
   }
});

socket.on("placetile", ({ letter, score, x, y }) => {
   placeTile(makeTileHTML(letter, score), x, y);
});

socket.on("pickuptile", ({ x, y }) => {
   for (const tile of tileBoard.children) {
      if (tile.dataset["x"] == x && tile.dataset["y"] == y) {
         tile.remove();
      }
   }
});

socket.on("turnsubmitted", ({ tiles }) => {
   tiles.forEach((tile) => {
      removeTile(tile);
      addPermanantTile(tile);
   });
});

async function validateWord(word) {
   return await fetch(`/api/validate?word=${word}`).then((data) => data.json());
}

async function batchValidateWords(words) {
   return await fetch(`/api/batchValidate?words=${words}`).then((data) => data.json());
}

async function createNewGame() {
   gameId = (await fetch("api/newgame", { method: "POST" }).then((data) => data.json())).id;

   socket.emit("draw", { gameid: gameId, amount: 5 });
}

function drawTile() {
   socket.emit("draw", { gameid: gameId, amount: 1 });
}

function sendTilePlaced(letter, x, y) {
   socket.emit("placetile", { letter, x, y, gameId });
}

function sendPickupTile(x, y) {
   socket.emit("pickuptile", { x, y, gameId });
}

function sendSubmitTurn(tiles) {
   socket.emit("submitturn", { tiles, gameId });
}

function makeTileHTML(letter, score) {
   const tile = document.createElement("div");
   tile.setAttribute("data-letter", letter);
   tile.setAttribute("data-score", score);
   tile.classList.add("tile");
   setupTile(tile);
   return tile;
}

function refillRack() {
   const numToDraw = 5 - rack.childElementCount;
   socket.emit("draw", { gameid: gameId, amount: numToDraw });
}
