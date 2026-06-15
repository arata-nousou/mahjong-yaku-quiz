import { describe, it, expect } from "vitest";
import { generateFor, headlineOf } from "./handGenerator";
import { YAKU } from "./yaku";
import { isSimple, isHonor, suitOf } from "./tiles";

const recognizable = YAKU.filter((y) => y.recognizable);

function counts(tiles: string[]): Record<string, number> {
  const c: Record<string, number> = {};
  for (const t of tiles) c[t] = (c[t] ?? 0) + 1;
  return c;
}

describe("手牌生成: 全 recognizable 役の健全性", () => {
  for (const y of recognizable) {
    it(`${y.id}（${y.name}）: 主役がターゲットと一致し、牌構成が正しい`, () => {
      for (let i = 0; i < 60; i++) {
        const { hand, present } = generateFor(y.id);
        // 14枚
        expect(hand.tiles.length).toBe(14);
        // 各牌4枚以内
        for (const n of Object.values(counts(hand.tiles))) {
          expect(n).toBeLessThanOrEqual(4);
        }
        // ターゲット役が成立し、主役（最高位）がターゲット
        expect(present).toContain(y.id);
        expect(headlineOf(present)).toBe(y.id);
      }
    });
  }
});

describe("代表的な役の不変条件", () => {
  it("断么九: 全て2〜8の数牌", () => {
    for (let i = 0; i < 30; i++) {
      const { hand } = generateFor("tanyao");
      expect(hand.tiles.every(isSimple)).toBe(true);
    }
  });

  it("清一色: 1種類の数牌のみ・字牌なし", () => {
    for (let i = 0; i < 30; i++) {
      const { hand } = generateFor("chinitsu");
      const suits = new Set(hand.tiles.map(suitOf));
      expect(hand.tiles.some(isHonor)).toBe(false);
      expect(suits.size).toBe(1);
    }
  });

  it("混一色: 1種類の数牌＋字牌を含む", () => {
    for (let i = 0; i < 30; i++) {
      const { hand } = generateFor("honitsu");
      const numberedSuits = new Set(
        hand.tiles.filter((t) => !isHonor(t)).map(suitOf)
      );
      expect(numberedSuits.size).toBe(1);
      expect(hand.tiles.some(isHonor)).toBe(true);
    }
  });

  it("字一色: 全て字牌", () => {
    const { hand } = generateFor("tsuuiisou");
    expect(hand.tiles.every(isHonor)).toBe(true);
  });

  it("七対子: 7種の異なる対子", () => {
    for (let i = 0; i < 30; i++) {
      const { hand } = generateFor("chiitoitsu");
      const c = counts(hand.tiles);
      const kinds = Object.keys(c);
      expect(kinds.length).toBe(7);
      expect(Object.values(c).every((n) => n === 2)).toBe(true);
    }
  });

  it("国士無双: 13種の么九牌を全て含む", () => {
    const orphans = ["1m", "9m", "1p", "9p", "1s", "9s", "E", "S", "W", "N", "haku", "hatsu", "chun"];
    const { hand } = generateFor("kokushi");
    for (const o of orphans) expect(hand.tiles).toContain(o);
  });
});
