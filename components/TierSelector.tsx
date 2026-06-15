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
    <div className="inline-flex rounded-full border border-indigo-200 bg-white p-1">
      {TIERS.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
            value === t
              ? "bg-indigo-600 text-white"
              : "text-slate-600 hover:bg-indigo-50"
          }`}
        >
          {TIER_LABEL[t]}
        </button>
      ))}
    </div>
  );
}
