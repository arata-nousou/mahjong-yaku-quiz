// 手牌の生成・役判定・クイズ問題の組み立て
// 方針: 各役の手牌をランダム生成 → 構造（面子）から役を判定 → 主役（最高位）が
// ターゲットと一致するまで再生成。これにより「正解＝最高位の役」「誤答＝手牌に存在
// しない役」を保証する（要件 FR-3.2 / FR-3.5）。

import {
  Tile,
  Suit,
  SUITS,
  WINDS,
  DRAGONS,
  HONORS,
  run,
  trip,
  pair,
  isSimple,
  isHonor,
  isTerminal,
  isTerminalOrHonor,
  suitOf,
  numOf,
  pickRandom,
  shuffle,
  randInt,
  sortTiles,
} from "./tiles";
import { YAKU, YAKU_BY_ID, Yaku, Tier } from "./yaku";

// ===== 面子・手牌の表現 =====
type GroupKind = "run" | "trip" | "pair";
interface Group {
  kind: GroupKind;
  tiles: Tile[];
}
interface GenHand {
  tiles: Tile[]; // 表示用にソート済み
  groups: Group[] | null; // 標準形のときのみ
  form: "standard" | "chiitoi" | "kokushi";
}

const runG = (s: Suit, start: number): Group => ({ kind: "run", tiles: run(s, start) });
const tripG = (t: Tile): Group => ({ kind: "trip", tiles: trip(t) });
const pairG = (t: Tile): Group => ({ kind: "pair", tiles: pair(t) });

function std(groups: Group[]): GenHand {
  const tiles = sortTiles(groups.flatMap((g) => g.tiles));
  return { tiles, groups, form: "standard" };
}

// ===== ランダムヘルパー =====
const rSuit = (): Suit => pickRandom(SUITS);
const rSuits = (n: number): Suit[] => shuffle(SUITS).slice(0, n);
const rSimpleStart = () => 2 + randInt(5); // 2..6 → 順子は 2-8 の範囲
const rStart = () => 1 + randInt(7); // 1..7
const rNumTile = (s: Suit): Tile => `${1 + randInt(9)}${s}`;
const rSimpleTile = (s: Suit): Tile => `${2 + randInt(7)}${s}`;
const rTerminal = (s: Suit): Tile => `${pickRandom([1, 9])}${s}`;

// 各牌が4枚以内かを検証
function countsValid(tiles: Tile[]): boolean {
  const c: Record<string, number> = {};
  for (const t of tiles) {
    c[t] = (c[t] ?? 0) + 1;
    if (c[t] > 4) return false;
  }
  return true;
}

