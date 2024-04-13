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

   bagSize() {
      return this.bag.length;
   }

   static isValidWord(word: string): boolean {
      //Binary search
      let left = 0;
      let right = Game.words.length - 1;

      while (left != right) {
         let idx = Math.ceil((left + right) / 2);
         if (Game.words[idx] > word) {
            right = idx - 1;
         } else {
            left = idx;
         }
      }

      return Game.words[left] == word;
   }

   static makeBag() {
      return [
         new Tile("A", 1),
         new Tile("A", 1),
         new Tile("A", 1),
         new Tile("A", 1),
         new Tile("B", 3),
         new Tile("C", 3),
         new Tile("D", 2),
         new Tile("D", 2),
         new Tile("E", 1),
         new Tile("E", 1),
         new Tile("E", 1),
         new Tile("E", 1),
         new Tile("E", 1),
         new Tile("E", 1),
         new Tile("E", 1),
         new Tile("F", 4),
         new Tile("G", 2),
         new Tile("G", 2),
         new Tile("H", 4),
         new Tile("I", 1),
         new Tile("I", 1),
         new Tile("I", 1),
         new Tile("I", 1),
         new Tile("I", 1),
         new Tile("J", 8),
         new Tile("K", 5),
         new Tile("L", 1),
         new Tile("L", 1),
         new Tile("L", 1),
         new Tile("M", 3),
         new Tile("M", 3),
         new Tile("N", 1),
         new Tile("N", 1),
         new Tile("N", 1),
         new Tile("O", 1),
         new Tile("O", 1),
         new Tile("O", 1),
         new Tile("O", 1),
         new Tile("O", 1),
         new Tile("O", 1),
         new Tile("P", 3),
         new Tile("P", 3),
         new Tile("Q", 10),
         new Tile("R", 1),
         new Tile("R", 1),
         new Tile("R", 1),
         new Tile("R", 1),
         new Tile("S", 1),
         new Tile("S", 1),
         new Tile("S", 1),
         new Tile("T", 1),
         new Tile("T", 1),
         new Tile("T", 1),
         new Tile("T", 1),
         new Tile("U", 1),
         new Tile("U", 1),
         new Tile("U", 1),
         new Tile("V", 4),
         new Tile("W", 4),
         new Tile("W", 4),
         new Tile("X", 8),
         new Tile("Y", 4),
         new Tile("Z", 10),
         new Tile(" ", 0),
      ];
   }
}
