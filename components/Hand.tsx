import { Tile as TileType } from "@/lib/tiles";
import Tile from "./Tile";

export default function Hand({
  tiles,
  size = "md",
}: {
  tiles: TileType[];
  size?: "sm" | "md" | "lg";
}) {
  // 牌は折り返して常に全牌を表示する（狭い画面でも見切れさせない）。
  return (
    <div className="flex flex-wrap justify-center gap-0.5 px-1 sm:gap-1">
      {tiles.map((t, i) => (
        <Tile key={`${t}-${i}`} t={t} size={size} />
      ))}
    </div>
  );
}
