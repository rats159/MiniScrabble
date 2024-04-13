export class Tile {
   public readonly letter: string;
   public readonly score: number;

   public constructor(letter: string, score: number) {
      this.letter = letter;
      this.score = score;
   }
}
