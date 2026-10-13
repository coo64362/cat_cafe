export type Expression = "neutral" | "happy" | "sad";

const frames: Record<Expression, number> = {
  neutral: 0,
  happy: 1,
  sad: 2,
};

type CatristaProps = {
  expression: Expression;
};

export default function Catrista({ expression }: CatristaProps) {
  return (
    <div
      role="img"
      aria-label={`Cat catrista looking ${expression}`}
      className="h-[220px] w-[250px]"
      style={{
        backgroundImage: "url('/Sprites/Catrista.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "750px 220px",
        backgroundPosition: `${frames[expression] * -250}px 0px`,
        imageRendering: "pixelated",
      }}
    />
  );
}