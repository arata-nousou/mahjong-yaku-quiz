"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";
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
    <main className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 lg:max-w-2xl lg:py-12">
      <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center">
        <Link
          href="/"
          aria-label="ホームへ戻る"
          className="-m-2 inline-flex w-fit items-center p-2 text-indigo-700 hover:text-indigo-800"
        >
          <IconChevronLeft size={22} stroke={2} aria-hidden />
        </Link>
        <h1 className="text-lg font-bold text-slate-800">手牌認識クイズ</h1>
      </div>

      <div className="mb-5">
        <TierSelector value={tier} onChange={setTier} />
      </div>

      {done ? (
        <div className="rounded-2xl border border-indigo-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-500">結果</p>
          <p className="my-3 text-4xl font-bold text-indigo-700">
            {score} <span className="text-2xl text-slate-500">/ {TOTAL}</span>
          </p>
          <p className="mb-6 text-sm text-slate-600">
            {score === TOTAL
              ? "満点！手牌を見る目が育っています。"
              : score >= 7
              ? "good! 実戦でも役に気づけるはず。"
              : "暗記カードで形を見直して再挑戦しよう。"}
          </p>
          <button
            onClick={() => startSession(tier)}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-white hover:bg-indigo-700"
          >
            もう一度
          </button>
        </div>
      ) : (
        q && (
          <div className="rounded-2xl border border-indigo-200 bg-white p-5">
            <div className="mb-3 text-xs font-medium text-indigo-700">
              この手牌で成立している役は？
            </div>
            <div className="mb-5 rounded-xl bg-slate-100 p-3">
              <Hand tiles={q.tiles} size="sm" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {q.choices.map((c) => {
                const isAnswer = c.id === q.answerId;
                const isPicked = c.id === picked;
                let cls = "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50";
                let mark: string | null = null;
                if (picked) {
                  if (isAnswer) {
                    cls = "border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-600";
                    mark = "○";
                  } else if (isPicked) {
                    cls = "border-rose-500 bg-rose-50 text-rose-800 ring-1 ring-inset ring-rose-500";
                    mark = "✕";
                  } else {
                    cls = "border-slate-200 bg-white text-slate-400";
                  }
                }
                return (
                  <button
                    key={c.id}
                    onClick={() => answer(c.id)}
                    disabled={!!picked}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-3 text-center text-sm font-medium transition ${cls}`}
                  >
                    {mark && (
                      <span className="shrink-0 text-base font-bold leading-none">{mark}</span>
                    )}
                    {c.name}
                  </button>
                );
              })}
            </div>

            {picked && (
              <div className="mt-5">
                <p
                  className={`flex items-center gap-1.5 text-sm font-bold ${
                    picked === q.answerId ? "text-emerald-700" : "text-rose-600"
                  }`}
                >
                  <span className="text-base leading-none">
                    {picked === q.answerId ? "○" : "✕"}
                  </span>
                  {picked === q.answerId ? "正解！" : "不正解…"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  <span className="font-bold">{q.yaku.name}</span>（{q.yaku.yomi}）:{" "}
                  {q.yaku.condition}
                </p>
                <button
                  onClick={next}
                  className="mt-4 w-full rounded-lg bg-indigo-600 py-2.5 text-white hover:bg-indigo-700"
                >
                  {qIndex + 1 >= TOTAL ? "結果を見る" : "次の問題へ"}
                </button>
              </div>
            )}
          </div>
        )
      )}

      {!done && q && (
        <p className="mt-5 text-center text-sm text-slate-500">
          {Math.min(qIndex + 1, TOTAL)} / {TOTAL}
        </p>
      )}
    </main>
  );
}
