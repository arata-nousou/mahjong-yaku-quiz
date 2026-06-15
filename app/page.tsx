import Link from "next/link";
import { IconBook2, IconPencil, IconCards } from "@tabler/icons-react";
import { Logo } from "@/components/Logo";

const MODES = [
  {
    href: "/flashcards",
    Icon: IconBook2,
    title: "暗記カード",
    desc: "役の名前・成立条件・例の手牌をカードで覚える。まずはここから。",
  },
  {
    href: "/quiz",
    Icon: IconPencil,
    title: "4択クイズ",
    desc: "役名と成立条件を4択で出題。覚えた知識を定着させる。",
  },
  {
    href: "/recognition",
    Icon: IconCards,
    title: "手牌認識クイズ",
    desc: "手牌を見て成立している役を当てる。実戦に一番近い練習。",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <Logo />
      </header>

      <div className="flex flex-col gap-4">
        {MODES.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="flex items-center gap-4 rounded-2xl border border-indigo-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-500"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <m.Icon size={24} stroke={1.75} aria-hidden />
            </span>
            <span>
              <span className="block text-lg font-bold text-slate-800">{m.title}</span>
              <span className="block text-sm text-slate-500">{m.desc}</span>
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-slate-500">
        牌画像: FluffyStuff/riichi-mahjong-tiles (CC0)
      </p>
    </main>
  );
}
