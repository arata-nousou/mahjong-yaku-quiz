"use client";

import { useState, useEffect } from "react";
import { Yaku } from "@/lib/yaku";
import Hand from "./Hand";

export default function YakuCard({ yaku }: { yaku: Yaku }) {
  const [flipped, setFlipped] = useState(false);

  // 役が変わったら表面に戻す
  useEffect(() => {
    setFlipped(false);
  }, [yaku.id]);

  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className="block w-full rounded-2xl border border-emerald-200 bg-white p-6 text-left shadow-md transition hover:shadow-lg"
    >
      {!flipped ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 text-center">
          <div className="text-sm font-medium text-emerald-600">{yaku.han}</div>
          <div className="text-4xl font-bold tracking-wide text-stone-800">
            {yaku.name}
          </div>
          <div className="text-lg text-stone-500">{yaku.yomi}</div>
          <div className="mt-4 text-xs text-stone-400">タップで成立条件と例を表示</div>
        </div>
      ) : (
        <div className="flex min-h-[260px] flex-col gap-4">
          <div className="text-center">
            <span className="text-xl font-bold text-stone-800">{yaku.name}</span>
            <span className="ml-2 text-sm text-stone-500">{yaku.yomi}</span>
          </div>
          <p className="text-sm leading-relaxed text-stone-700">{yaku.condition}</p>
          <div className="mt-auto">
            <div className="mb-1 text-xs font-medium text-stone-400">例の手牌</div>
            <Hand tiles={yaku.example} size="sm" />
          </div>
          <div className="text-center text-xs text-stone-400">タップで戻る</div>
        </div>
      )}
    </button>
  );
}
