import Link from "next/link";

const MODES = [
  {
    href: "/flashcards",
    emoji: "📖",
    title: "暗記カード",
    desc: "役の名前・成立条件・例の手牌をカードで覚える。まずはここから。",
  },
  {
    href: "/quiz",
    emoji: "✍️",
    title: "4択クイズ",
    desc: "役名と成立条件を4択で出題。覚えた知識を定着させる。",
  },
  {
    href: "/recognition",
    emoji: "🀄",
    title: "手牌認識クイズ",
    desc: "手牌を見て成立している役を当てる。実戦に一番近い練習。",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-stone-800">麻雀 役クイズ</h1>
        <p className="mt-2 text-sm text-stone-500">
          役を覚えて、雀魂の段位戦を上げよう。初級 → 中級 → 上級 と段階的に学べます。
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {MODES.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="text-3xl">{m.emoji}</span>
            <span>
              <span className="block text-lg font-bold text-stone-800">{m.title}</span>
              <span className="block text-sm text-stone-500">{m.desc}</span>
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-stone-400">
        牌画像: FluffyStuff/riichi-mahjong-tiles (CC0)
      </p>
    </main>
  );
}
