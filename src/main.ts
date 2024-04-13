import express from "express";
import Game from "./Game.ts";
import { UUID } from "crypto";
import { ParsedQs } from "qs";
const app = express();

app.use(express.static("static"));

app.get("/api/verify", (req, res) => {
   res.json(Game.isValidWord(req.query.word as string));
});

app.post("/api/newgame", (req, res) => {
   const game = new Game();
   Games.set(game.id, game);
   console.log(`Making game! ID: ${game.id}`);
   res.json(JSON.stringify({ id: game.id })).status(200);
});

app.post("/api/endgame", (req, res) => {
   try {
      const gameID = paramToUUID(req.query.id);

      if (Games.delete(gameID)) {
         console.log(`Removing game! ID: ${req.query.id}`);
         res.status(200).json(JSON.stringify({ id: req.query.id }));
         return;
      }
      res.status(400).json("No such game with specified ID");
   } catch (error) {
      if (!(error instanceof Error)) {
         throw error;
      }

      res.status(400).json(error.message);
   }
});

//Be sure to keep this declared last, as to not mark all other api endpoints as `:gameid` ones
app.get("/api/:gameid/draw", (req, res) => {
   try {
      const gameID = paramToUUID(req.params.gameid);
      const game = Games.get(gameID);

      if (game.bagSize() == 0) {
         res.status(409).json("Bag is empty.");
         return;
      }

      const tile = game.draw();
      res.status(200).json(tile.serialize());
   } catch (error) {
      if (!(error instanceof Error)) {
         throw error;
      }

      res.status(400).json(error.message);
   }
});

let Games: Map<UUID, Game> = new Map();

console.log("Starting server!");
app.listen(8080);

function paramToUUID(id: string | ParsedQs | string[] | ParsedQs[] | undefined) {
   const UUIDRegex = /[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12}/;
   if (id == undefined) {
      throw new Error("ID is a required argument.");
   } else if (!(typeof id == "string")) {
      throw new TypeError("Invalid Arg Type.");
   } else if (!UUIDRegex.test(id)) {
      throw new SyntaxError("ID needs to be a valid UUID.");
   }
   return id as UUID;
}
