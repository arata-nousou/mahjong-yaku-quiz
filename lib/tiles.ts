// 牌の表現とユーティリティ
// 数牌: "1m".."9m"(萬) / "1p".."9p"(筒) / "1s".."9s"(索)
// 字牌: "E"/"S"/"W"/"N"(東南西北) / "haku"/"hatsu"/"chun"(白發中)

export type Tile = string;
export type Suit = "m" | "p" | "s";

export const SUITS: Suit[] = ["m", "p", "s"];
export const WINDS: Tile[] = ["E", "S", "W", "N"];
export const DRAGONS: Tile[] = ["haku", "hatsu", "chun"];
export const HONORS: Tile[] = [...WINDS, ...DRAGONS];

export function isSuited(t: Tile): boolean {
  return /^[1-9][mps]$/.test(t);
}
export function isHonor(t: Tile): boolean {
  return HONORS.includes(t);
}
export function suitOf(t: Tile): Suit | null {
  return isSuited(t) ? (t[1] as Suit) : null;
}
export function numOf(t: Tile): number | null {
  return isSuited(t) ? parseInt(t[0], 10) : null;
}
export function isTerminal(t: Tile): boolean {
  const n = numOf(t);
  return n === 1 || n === 9;
}
export function isTerminalOrHonor(t: Tile): boolean {
  return isHonor(t) || isTerminal(t);
}
export function isSimple(t: Tile): boolean {
  return isSuited(t) && !isTerminal(t);
}

// 面子・雀頭の生成ヘルパー
export function run(suit: Suit, start: number): Tile[] {
  return [`${start}${suit}`, `${start + 1}${suit}`, `${start + 2}${suit}`];
}
export function trip(t: Tile): Tile[] {
  return [t, t, t];
}
export function pair(t: Tile): Tile[] {
  return [t, t];
}

// 表示用の画像パス
const HONOR_IMG: Record<string, string> = {
  E: "Ton",
  S: "Nan",
  W: "Shaa",
  N: "Pei",
  haku: "Haku",
  hatsu: "Hatsu",
  chun: "Chun",
};
const SUIT_IMG: Record<Suit, string> = { m: "Man", p: "Pin", s: "Sou" };

export function tileImage(t: Tile): string {
  if (isSuited(t)) return `/tiles/${SUIT_IMG[suitOf(t)!]}${numOf(t)}.svg`;
  return `/tiles/${HONOR_IMG[t]}.svg`;
}

// 表示用ラベル（alt・読み上げ用）
const HONOR_LABEL: Record<string, string> = {
  E: "東",
  S: "南",
  W: "西",
  N: "北",
  haku: "白",
  hatsu: "發",
  chun: "中",
};
const SUIT_LABEL: Record<Suit, string> = { m: "萬", p: "筒", s: "索" };

export function tileLabel(t: Tile): string {
  if (isSuited(t)) return `${numOf(t)}${SUIT_LABEL[suitOf(t)!]}`;
  return HONOR_LABEL[t];
}

// 並べ替え（萬→筒→索→東南西北→白發中、各数字順）
const ORDER: Record<string, number> = {};
["m", "p", "s"].forEach((s, si) => {
  for (let n = 1; n <= 9; n++) ORDER[`${n}${s}`] = si * 100 + n;
});
HONORS.forEach((h, i) => {
  ORDER[h] = 1000 + i;
});

export function sortTiles(tiles: Tile[]): Tile[] {
  return [...tiles].sort((a, b) => (ORDER[a] ?? 9999) - (ORDER[b] ?? 9999));
}

// ランダム
export function randInt(n: number): number {
  return Math.floor(Math.random() * n);
}
export function pickRandom<T>(arr: T[]): T {
  return arr[randInt(arr.length)];
}
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
