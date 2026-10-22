import React from "react";
import Image from "next/image";
import { getDirectusAssetUrl, type ShopItem } from "@/lib/directus";
import { Button } from "@/components/ui/button";

// Same source size as the team photo thumbnails: next/image only downscales, so
// this has to cover the widest rendered cell at 3x.
const IMAGE_WIDTH = 1600;
const IMAGE_HEIGHT = 1200;

export interface ShopItemCardProps {
  item: ShopItem;
}

/**
 * One Custom Ink campaign. Checkout happens on Custom Ink (it has no API or
 * embed), so the card's job is to show the design and send people there.
 */
export function ShopItemCard({ item }: ShopItemCardProps): React.JSX.Element {
  const imageSrc = getDirectusAssetUrl(item.image, {
    transforms: { width: IMAGE_WIDTH, height: IMAGE_HEIGHT, fit: "cover" },
  });

  return (
    <li className="card flex flex-col gap-3">
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={item.title}
          width={800}
          height={600}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="w-full rounded-lg border border-white/20 object-cover"
        />
      )}
      <div className="flex-1 space-y-1">
        <h2 className="text-lg font-semibold text-white">{item.title}</h2>
        {item.price_text && <p className="text-sm font-medium text-white/90">{item.price_text}</p>}
        {item.description && <p className="text-sm text-white/70">{item.description}</p>}
      </div>
      <Button asChild className="w-full">
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          Buy on Custom Ink
        </a>
      </Button>
    </li>
  );
}
