'use client';

import React from "react";
import Turnstile, { type BoundTurnstileObject } from "react-turnstile";

import { cn } from "@/lib/utils";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export interface TurnstileFieldHandle {
  reset: () => void;
}

interface TurnstileFieldProps {
  className?: string;
  onTokenChange: (token: string | null) => void;
  statusMessage?: string | null;
}

export const TurnstileField = React.forwardRef<TurnstileFieldHandle, TurnstileFieldProps>(
  ({ className, onTokenChange, statusMessage }, ref): React.JSX.Element => {
    const boundRef = React.useRef<BoundTurnstileObject | null>(null);
    const [internalMessage, setInternalMessage] = React.useState<string | null>(null);

    React.useImperativeHandle(
      ref,
      () => ({
        reset: () => {
          boundRef.current?.reset();
          setInternalMessage(null);
          onTokenChange(null);
        },
      }),
      [onTokenChange],
    );

    React.useEffect(() => {
      if (!SITE_KEY) {
        setInternalMessage("Verification is unavailable. Please contact us to register.");
      }
    }, []);

    if (!SITE_KEY) {
      return (
        <div className={cn("card", className)}>
          <p className="text-sm text-amber-200">
            Verification is temporarily unavailable. Please email us if you continue to see this message.
          </p>
        </div>
      );
    }

    return (
      <div className={cn("card grid gap-2", className)}>
        <label className="label">Verification</label>
        <Turnstile
          sitekey={SITE_KEY}
          onLoad={(_, bound) => {
            boundRef.current = bound;
            setInternalMessage(null);
          }}
          onSuccess={(token) => {
            setInternalMessage(null);
            onTokenChange(token);
          }}
          onError={() => {
            setInternalMessage("Verification failed. Please retry.");
            boundRef.current?.reset();
            onTokenChange(null);
          }}
          onExpire={() => {
            setInternalMessage("Verification expired. Please try again.");
            boundRef.current?.reset();
            onTokenChange(null);
          }}
          retry="auto"
          refreshExpired="auto"
          appearance="interaction-only"
        />
        <p className="text-xs text-white/60">
          Protected by{" "}
          <a href="https://www.cloudflare.com/products/turnstile/" target="_blank" rel="noreferrer" className="underline">
            Cloudflare Turnstile
          </a>
        </p>
        {(statusMessage ?? internalMessage) && (
          <p className="text-sm text-red-300">{statusMessage ?? internalMessage}</p>
        )}
      </div>
    );
  },
);

TurnstileField.displayName = "TurnstileField";


