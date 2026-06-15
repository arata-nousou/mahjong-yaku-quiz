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
      className="block w-full rounded-2xl border border-indigo-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:border-indigo-500 sm:p-8"
    >
      {!flipped ? (
        <div className="flex min-h-[260px] lg:min-h-[300px] flex-col items-center justify-center gap-3 text-center">
          <div className="text-sm font-medium text-indigo-700">{yaku.han}</div>
          <div className="text-4xl font-bold tracking-wide text-slate-800">
            {yaku.name}
          </div>
          <div className="text-lg text-slate-500">{yaku.yomi}</div>
          <div className="mt-4 text-xs text-slate-500">タップで成立条件と例を表示</div>
        </div>
      ) : (
        <div className="flex min-h-[260px] lg:min-h-[300px] flex-col gap-4">
          <div className="text-center">
            <span className="text-xl font-bold text-slate-800">{yaku.name}</span>
            <span className="ml-2 text-sm text-slate-500">{yaku.yomi}</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-700">{yaku.condition}</p>
          <div className="mt-auto">
            <div className="mb-1 text-xs font-medium text-slate-500">例の手牌</div>
            <Hand tiles={yaku.example} size="sm" />
          </div>
          <div className="text-center text-xs text-slate-500">タップで戻る</div>
        </div>
      )}
    </button>
  );
}
