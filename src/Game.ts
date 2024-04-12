import { UUID } from "crypto";
import { readFileSync } from "fs";

export default class Game {
   public readonly id: UUID;
   //Adapted from https://github.com/dwyl/english-words/blob/master/words_alpha.txt
   public static readonly words: string[] = readFileSync("words_alpha.txt", {
      encoding: "utf8",
   }).split("\n");

   //TODO: Fix this! I don't know what broke it, but some words arent findable.
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
}
