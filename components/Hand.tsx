import { Tile as TileType } from "@/lib/tiles";
import Tile from "./Tile";

export default function Hand({
  tiles,
  size = "md",
}: {
  tiles: TileType[];
  size?: "sm" | "md" | "lg";
}) {
  // 牌は常に一列。狭い画面では折り返さず横スクロールさせる（麻雀牌が二列になるのは不自然なため）。
  // 収まる時は mx-auto で中央寄せ、溢れた時は左端から横スクロール可能。
  return (
    <div className="overflow-x-auto px-1">
      <div className="mx-auto flex w-max gap-0.5 sm:gap-1">
        {tiles.map((t, i) => (
          <Tile key={`${t}-${i}`} t={t} size={size} />
        ))}
      </div>
    </div>
  );
}
