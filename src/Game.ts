import { UUID, randomUUID } from "crypto";
import { readFileSync } from "fs";
import { Tile } from "./Tile.ts";

export default class Game {
   public readonly id: UUID;
   private bag: Tile[];
   //Adapted from https://github.com/dwyl/english-words/blob/master/words_alpha.txt
   public static readonly words: string[] = readFileSync("words_alpha.txt", {
      encoding: "utf8",
   }).split("\n");

   public constructor() {
      this.id = randomUUID();
      this.bag = Game.makeBag();
   }

   draw() {
      return this.bag.splice(Math.floor(Math.random() * this.bag.length), 1)[0];
   }

   drawMany(amount: number) {
      return Array(amount)
         .fill({})
         .map((_) => this.bag.splice(Math.floor(Math.random() * this.bag.length), 1)[0]);
   }

   bagSize() {
      return this.bag.length;
   }

   static isValidWord(word: string): boolean {
      //Binary search
      let left = 0;
      let right = Game.words.length - 1;

      while (left != right) {
         let idx = Math.ceil((left + right) / 2);
         if (Game.words[idx] > word.toLowerCase()) {
            right = idx - 1;
         } else {
            left = idx;
         }
      }

      return Game.words[left] == word.toLowerCase();
   }

   static makeBag() {
      return [
         Tile.A,
         Tile.A,
         Tile.A,
         Tile.A,
         Tile.B,
         Tile.C,
         Tile.D,
         Tile.D,
         Tile.E,
         Tile.E,
         Tile.E,
         Tile.E,
         Tile.E,
         Tile.E,
         Tile.E,
         Tile.F,
         Tile.F,
         Tile.G,
         Tile.H,
         Tile.I,
         Tile.I,
         Tile.I,
         Tile.I,
         Tile.I,
         Tile.J,
         Tile.K,
         Tile.L,
         Tile.L,
         Tile.L,
         Tile.M,
         Tile.M,
         Tile.N,
         Tile.N,
         Tile.N,
         Tile.O,
         Tile.O,
         Tile.O,
         Tile.O,
         Tile.O,
         Tile.O,
         Tile.P,
         Tile.P,
         Tile.Q,
         Tile.R,
         Tile.R,
         Tile.R,
         Tile.R,
         Tile.S,
         Tile.S,
         Tile.S,
         Tile.T,
         Tile.T,
         Tile.T,
         Tile.T,
         Tile.U,
         Tile.U,
         Tile.U,
         Tile.V,
         Tile.W,
         Tile.W,
         Tile.X,
         Tile.Y,
         Tile.Z,
         Tile.BLANK,
      ];
   }
}