// ===== ランダム生成器（recognizable な18役）=====
const GENERATORS: Record<string, () => GenHand> = {
  tanyao: () => {
    const [a, b] = rSuits(2);
    return std([
      runG(a, rSimpleStart()),
      runG(b, rSimpleStart()),
      runG(pickRandom([a, b]), rSimpleStart()),
      tripG(rSimpleTile(pickRandom([a, b]))),
      pairG(rSimpleTile(pickRandom([a, b]))),
    ]);
  },
  pinfu: () => {
    const s = rSuits(3);
    return std([
      runG(s[0], 1), // 端を含めてタンヤオを除外
      runG(s[1], rSimpleStart()),
      runG(s[2], 3 + randInt(4)),
      runG(pickRandom(s), rSimpleStart()),
      pairG(rNumTile(pickRandom(s))),
    ]);
  },
  yakuhai_haku: () => yakuhaiHand("haku"),
  yakuhai_hatsu: () => yakuhaiHand("hatsu"),
  yakuhai_chun: () => yakuhaiHand("chun"),
  iipeikou: () => {
    const s = rSuits(3);
    const st = rSimpleStart();
    return std([
      runG(s[0], st),
      runG(s[0], st), // 同じ順子2つ
      tripG(rNumTile(s[1])),
      runG(s[2], rStart()),
      pairG(rTerminal(s[1])), // 端でタンヤオ除外
    ]);
  },
  sanshoku: () => {
    const st = rStart();
    return std([
      runG("m", st),
      runG("p", st),
      runG("s", st),
      tripG(rNumTile(rSuit())),
      pairG(rNumTile(rSuit())),
    ]);
  },
  ittsuu: () => {
    const main = rSuit();
    const other = pickRandom(SUITS.filter((x) => x !== main));
    return std([
      runG(main, 1),
      runG(main, 4),
      runG(main, 7),
      runG(other, rSimpleStart()),
      pairG(rNumTile(other)),
    ]);
  },
  chanta: () => {
    const s = rSuits(3);
    return std([
      runG(s[0], 1),
      runG(s[1], 7),
      tripG(pickRandom([...HONORS, rTerminal(s[2])])),
      runG(s[2], pickRandom([1, 7])),
      pairG(pickRandom([...HONORS, rTerminal(pickRandom(s))])),
    ]);
  },
  chiitoitsu: () => chiitoiHand(),
  sanankou: () => {
    const s = rSuits(2);
    return std([
      tripG(rNumTile(s[0])),
      tripG(rNumTile(s[1])),
      tripG(rNumTile(pickRandom(s))),
      runG(pickRandom(s), rStart()),
      pairG(rTerminal(pickRandom(s))),
    ]);
  },
  honitsu: () => {
    const s = rSuit();
    return std([
      runG(s, rSimpleStart()), // 中ぶくれの順子でチャンタ除外
      runG(s, rStart()),
      runG(s, rStart()),
      tripG(pickRandom(WINDS)), // 字牌を含めて混一色（風牌で役牌を避ける）
      pairG(rNumTile(s)),
    ]);
  },
  chinitsu: () => {
    const s = rSuit();
    return std([
      tripG(`1${s}`), // 端＋刻子でタンヤオ・平和除外
      runG(s, rSimpleStart()),
      runG(s, 3 + randInt(4)),
      runG(s, rSimpleStart()),
      pairG(`9${s}`),
    ]);
  },
  shousangen: () => {
    const d = shuffle(DRAGONS);
    const s = rSuits(2);
    return std([
      tripG(d[0]),
      tripG(d[1]),
      pairG(d[2]),
      runG(s[0], rStart()),
      runG(s[1], rStart()),
    ]);
  },
  daisangen: () => {
    return std([
      tripG("haku"),
      tripG("hatsu"),
      tripG("chun"),
      runG(rSuit(), rStart()),
      pairG(rNumTile(rSuit())),
    ]);
  },
  suuankou: () => {
    const s = rSuits(2);
    return std([
      tripG(rNumTile(s[0])),
      tripG(rNumTile(s[1])),
      tripG(rNumTile(pickRandom(s))),
      tripG(pickRandom(WINDS)),
      pairG(rNumTile(pickRandom(s))),
    ]);
  },
  tsuuiisou: () => {
    // 全7種の字牌を対子に（字一色＋七対子。主役は字一色）
    return { tiles: sortTiles(HONORS.flatMap((h) => [h, h])), groups: null, form: "chiitoi" };
  },
  kokushi: () => {
    const orphans: Tile[] = ["1m", "9m", "1p", "9p", "1s", "9s", ...HONORS];
    const dup = pickRandom(orphans);
    return { tiles: sortTiles([...orphans, dup]), groups: null, form: "kokushi" };
  },
};

function yakuhaiHand(dragon: Tile): GenHand {
  const s = rSuits(2);
  return std([
    tripG(dragon),
    runG(s[0], rStart()),
    runG(s[1], rStart()),
    runG(pickRandom(s), rStart()),
    pairG(rTerminal(pickRandom(s))),
  ]);
}

