'use client';
import Link from "next/link";
import Image from "next/image";
import { LOGO_ID } from "@/lib/config";
import { getDirectusAssetUrl } from "@/lib/directus";

export function Logo(): React.JSX.Element {
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  const logoUrl = directusUrl ? getDirectusAssetUrl(LOGO_ID) : null;

  return (
    <Link href="/" className="flex items-center gap-3">
      {logoUrl && (
        <Image
          src={logoUrl}
          alt="Glenview Ultimate"
          width={40}
          height={40}
          className="h-10 w-auto"
        />
      )}
      <span className="font-semibold text-lg text-white">Glenview Ultimate</span>
    </Link>
  );
}

