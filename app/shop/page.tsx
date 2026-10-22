import React from "react";
import { getShopItems } from "@/lib/directus";
import { SHOP_STORE_URL } from "@/lib/constants";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { ShopItemCard } from "@/components/shop/shop-item-card";

export const dynamic = 'force-dynamic'; // @NextJS

export default async function ShopPage(): Promise<React.JSX.Element> {
  const items = await getShopItems();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shop"
        description="Glenview Ultimate gear. Orders are handled by Custom Ink and every purchase supports the club."
      />

      {items.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => <ShopItemCard key={item.id} item={item} />)}
        </ul>
      ) : (
        <section className="notice">
          <p className="text-white/90 text-sm">
            <strong>Note:</strong> Our current designs are on our Custom Ink store.
          </p>
        </section>
      )}

      {/* Always rendered, so the page is never a dead end even before any
          ShopItems exist. That is why Shop needs no content gate in the nav. */}
      <div className="flex justify-center">
        <Button asChild variant="secondary">
          <a href={SHOP_STORE_URL} target="_blank" rel="noopener noreferrer">
            Browse the full store
          </a>
        </Button>
      </div>
    </div>
  );
}
