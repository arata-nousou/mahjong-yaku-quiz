// ブランドマーク（牌＋上り階段＝段位アップ）。favicon(app/icon.svg)と同一デザイン。
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="3"
        y="3"
        width="58"
        height="58"
        rx="14"
        fill="#ffffff"
        stroke="#4f46e5"
        strokeWidth="4"
      />
      <g fill="#4f46e5">
        <rect x="16" y="36" width="9" height="14" rx="2" />
        <rect x="27.5" y="26" width="9" height="24" rx="2" />
        <rect x="39" y="16" width="9" height="34" rx="2" />
      </g>
    </svg>
  );
}

// ヘッダー用ロックアップ（マーク＋「雀力」＋任意のタグライン）
export function Logo({ tagline = true }: { tagline?: boolean }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center gap-3">
        <LogoMark size={44} />
        <h1 className="text-4xl font-bold tracking-wide text-slate-900">雀力</h1>
      </div>
      {tagline && (
        <p className="mt-3 text-sm text-slate-500">役から始める、麻雀上達。</p>
      )}
    </div>
  );
}
