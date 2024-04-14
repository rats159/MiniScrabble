"use strict";

const board = document.querySelector(".board");
const rack = document.querySelector(".rack");
const tileBoard = document.querySelector("#playedtiles");

let gameId = "";
let socket = new WebSocket("ws://localhost:8080");

async function validateWord(word) {
   return await fetch(`http://localhost:8080/api/verify?word=${word}`).then((data) => data.json());
}

async function createNewGame() {
   gameId = (await fetch("api/newgame", { method: "POST" }).then((data) => data.json())).id;
   socket.addEventListener("message", (response) => {
      const data = JSON.parse(response.data);

      console.log(data);
      switch (data.type) {
         case "bagdraw":
            for (const tile of data.data.tiles) {
               rack.appendChild(makeTileHTML(tile.letter, tile.score));
            }
      }
   });

   socket.send(JSON.stringify({ type: "draw", gameid: gameId, amount: 5 }));
}

function drawTile() {
   socket.send(JSON.stringify({ type: "draw", gameid: gameId, amount: 1 }));
}

function makeTileHTML(letter, score) {
   const tile = document.createElement("div");
   tile.setAttribute("data-letter", letter);
   tile.setAttribute("data-score", score);
   tile.classList.add("tile");
   setupTile(tile);
   return tile;
}
