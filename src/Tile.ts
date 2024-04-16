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

   public static get(letter: string): Tile {
      switch (letter.toUpperCase()) {
         case "A":
            return Tile.A;
         case "B":
            return Tile.B;
         case "C":
            return Tile.C;
         case "D":
            return Tile.D;
         case "E":
            return Tile.E;
         case "F":
            return Tile.F;
         case "G":
            return Tile.G;
         case "H":
            return Tile.H;
         case "I":
            return Tile.I;
         case "J":
            return Tile.J;
         case "K":
            return Tile.K;
         case "L":
            return Tile.L;
         case "M":
            return Tile.M;
         case "N":
            return Tile.N;
         case "O":
            return Tile.O;
         case "P":
            return Tile.P;
         case "Q":
            return Tile.Q;
         case "R":
            return Tile.R;
         case "S":
            return Tile.S;
         case "T":
            return Tile.T;
         case "U":
            return Tile.U;
         case "V":
            return Tile.V;
         case "W":
            return Tile.W;
         case "X":
            return Tile.X;
         case "Y":
            return Tile.Y;
         case "Z":
            return Tile.Z;
         case " ":
            return Tile.BLANK;
      }
   }
}
