export type CupType = "empty" | "coffee" | "tea" | "milkCoffee" | "milkTea";

const spriteIndex: Record<CupType, number> = {
  empty: 0,
  coffee: 1,
  tea: 3,
  milkCoffee: 2,
  milkTea: 4,
};

type CupProps = {
  type: CupType;
  className?: string;
};

export default function Cup({ type, className = "" }: CupProps) {
  return (
    <span
      role="img"
      aria-label={`${type} cup`}
      className={`inline-block h-[75px] w-[90px] shrink-0 ${className}`}
      style={{
        backgroundImage: "url('/Sprites/Cups.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "450px 75px",
        backgroundPosition: `${spriteIndex[type] * -90}px 0px`,
        imageRendering: "pixelated",
      }}
    />
  );
}