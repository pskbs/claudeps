export function MascotIcon({ size }: { size: number }) {
  const glyphSize = Math.round(size * 0.82);
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #FFF8EC 0%, #FFDCC4 100%)",
      }}
    >
      <svg width={glyphSize} height={glyphSize} viewBox="0 0 80 80">
        <ellipse cx="40" cy="44" rx="30" ry="28" fill="#FFC7A0" />
        <path
          d="M40 12 C34 12 30 18 32 24 C34 20 38 18 40 18 C42 18 46 20 48 24 C50 18 46 12 40 12 Z"
          fill="#8FCB9B"
        />
        <circle cx="22" cy="46" r="6" fill="#FFA79C" opacity="0.7" />
        <circle cx="58" cy="46" r="6" fill="#FFA79C" opacity="0.7" />
        <circle cx="31" cy="39" r="3" fill="#6B4A3A" />
        <circle cx="49" cy="39" r="3" fill="#6B4A3A" />
        <path
          d="M32 48 Q40 58 48 48"
          stroke="#6B4A3A"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
