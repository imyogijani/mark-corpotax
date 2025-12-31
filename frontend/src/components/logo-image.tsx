import Image from "next/image";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className = "", width = 32, height = 32 }: LogoProps) {
  return (
    <Image
      src="/logo/Mark Corpotax x11.png"
      alt="MARK GROUP - Financial Services & Legal Solutions"
      width={width}
      height={height}
      className={`logo-image ${className} max-w-full h-auto`}
      priority
      quality={100}
      unoptimized={true}
      sizes="(max-width: 640px) 110px, (max-width: 768px) 100px, (max-width: 1024px) 140px, 160px"
      style={{
        objectFit: "contain",
        objectPosition: "center",
        backgroundColor: "transparent",
      }}
    />
  );
}

// Keep the old SVG logo as backup for fallback scenarios
export function LogoSVG(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

export function DribbbleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m8.56 2.75 4.37 6.03 5.54-3.62" />
      <path d="M15.07 17.81 8.82 15.1l-1.54-5.26" />
      <path d="M7.83 21.38c-.71-2.7-.3-5.37 1.03-7.59" />
    </svg>
  );
}
