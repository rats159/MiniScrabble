import express from "express";
import { readFileSync } from "fs";
import Game from "./Game.ts";
import { UUID } from "crypto";
const app = express();

app.use(express.static("static"));

app.get("/api/verify", (req, res) => {
   res.json(Game.isValidWord(req.query.word as string));
});

app.get("/:gameid/draw", (req, res) => {
   console.log("drawing!");
   res.send("ok");
});

app.listen(8080);

let Games: Map<UUID, Game> = new Map();

function makeBag() {
   return [
      "A",
      "A",
      "A",
      "A",
      "B",
      "C",
      "D",
      "D",
      "E",
      "E",
      "E",
      "E",
      "E",
      "E",
      "E",
      "F",
      "G",
      "G",
      "H",
      "I",
      "I",
      "I",
      "I",
      "I",
      "J",
      "K",
      "L",
      "L",
      "L",
      "M",
      "M",
      "N",
      "N",
      "N",
      "O",
      "O",
      "O",
      "O",
      "O",
      "O",
      "P",
      "P",
      "Q",
      "R",
      "R",
      "R",
      "R",
      "S",
      "S",
      "S",
      "T",
      "T",
      "T",
      "T",
      "U",
      "U",
      "U",
      "V",
      "W",
      "W",
      "X",
      "Y",
      "Z",
      " ",
   ];
}
