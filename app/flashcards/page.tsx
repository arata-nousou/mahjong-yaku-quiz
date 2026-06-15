"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Tier, yakuByTier } from "@/lib/yaku";
import { shuffle } from "@/lib/tiles";
import YakuCard from "@/components/YakuCard";
import TierSelector from "@/components/TierSelector";

export default function FlashcardsPage() {
  const [tier, setTier] = useState<Tier>(1);
  const [order, setOrder] = useState<number[] | null>(null);
  const [index, setIndex] = useState(0);

  const base = useMemo(() => yakuByTier(tier), [tier]);
  const cards = useMemo(
    () => (order ? order.map((i) => base[i]) : base),
    [base, order]
  );
  const current = cards[index];

  function changeTier(t: Tier) {
    setTier(t);
    setOrder(null);
    setIndex(0);
  }
  function doShuffle() {
    setOrder(shuffle(base.map((_, i) => i)));
    setIndex(0);
  }
  const prev = () => setIndex((i) => (i - 1 + cards.length) % cards.length);
  const next = () => setIndex((i) => (i + 1) % cards.length);

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/" className="text-sm text-emerald-700 hover:underline">
          ← ホーム
        </Link>
        <h1 className="text-lg font-bold text-stone-800">暗記カード</h1>
        <span className="w-12" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <TierSelector value={tier} onChange={changeTier} />
        <button
          onClick={doShuffle}
          className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-50"
        >
          シャッフル
        </button>
      </div>

      {current && <YakuCard yaku={current} />}

      <div className="mt-5 flex items-center justify-between">
        <button
          onClick={prev}
          className="rounded-lg bg-emerald-600 px-5 py-2 text-white shadow-sm hover:bg-emerald-700"
        >
          前へ
        </button>
        <span className="text-sm text-stone-500">
          {index + 1} / {cards.length}
        </span>
        <button
          onClick={next}
          className="rounded-lg bg-emerald-600 px-5 py-2 text-white shadow-sm hover:bg-emerald-700"
        >
          次へ
        </button>
      </div>
    </main>
  );
}