function chiitoiHand(): GenHand {
  // 7種の異なる対子。2色以上の数牌を含め、字牌1つ程度で混一色・断么九を避ける
  const candidates: Tile[] = [];
  for (const s of SUITS) for (let n = 1; n <= 9; n++) candidates.push(`${n}${s}`);
  candidates.push(...HONORS);
  const chosen = shuffle(candidates).slice(0, 7);
  return { tiles: sortTiles(chosen.flatMap((t) => [t, t])), groups: null, form: "chiitoi" };
}

// ===== 役判定（生成された手牌の構造から）=====
// recognizable な役の rank（おおよその飜数、役満=100）。主役＝最大rank。
export const RANK: Record<string, number> = {
  tanyao: 1,
  pinfu: 1,
  iipeikou: 1,
  yakuhai_haku: 1,
  yakuhai_hatsu: 1,
  yakuhai_chun: 1,
  sanshoku: 2,
  ittsuu: 2,
  chanta: 2,
  chiitoitsu: 2,
  sanankou: 2,
  honitsu: 3,
  shousangen: 4,
  chinitsu: 6,
  daisangen: 100,
  kokushi: 100,
  suuankou: 100,
  tsuuiisou: 100,
};

function numberedSuits(tiles: Tile[]): Set<Suit> {
  const set = new Set<Suit>();
  for (const t of tiles) {
    const s = suitOf(t);
    if (s) set.add(s);
  }
  return set;
}

// 手牌に存在する recognizable 役の id 一覧
export function detect(gh: GenHand): string[] {
  const present = new Set<string>();
  const tiles = gh.tiles;
  const hasHonor = tiles.some(isHonor);
  const allHonor = tiles.every(isHonor);
  const suits = numberedSuits(tiles);

  // 牌構成ベース（形によらず判定）
  if (!allHonor && tiles.every(isSimple)) present.add("tanyao");
  if (allHonor) present.add("tsuuiisou");
  else if (suits.size === 1 && hasHonor) present.add("honitsu");
  else if (suits.size === 1 && !hasHonor) present.add("chinitsu");

  if (gh.form === "kokushi") {
    present.add("kokushi");
    return Array.from(present);
  }
  if (gh.form === "chiitoi") {
    present.add("chiitoitsu");
    return Array.from(present);
  }

  const groups = gh.groups!;
  const trips = groups.filter((g) => g.kind === "trip");
  const runs = groups.filter((g) => g.kind === "run");
  const pairGroup = groups.find((g) => g.kind === "pair")!;

  // 役牌・三元
  let dragonTrips = 0;
  for (const d of DRAGONS) {
    if (trips.some((g) => g.tiles[0] === d)) {
      dragonTrips++;
      present.add(`yakuhai_${d === "haku" ? "haku" : d === "hatsu" ? "hatsu" : "chun"}`);
    }
  }
  if (dragonTrips === 3) present.add("daisangen");
  if (dragonTrips === 2 && DRAGONS.includes(pairGroup.tiles[0])) present.add("shousangen");

  // 暗刻系
  if (trips.length === 3) present.add("sanankou");
  if (trips.length === 4) present.add("suuankou");

  // 順子系
  const runKey = (g: Group) => `${suitOf(g.tiles[0])}${numOf(g.tiles[0])}`;
  const runCount: Record<string, number> = {};
  for (const r of runs) runCount[runKey(r)] = (runCount[runKey(r)] ?? 0) + 1;
  if (Object.values(runCount).some((n) => n >= 2)) present.add("iipeikou");

  // 三色同順
  for (let start = 1; start <= 7; start++) {
    const cover = new Set<Suit>();
    for (const r of runs) if (numOf(r.tiles[0]) === start) cover.add(suitOf(r.tiles[0])!);
    if (cover.size === 3) present.add("sanshoku");
  }
  // 一気通貫
  for (const s of SUITS) {
    const starts = new Set(runs.filter((r) => suitOf(r.tiles[0]) === s).map((r) => numOf(r.tiles[0])));
    if (starts.has(1) && starts.has(4) && starts.has(7)) present.add("ittsuu");
  }
  // 混全帯么九（全ての面子・雀頭に么九を含む）
  if (groups.every((g) => g.tiles.some(isTerminalOrHonor))) present.add("chanta");
  // 平和（4順子＋数牌の雀頭。待ちは簡略化のため不問）
  if (runs.length === 4 && !isHonor(pairGroup.tiles[0])) present.add("pinfu");

  return Array.from(present);
}

