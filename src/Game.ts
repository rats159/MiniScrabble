import { UUID } from "crypto";
import { readFileSync } from "fs";

export default class Game {
   public declare readonly id: UUID;
   public declare static words;

   static {
      //Adapted from https://github.com/dwyl/english-words/blob/master/words_alpha.txt
      Game.words = readFileSync("words_alpha.txt", { encoding: "utf8" }).split(
         "\n"
      );
   }

   static isValidWord(word: string): boolean {
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
