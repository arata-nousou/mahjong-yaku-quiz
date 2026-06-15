import { Tile as TileType, tileImage, tileLabel } from "@/lib/tiles";

const SIZE: Record<string, string> = {
  sm: "w-7 sm:w-8",
  md: "w-9 sm:w-11",
  lg: "w-11 sm:w-14",
};

export default function Tile({
  t,
  size = "md",
}: {
  t: TileType;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <img
      src={tileImage(t)}
      alt={tileLabel(t)}
      title={tileLabel(t)}
      draggable={false}
      className={`${SIZE[size]} aspect-[3/4] select-none rounded-sm border border-slate-300 bg-white shadow-sm`}
    />
  );
}
