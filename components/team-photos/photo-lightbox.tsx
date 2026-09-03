'use client';

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export interface LightboxPhoto {
  id: number;
  title: string | null;
  thumbSrc: string;
  fullSrc: string;
  alt: string;
}

export interface PhotoLightboxProps {
  photos: readonly LightboxPhoto[];
}

/**
 * Grid of photos that open full size in an overlay.
 *
 * Deliberately not a native <dialog>: jsdom does not implement showModal, so
 * every behaviour here would be untestable. This hand-rolls the parts that
 * matter - focus in on open, focus back on close, Escape, arrow keys.
 *
 * Both image URLs are built on the server and passed in, because
 * getDirectusAssetUrl inlines an access token server-side and a client
 * component cannot reproduce that without a hydration mismatch.
 */
export function PhotoLightbox({ photos }: PhotoLightboxProps): React.JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex === null ? null : photos[openIndex];

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastOpenedFrom = useRef<number | null>(null);

  const close = useCallback(() => {
    setOpenIndex(null);
    // Send focus back where it came from, or a keyboard user lands at the top
    // of the document with no idea where they were.
    const origin = lastOpenedFrom.current;
    if (origin !== null) triggerRefs.current[origin]?.focus();
  }, []);

  // Wraps in both directions so the arrows never dead-end mid-gallery.
  const step = useCallback((delta: number) => {
    setOpenIndex((current) => (current === null ? null : (current + delta + photos.length) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (openIndex === null) return;
    dialogRef.current?.focus();
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) return;
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); };
  }, [openIndex, close, step]);

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, index) => (
          <li key={photo.id} className="space-y-2">
            <button
              type="button"
              aria-label={`View larger: ${photo.alt}`}
              className="block w-full overflow-hidden rounded-lg border border-white/20 transition hover:border-white/50 focus-visible:border-white/70"
              ref={(el) => { triggerRefs.current[index] = el; }}
              onClick={() => { lastOpenedFrom.current = index; setOpenIndex(index); }}
            >
              <Image
                src={photo.thumbSrc}
                alt={photo.alt}
                width={800}
                height={600}
                className="h-full w-full object-cover"
              />
            </button>
            {photo.title && <p className="text-sm text-white/80">{photo.title}</p>}
          </li>
        ))}
      </ul>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          ref={dialogRef}
          tabIndex={-1}
          onClick={(event) => { if (event.target === event.currentTarget) close(); }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-brand-green/95 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute right-4 top-4 rounded-full border border-white/30 px-3 py-1 text-xl leading-none text-white hover:bg-white/10"
          >
            ×
          </button>

          <div className="flex w-full max-w-6xl items-center gap-2 sm:gap-4">
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => { step(-1); }}
              className="shrink-0 rounded-full border border-white/30 px-3 py-2 text-2xl leading-none text-white hover:bg-white/10"
            >
              ‹
            </button>
            {/* Plain img on purpose: the photo's intrinsic aspect ratio is
                unknown here and object-contain must letterbox it. */}
            <img
              src={active.fullSrc}
              alt={active.alt}
              className="max-h-[75vh] w-full rounded-lg object-contain"
            />
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => { step(1); }}
              className="shrink-0 rounded-full border border-white/30 px-3 py-2 text-2xl leading-none text-white hover:bg-white/10"
            >
              ›
            </button>
          </div>

          {active.title && <p className="text-center text-white/90">{active.title}</p>}
          <p className="text-sm text-white/70">{(openIndex ?? 0) + 1} of {photos.length}</p>
        </div>
      )}
    </>
  );
}
