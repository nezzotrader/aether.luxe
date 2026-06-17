import Image from "next/image";

type SwanLogoProps = {
  size?: number;
};

export function SwanLogo({ size = 44 }: SwanLogoProps) {
  return (
    <div className="flex shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] shadow-[0_0_24px_rgba(255,255,255,0.08)]">
      <Image
        src="/swan.svg"
        alt="Aether Luxe swan logo"
        width={size}
        height={size}
        priority
      />
    </div>
  );
}
