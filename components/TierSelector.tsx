"use client";

import { Tier, TIER_LABEL } from "@/lib/yaku";

const TIERS: Tier[] = [1, 2, 3];

export default function TierSelector({
  value,
  onChange,
}: {
  value: Tier;
  onChange: (t: Tier) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-emerald-200 bg-white p-1 shadow-sm">
      {TIERS.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            value === t
              ? "bg-emerald-600 text-white"
              : "text-stone-600 hover:bg-emerald-50"
          }`}
        >
          {TIER_LABEL[t]}
        </button>
      ))}
    </div>
  );
}
