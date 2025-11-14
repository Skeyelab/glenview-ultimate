'use client';
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  siteName: string;
  logoUrl: string | null;
}

export function Logo({ siteName, logoUrl }: LogoProps): React.JSX.Element {
  return (
    <Link href="/" className="flex items-center gap-3">
      {logoUrl && (
        <Image
          src={logoUrl}
          alt={siteName}
          width={40}
          height={40}
          className="h-10 w-auto"
        />
      )}
      <span className="font-semibold text-lg text-white">{siteName}</span>
    </Link>
  );
}

