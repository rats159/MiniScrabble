"use strict";

const board = document.querySelector(".board");
const rack = document.querySelector(".rack");
const tileBoard = document.querySelector("#playedtiles");

let gameId = "";
// let socket = new WebSocket("ws://localhost:8080");

const socket = io();

socket.on("draw", ({ tiles }) => {
   for (const tile of tiles) {
      rack.appendChild(makeTileHTML(tile.letter, tile.score));
   }
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

function makeTileHTML(letter, score) {
   const tile = document.createElement("div");
   tile.setAttribute("data-letter", letter);
   tile.setAttribute("data-score", score);
   tile.classList.add("tile");
   setupTile(tile);
   return tile;
}
