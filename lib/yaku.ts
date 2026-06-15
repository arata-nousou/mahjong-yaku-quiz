// 役データ（主要25役）。要件定義書 6.3 準拠。
import { Tile, run, trip, pair } from "./tiles";

export type Tier = 1 | 2 | 3;

export interface Yaku {
  id: string;
  name: string; // 役名
  yomi: string; // 読み
  han: string; // 飜数の説明
  tier: Tier; // 1=初級 2=中級 3=上級
  condition: string; // 成立条件の説明
  recognizable: boolean; // 手牌認識クイズの対象か
  example: Tile[]; // 暗記カード用の例の手牌（14枚）
}

export const TIER_LABEL: Record<Tier, string> = {
  1: "初級",
  2: "中級",
  3: "上級",
};

export const YAKU: Yaku[] = [
  // ===== Tier1（初級・最頻出）=====
  {
    id: "riichi",
    name: "立直",
    yomi: "リーチ",
    han: "1飜（門前のみ）",
    tier: 1,
    condition: "門前でテンパイしたときに宣言する。麻雀の基本となる役。",
    recognizable: false,
    example: [...run("m", 2), ...run("m", 6), ...run("p", 2), ...run("s", 7), ...pair("5p")],
  },
  {
    id: "tanyao",
    name: "断么九",
    yomi: "タンヤオ",
    han: "1飜",
    tier: 1,
    condition: "2〜8の数牌だけで作る。1・9・字牌を一切使わない。",
    recognizable: true,
    example: [...run("m", 2), ...run("m", 6), ...run("p", 2), ...run("s", 6), ...pair("5s")],
  },
  {
    id: "tsumo",
    name: "門前清自摸和",
    yomi: "メンゼンツモ",
    han: "1飜（門前のみ）",
    tier: 1,
    condition: "門前（鳴いていない）状態で、自分のツモ牌で和了する。",
    recognizable: false,
    example: [...run("m", 3), ...run("m", 6), ...run("p", 3), ...run("s", 7), ...pair("2p")],
  },
  {
    id: "pinfu",
    name: "平和",
    yomi: "ピンフ",
    han: "1飜（門前のみ）",
    tier: 1,
    condition: "面子は全て順子、雀頭は役牌以外、待ちは両面（リャンメン）。",
    recognizable: true,
    example: [...run("m", 2), ...run("m", 5), ...run("p", 2), ...run("s", 6), ...pair("8p")],
  },
  {
    id: "yakuhai_haku",
    name: "役牌 白",
    yomi: "ヤクハイ ハク",
    han: "1飜",
    tier: 1,
    condition: "白（はく）の刻子（同じ牌3枚）を作る。",
    recognizable: true,
    example: [...trip("haku"), ...run("m", 2), ...run("m", 6), ...run("p", 2), ...pair("9s")],
  },
  {
    id: "yakuhai_hatsu",
    name: "役牌 發",
    yomi: "ヤクハイ ハツ",
    han: "1飜",
    tier: 1,
    condition: "發（はつ）の刻子（同じ牌3枚）を作る。",
    recognizable: true,
    example: [...trip("hatsu"), ...run("m", 3), ...run("p", 4), ...run("s", 6), ...pair("2p")],
  },
  {
    id: "yakuhai_chun",
    name: "役牌 中",
    yomi: "ヤクハイ チュン",
    han: "1飜",
    tier: 1,
    condition: "中（ちゅん）の刻子（同じ牌3枚）を作る。",
    recognizable: true,
    example: [...trip("chun"), ...run("p", 2), ...run("p", 6), ...run("s", 3), ...pair("5m")],
  },
  {
    id: "jikaze",
    name: "自風牌",
    yomi: "ジカゼ",
    han: "1飜",
    tier: 1,
    condition: "自分の席の風牌の刻子。席（東南西北）によって対象牌が変わる。",
    recognizable: false,
    example: [...trip("E"), ...run("m", 2), ...run("p", 4), ...run("s", 6), ...pair("9p")],
  },
  {
    id: "bakaze",
    name: "場風牌",
    yomi: "バカゼ",
    han: "1飜",
    tier: 1,
    condition: "場の風牌の刻子。東場なら東、南場なら南。場によって変わる。",
    recognizable: false,
    example: [...trip("S"), ...run("m", 3), ...run("p", 5), ...run("s", 7), ...pair("2m")],
  },
  {
    id: "iipeikou",
    name: "一盃口",
    yomi: "イーペーコー",
    han: "1飜（門前のみ）",
    tier: 1,
    condition: "全く同じ順子を2つ作る（門前のみ）。",
    recognizable: true,
    example: [...run("m", 2), ...run("m", 2), ...run("p", 5), ...run("s", 6), ...pair("9p")],
  },

  // ===== Tier2（中級）=====
  {
    id: "sanshoku",
    name: "三色同順",
    yomi: "サンショク",
    han: "2飜（食い下がり1飜）",
    tier: 2,
    condition: "萬子・筒子・索子で同じ並びの順子を揃える。",
    recognizable: true,
    example: [...run("m", 3), ...run("p", 3), ...run("s", 3), ...run("m", 7), ...pair("9p")],
  },
  {
    id: "ittsuu",
    name: "一気通貫",
    yomi: "イッツー",
    han: "2飜（食い下がり1飜）",
    tier: 2,
    condition: "同じ色で123・456・789の3つの順子を揃える。",
    recognizable: true,
    example: [...run("m", 1), ...run("m", 4), ...run("m", 7), ...run("p", 2), ...pair("5s")],
  },
  {
    id: "chanta",
    name: "混全帯么九",
    yomi: "チャンタ",
    han: "2飜（食い下がり1飜）",
    tier: 2,
    condition: "全ての面子と雀頭に、1・9または字牌を含める。",
    recognizable: true,
    example: [...run("m", 1), ...run("m", 7), ...run("p", 1), ...run("s", 7), ...pair("E")],
  },
  {
    id: "chiitoitsu",
    name: "七対子",
    yomi: "チートイツ",
    han: "2飜（門前のみ）",
    tier: 2,
    condition: "異なる7種類の対子（同じ牌2枚）を作る（門前のみ）。",
    recognizable: true,
    example: ["1m", "1m", "4m", "4m", "2p", "2p", "6p", "6p", "3s", "3s", "9s", "9s", "E", "E"],
  },
  {
    id: "toitoi",
    name: "対々和",
    yomi: "トイトイ",
    han: "2飜",
    tier: 2,
    condition: "4つの面子を全て刻子（同じ牌3枚）で作る。",
    recognizable: false,
    example: [...trip("2m"), ...trip("5p"), ...trip("8s"), ...trip("E"), ...pair("9s")],
  },
  {
    id: "sanankou",
    name: "三暗刻",
    yomi: "サンアンコー",
    han: "2飜",
    tier: 2,
    condition: "暗刻（自分で揃えた刻子）を3つ作る。",
    recognizable: true,
    example: [...trip("2m"), ...trip("6p"), ...trip("9s"), ...run("s", 2), ...pair("1m")],
  },
  {
    id: "honitsu",
    name: "混一色",
    yomi: "ホンイツ",
    han: "3飜（食い下がり2飜）",
    tier: 2,
    condition: "1種類の数牌＋字牌だけで手牌を作る。",
    recognizable: true,
    example: [...run("m", 1), ...run("m", 2), ...run("m", 4), ...run("m", 6), ...pair("E")],
  },
  {
    id: "ippatsu",
    name: "一発",
    yomi: "イッパツ",
    han: "1飜",
    tier: 2,
    condition: "リーチ後、1巡以内（次の自分のツモまで）に和了する。",
    recognizable: false,
    example: [...run("m", 2), ...run("m", 6), ...run("p", 3), ...run("s", 7), ...pair("5p")],
  },
  {
    id: "haitei",
    name: "海底・河底",
    yomi: "ハイテイ・ホウテイ",
    han: "1飜",
    tier: 2,
    condition: "最後の牌で和了する（海底＝最後のツモ、河底＝最後の捨て牌）。",
    recognizable: false,
    example: [...run("p", 2), ...run("p", 6), ...run("m", 3), ...run("s", 7), ...pair("1s")],
  },

  // ===== Tier3（上級・役満含む）=====
  {
    id: "chinitsu",
    name: "清一色",
    yomi: "チンイツ",
    han: "6飜（食い下がり5飜）",
    tier: 3,
    condition: "1種類の数牌だけで手牌を作る（字牌は使わない）。",
    recognizable: true,
    example: [...trip("1m"), ...run("m", 2), ...run("m", 5), ...run("m", 7), ...pair("9m")],
  },
  {
    id: "shousangen",
    name: "小三元",
    yomi: "ショウサンゲン",
    han: "2飜（＋役牌2飜）",
    tier: 3,
    condition: "三元牌（白發中）のうち2種を刻子、残り1種を雀頭にする。",
    recognizable: true,
    example: [...trip("haku"), ...trip("hatsu"), ...pair("chun"), ...run("m", 2), ...run("p", 5)],
  },
  {
    id: "daisangen",
    name: "大三元",
    yomi: "ダイサンゲン",
    han: "役満",
    tier: 3,
    condition: "白・發・中を全て刻子で揃える（役満）。",
    recognizable: true,
    example: [...trip("haku"), ...trip("hatsu"), ...trip("chun"), ...run("m", 2), ...pair("9p")],
  },
  {
    id: "kokushi",
    name: "国士無双",
    yomi: "コクシムソウ",
    han: "役満",
    tier: 3,
    condition: "1・9・字牌を全13種1枚ずつ＋いずれか1枚（役満・門前のみ）。",
    recognizable: true,
    example: ["1m", "9m", "1p", "9p", "1s", "9s", "E", "S", "W", "N", "haku", "hatsu", "chun", "1m"],
  },
  {
    id: "suuankou",
    name: "四暗刻",
    yomi: "スーアンコー",
    han: "役満",
    tier: 3,
    condition: "暗刻を4つ作る（役満・門前のみ）。",
    recognizable: true,
    example: [...trip("2m"), ...trip("6p"), ...trip("9s"), ...trip("E"), ...pair("5m")],
  },
  {
    id: "tsuuiisou",
    name: "字一色",
    yomi: "ツーイーソー",
    han: "役満",
    tier: 3,
    condition: "字牌だけで手牌を作る（役満）。",
    recognizable: true,
    example: [...trip("E"), ...trip("S"), ...trip("haku"), ...trip("hatsu"), ...pair("chun")],
  },
];

export const YAKU_BY_ID: Record<string, Yaku> = Object.fromEntries(
  YAKU.map((y) => [y.id, y])
);

export function yakuByTier(tier: Tier): Yaku[] {
  return YAKU.filter((y) => y.tier === tier);
}

// ティア以下を全て含む（初級選択時は初級のみ、中級選択時は初級＋中級…にしたい場合に使用）
export function yakuUpToTier(tier: Tier): Yaku[] {
  return YAKU.filter((y) => y.tier <= tier);
}
