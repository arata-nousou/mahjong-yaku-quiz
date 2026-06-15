"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tier } from "@/lib/yaku";
import { makeRecognitionQuestion, RecognitionQuestion } from "@/lib/handGenerator";
import TierSelector from "@/components/TierSelector";
import Hand from "@/components/Hand";

const TOTAL = 10;

export default function RecognitionPage() {
  const [tier, setTier] = useState<Tier>(1);
  const [q, setQ] = useState<RecognitionQuestion | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function startSession(t: Tier) {
    setQ(makeRecognitionQuestion(t));
    setQIndex(0);
    setScore(0);
    setPicked(null);
    setDone(false);
  }
  useEffect(() => {
    startSession(tier);
  }, [tier]);

  function answer(id: string) {
    if (picked) return;
    setPicked(id);
    if (id === q!.answerId) setScore((s) => s + 1);
  }
  function next() {
    if (qIndex + 1 >= TOTAL) {
      setDone(true);
      return;
    }
    setQIndex((i) => i + 1);
    setQ(makeRecognitionQuestion(tier));
    setPicked(null);
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/" className="text-sm text-emerald-700 hover:underline">
          ← ホーム
        </Link>
        <h1 className="text-lg font-bold text-stone-800">手牌認識クイズ</h1>
        <span className="w-12" />
      </div>

      <div className="mb-5 flex items-center justify-between">
        <TierSelector value={tier} onChange={setTier} />
        <span className="text-sm text-stone-500">
          {Math.min(qIndex + 1, TOTAL)} / {TOTAL}
        </span>
      </div>

      {done ? (
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-md">
          <p className="text-sm text-stone-500">結果</p>
          <p className="my-3 text-4xl font-bold text-emerald-700">
            {score} <span className="text-2xl text-stone-400">/ {TOTAL}</span>
          </p>
          <p className="mb-6 text-sm text-stone-600">
            {score === TOTAL
              ? "満点！手牌を見る目が育っています。"
              : score >= 7
              ? "good! 実戦でも役に気づけるはず。"
              : "暗記カードで形を見直して再挑戦しよう。"}
          </p>
          <button
            onClick={() => startSession(tier)}
            className="rounded-lg bg-emerald-600 px-6 py-2.5 text-white shadow-sm hover:bg-emerald-700"
          >
            もう一度
          </button>
        </div>
      ) : (
        q && (
          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-md">
            <div className="mb-3 text-xs font-medium text-emerald-600">
              この手牌で成立している役は？
            </div>
            <div className="mb-5 rounded-xl bg-emerald-900/5 p-3">
              <Hand tiles={q.tiles} size="sm" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {q.choices.map((c) => {
                const isAnswer = c.id === q.answerId;
                const isPicked = c.id === picked;
                let cls = "border-stone-200 bg-white hover:bg-emerald-50";
                if (picked) {
                  if (isAnswer) cls = "border-emerald-500 bg-emerald-50";
                  else if (isPicked) cls = "border-rose-400 bg-rose-50";
                  else cls = "border-stone-200 bg-white opacity-60";
                }
                return (
                  <button
                    key={c.id}
                    onClick={() => answer(c.id)}
                    disabled={!!picked}
                    className={`rounded-xl border px-3 py-3 text-center text-sm font-medium transition ${cls}`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>

            {picked && (
              <div className="mt-5">
                <p
                  className={`text-sm font-bold ${
                    picked === q.answerId ? "text-emerald-700" : "text-rose-600"
                  }`}
                >
                  {picked === q.answerId ? "正解！" : "不正解…"}
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  <span className="font-bold">{q.yaku.name}</span>（{q.yaku.yomi}）:{" "}
                  {q.yaku.condition}
                </p>
                <button
                  onClick={next}
                  className="mt-4 w-full rounded-lg bg-emerald-600 py-2.5 text-white shadow-sm hover:bg-emerald-700"
                >
                  {qIndex + 1 >= TOTAL ? "結果を見る" : "次の問題へ"}
                </button>
              </div>
            )}
          </div>
        )
      )}
    </main>
  );
}
