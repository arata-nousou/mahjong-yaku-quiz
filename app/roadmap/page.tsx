"use client";

import Link from "next/link";
import { useState } from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import { RANK_TIERS, RankTier } from "@/lib/roadmap";

function RankSelector({
  tiers,
  selected,
  onChange,
}: {
  tiers: RankTier[];
  selected: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tiers.map((tier) => (
        <button
          key={tier.id}
          disabled={!tier.available}
          onClick={() => tier.available && onChange(tier.id)}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            tier.id === selected
              ? "border-indigo-600 bg-indigo-600 text-white"
              : tier.available
              ? "border-indigo-200 bg-white text-slate-500 hover:border-indigo-400"
              : "cursor-not-allowed border-slate-200 bg-white text-slate-300 opacity-40"
          }`}
        >
          {tier.name}{!tier.available ? "（準備中）" : ""}
        </button>
      ))}
    </div>
  );
}

function StepCard({
  step,
  index,
}: {
  step: RankTier["steps"][number];
  index: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
          {index + 1}
        </span>
        <div>
          <p className="font-bold text-slate-800">{step.title}</p>
          <p className="text-xs text-slate-500">{step.timing}</p>
        </div>
      </div>

      <ul className="mb-4 space-y-2.5 pl-1">
        {step.items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-slate-600">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="rounded-lg border border-indigo-600 px-4 py-3">
        <p className="text-xs font-bold text-indigo-600">この段階のゴール</p>
        <p className="mt-1.5 text-sm leading-relaxed text-indigo-700">{step.goal}</p>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const availableTiers = RANK_TIERS.filter((t) => t.available);
  const [selectedId, setSelectedId] = useState(availableTiers[0].id);
  const selected = RANK_TIERS.find((t) => t.id === selectedId)!;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pt-6 pb-10">
      <header className="mb-6 flex items-center">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"
          aria-label="ホームへ戻る"
        >
          <IconChevronLeft size={20} className="text-slate-600" />
        </Link>
        <h1 className="flex-1 text-center text-base font-bold text-slate-800">
          段位別ロードマップ
        </h1>
        <div className="w-9" />
      </header>

      <div className="mb-6">
        <RankSelector
          tiers={RANK_TIERS}
          selected={selectedId}
          onChange={setSelectedId}
        />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-800">{selected.name}</h2>
        <p className="text-sm text-slate-500">{selected.subtitle}</p>
      </div>

      <div className="flex flex-col gap-5">
        {selected.steps.map((step, i) => (
          <StepCard key={i} step={step} index={i} />
        ))}
      </div>
    </main>
  );
}
