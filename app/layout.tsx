import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "雀力 — 役から始める麻雀上達",
  description:
    "麻雀初心者向けの役学習アプリ。暗記カード・4択クイズ・手牌認識で役を覚え、雀魂の段位戦を上げる。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className="flex min-h-dvh flex-col justify-center">{children}</div>
      </body>
    </html>
  );
}
