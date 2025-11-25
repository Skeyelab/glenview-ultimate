'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { decode } from "blurhash";
import { cn } from "@/lib/utils";

export interface BlurhashImageProps extends Omit<React.ComponentProps<typeof Image>, "src" | "alt"> {
  src: string;
  alt: string;
  blurhash?: string | null;
  className?: string;
}

const BLURHASH_SIZE = 32; // Decode at small size for performance, then scale up

export function BlurhashImage({
  src,
  alt,
  blurhash,
  className,
  width,
  height,
  ...imageProps
}: BlurhashImageProps): React.JSX.Element {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [blurhashDataUrl, setBlurhashDataUrl] = useState<string | null>(null);

  // Decode blurhash to data URL
  useEffect(() => {
    if (!blurhash) {
      setBlurhashDataUrl(null);
      return;
    }

    try {
      // Decode blurhash at small size for performance
      const pixels = decode(blurhash, BLURHASH_SIZE, BLURHASH_SIZE);
      const canvas = document.createElement("canvas");
      canvas.width = BLURHASH_SIZE;
      canvas.height = BLURHASH_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setBlurhashDataUrl(null);
        return;
      }

      const imageData = ctx.createImageData(BLURHASH_SIZE, BLURHASH_SIZE);
      imageData.data.set(pixels);
      ctx.putImageData(imageData, 0, 0);

      const dataUrl = canvas.toDataURL();
      setBlurhashDataUrl(dataUrl);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("[BlurhashImage] Failed to decode blurhash:", error);
      setBlurhashDataUrl(null);
    }
  }, [blurhash]);

  const showBlurhash = blurhashDataUrl && !imageLoaded && !imageError;
  const showImage = src && !imageError;

  // Temporary debug logging
  useEffect(() => {
    if (blurhash) {
      // eslint-disable-next-line no-console
      console.log("[BlurhashImage] Blurhash received:", blurhash.substring(0, 30), "Decoded:", !!blurhashDataUrl);
    }
  }, [blurhash, blurhashDataUrl]);

  const containerStyle: React.CSSProperties = {};
  if (width) containerStyle.width = typeof width === "number" ? `${width}px` : width;
  if (height) containerStyle.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div className={cn("relative overflow-hidden", className)} style={containerStyle}>
      {/* Blurhash placeholder - background layer */}
      {blurhashDataUrl && (
        <img
          src={blurhashDataUrl}
          alt=""
          aria-hidden="true"
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            imageLoaded ? "opacity-0" : "opacity-100",
          )}
          style={{ imageRendering: "auto", zIndex: 0 }}
        />
      )}

      {/* Actual image - foreground layer */}
      {showImage && (
        <>
          {width && height ? (
            <Image
              src={src}
              alt={alt}
              width={typeof width === "number" ? width : undefined}
              height={typeof height === "number" ? height : undefined}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0",
                className,
              )}
              style={{ zIndex: 1 }}
              onLoad={() => {
                setImageLoaded(true);
              }}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
              {...imageProps}
            />
          ) : (
            <div className="absolute inset-0" style={{ zIndex: 1 }}>
              <Image
                src={src}
                alt={alt}
                fill
                className={cn(
                  "transition-opacity duration-300",
                  imageLoaded ? "opacity-100" : "opacity-0",
                  className,
                )}
                onLoad={() => {
                  setImageLoaded(true);
                }}
                onError={() => {
                  setImageError(true);
                  setImageLoaded(false);
                }}
                {...imageProps}
              />
            </div>
          )}
        </>
      )}

      {/* Fallback when no image and no blurhash */}
      {!showImage && !showBlurhash && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/10">
          <span className="text-white/60 text-xs text-center px-2">Image unavailable</span>
        </div>
      )}
    </div>
  );
}

