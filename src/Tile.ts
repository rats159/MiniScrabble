export class Tile {
   static readonly A = new Tile("A", 1);
   static readonly B = new Tile("B", 3);
   static readonly C = new Tile("C", 3);
   static readonly D = new Tile("D", 2);
   static readonly E = new Tile("E", 1);
   static readonly F = new Tile("F", 4);
   static readonly G = new Tile("G", 2);
   static readonly H = new Tile("H", 4);
   static readonly I = new Tile("I", 1);
   static readonly J = new Tile("J", 8);
   static readonly K = new Tile("K", 5);
   static readonly L = new Tile("L", 1);
   static readonly M = new Tile("M", 3);
   static readonly N = new Tile("N", 1);
   static readonly O = new Tile("O", 1);
   static readonly P = new Tile("P", 3);
   static readonly Q = new Tile("Q", 10);
   static readonly R = new Tile("R", 1);
   static readonly S = new Tile("S", 1);
   static readonly T = new Tile("T", 1);
   static readonly U = new Tile("U", 1);
   static readonly V = new Tile("V", 4);
   static readonly W = new Tile("W", 4);
   static readonly X = new Tile("X", 8);
   static readonly Y = new Tile("Y", 4);
   static readonly Z = new Tile("Z", 10);
   static readonly BLANK = new Tile(" ", 0);

   public readonly letter: string;
   public readonly score: number;

   private constructor(letter, score) {
      this.letter = letter;
      this.score = score;
   }
}
