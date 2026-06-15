import { Tile as TileType } from "@/lib/tiles";
import Tile from "./Tile";

export default function Hand({
  tiles,
  size = "md",
}: {
  tiles: TileType[];
  size?: "sm" | "md" | "lg";
}) {
  // 1列で表示。横幅に収まらない場合は横スクロール（収まる場合は中央寄せ）。
  return (
    <div className="overflow-x-auto">
      <div className="mx-auto flex w-max gap-0.5 px-1 sm:gap-1">
        {tiles.map((t, i) => (
          <Tile key={`${t}-${i}`} t={t} size={size} />
        ))}
      </div>
    </div>
  );
}
