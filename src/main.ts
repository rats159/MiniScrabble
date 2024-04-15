import express from "express";
import Game from "./Game.ts";
import { UUID } from "crypto";
import * as ws from "ws";
import * as http from "http";
const app = express();
const server = http.createServer(app);

const wss = new ws.WebSocketServer({ server });

type GameMessage = (
   | {
        type: "draw";
        amount: number;
     }
   | {
        type: "end";
     }
) & {
   gameid: string;
};

wss.on("connection", (socket) => {
   socket.on("message", (data) => {
      const message = JSON.parse(data.toString()) as GameMessage;
      switch (message.type) {
         case "draw":
            {
               try {
                  const gameID = paramToUUID(message.gameid);
                  const game = Games.get(gameID);

                  if (game.bagSize() == 0) {
                     socket.send(JSON.stringify({ type: "error", data: "Bag is empty." }));
                     return;
                  }

                  //user tried to draw more tiles than in bag
                  const overdraw = game.bagSize() < message.amount;
                  const count = overdraw ? game.bagSize() : message.amount;

                  const tiles = game.drawMany(count);

                  socket.send(
                     JSON.stringify({
                        type: "bagdraw",
                        data: { count, tiles, remaining: game.bagSize(), overdraw },
                     })
                  );
               } catch (error) {
                  socket.send(JSON.stringify({ type: "error", data: error!.message }));
               }
            }
            break;

         case "end":
            break;
      }
   });
});

app.use(express.static("static"));

app.get("/api/validate", (req, res) => {
   res.json(Game.isValidWord(req.query.word as string));
});

app.get("/api/batchValidate", (req, res) => {
   const words = (req.query["words"] as string).split(",");
   let matches: { word: string; valid: boolean }[] = [];
   for (const word of words) {
      matches.push({ word, valid: Game.isValidWord(word) });
   }
   res.json(matches);
});

app.post("/api/newgame", (req, res) => {
   const game = new Game();
   Games.set(game.id, game);
   console.log(`Making game! ID: ${game.id}`);
   res.json({ id: game.id }).status(200);
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
      res.status(400).json(error!.message);
   }
});

let Games: Map<UUID, Game> = new Map();

console.log("Starting server!");
server.listen(8080);

function paramToUUID(id: any) {
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