// 主役（最高 rank の役）。同 rank が複数なら null（曖昧）
function headline(ids: string[]): string | null {
  if (ids.length === 0) return null;
  let maxRank = -1;
  for (const id of ids) maxRank = Math.max(maxRank, RANK[id] ?? 0);
  const top = ids.filter((id) => (RANK[id] ?? 0) === maxRank);
  return top.length === 1 ? top[0] : null;
}

// 主役（最高 rank の役）。同 rank が複数なら null（曖昧）。テスト用にも公開。
export function headlineOf(ids: string[]): string | null {
  return headline(ids);
}

// ターゲット役の手牌を、主役がターゲットと一致するまで生成
export function generateFor(targetId: string): { hand: GenHand; present: string[] } {
  const gen = GENERATORS[targetId];
  for (let i = 0; i < 300; i++) {
    const hand = gen();
    if (!countsValid(hand.tiles)) continue;
    const present = detect(hand);
    if (headline(present) === targetId) return { hand, present };
  }
  // フォールバック: 例の手牌
  const y = YAKU_BY_ID[targetId];
  const hand: GenHand = { tiles: sortTiles(y.example), groups: null, form: "standard" };
  return { hand, present: [targetId] };
}

// ===== クイズ問題の組み立て =====
export interface RecognitionQuestion {
  tiles: Tile[];
  choices: { id: string; name: string }[];
  answerId: string;
  yaku: Yaku;
}

export function makeRecognitionQuestion(tier: Tier): RecognitionQuestion {
  const recognizable = YAKU.filter((y) => y.recognizable);
  const tierPool = recognizable.filter((y) => y.tier === tier);
  const target = pickRandom(tierPool.length >= 1 ? tierPool : recognizable);
  const { hand, present } = generateFor(target.id);

  // 誤答: 手牌に存在しない recognizable 役。同ティア優先、足りなければ全体から
  const presentSet = new Set(present);
  const sameTier = recognizable.filter((y) => y.tier === tier && !presentSet.has(y.id) && y.id !== target.id);
  const global = recognizable.filter((y) => !presentSet.has(y.id) && y.id !== target.id);
  const distractPool = sameTier.length >= 3 ? sameTier : global;
  const distractors = shuffle(distractPool).slice(0, 3);

  const choices = shuffle(
    [target, ...distractors].map((y) => ({ id: y.id, name: y.name }))
  );
  return { tiles: hand.tiles, choices, answerId: target.id, yaku: target };
}

export interface NameQuestion {
  direction: "condToName" | "nameToCond";
  prompt: string; // 問題文
  choices: { id: string; text: string }[];
  answerId: string;
  yaku: Yaku;
}

export function makeNameQuestion(pool: Yaku[]): NameQuestion {
  const target = pickRandom(pool);
  const distractors = shuffle(pool.filter((y) => y.id !== target.id)).slice(0, 3);
  const set = [target, ...distractors];
  const direction = Math.random() < 0.5 ? "condToName" : "nameToCond";
  if (direction === "condToName") {
    return {
      direction,
      prompt: target.condition,
      choices: shuffle(set.map((y) => ({ id: y.id, text: y.name }))),
      answerId: target.id,
      yaku: target,
    };
  }
  return {
    direction,
    prompt: target.name,
    choices: shuffle(set.map((y) => ({ id: y.id, text: y.condition }))),
    answerId: target.id,
    yaku: target,
  };
}
