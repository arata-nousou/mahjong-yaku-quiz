import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "麻雀役クイズ",
  description: "麻雀初心者向け。役を覚えて雀魂の段位戦を上げるための学習アプリ。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
