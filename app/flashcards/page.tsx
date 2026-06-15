"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  IconChevronLeft,
  IconChevronRight,
  IconArrowsShuffle,
} from "@tabler/icons-react";
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
    <main className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 lg:max-w-2xl lg:py-12">
      <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center">
        <Link
          href="/"
          aria-label="ホームへ戻る"
          className="-m-2 inline-flex w-fit items-center p-2 text-indigo-700 hover:text-indigo-800"
        >
          <IconChevronLeft size={22} stroke={2} aria-hidden />
        </Link>
        <h1 className="text-lg font-bold text-slate-800">暗記カード</h1>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <TierSelector value={tier} onChange={changeTier} />
        <button
          onClick={doShuffle}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          <IconArrowsShuffle size={16} stroke={2} aria-hidden />
          シャッフル
        </button>
      </div>

      {current && <YakuCard yaku={current} />}

      <div className="mt-5 flex items-center justify-between">
        <button
          onClick={prev}
          aria-label="前のカード"
          className="flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
        >
          <IconChevronLeft size={22} stroke={2.25} aria-hidden />
        </button>
        <span className="text-sm text-slate-500">
          {index + 1} / {cards.length}
        </span>
        <button
          onClick={next}
          aria-label="次のカード"
          className="flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
        >
          <IconChevronRight size={22} stroke={2.25} aria-hidden />
        </button>
      </div>
    </main>
  );
}
