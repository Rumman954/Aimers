"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, unknown>
          ) => void;
        };
      };
    };
  }
}

type GoogleSignInButtonProps = {
  onCredential: (credential: string) => Promise<void>;
  onError?: (message: string) => void;
};

export function GoogleSignInButton({
  onCredential,
  onError,
}: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !buttonRef.current) return;

    const init = () => {
      if (!window.google || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            await onCredential(response.credential);
          } catch (err) {
            onError?.(
              err instanceof Error ? err.message : "Google sign-in failed"
            );
          }
        },
      });
      buttonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        shape: "rectangular",
        text: "continue_with",
        width: 320,
      });
      setReady(true);
    };

    const existing = document.getElementById("google-gsi");
    if (existing && window.google) {
      init();
      return;
    }

    const script = document.createElement("script");
    script.id = "google-gsi";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = init;
    document.body.appendChild(script);
  }, [clientId, onCredential, onError]);

  if (!clientId) {
    return (
      <p className="rounded-[var(--aimers-radius)] border border-dashed border-aimers-border px-3 py-3 text-center text-xs text-aimers-muted">
        Google login is ready in code. Add your Client ID to enable the button
        (see Auth setup in README).
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-2">
      {!ready ? (
        <p className="text-xs text-aimers-muted">Loading Google…</p>
      ) : null}
      <div ref={buttonRef} className="flex min-h-[40px] w-full justify-center" />
    </div>
  );
}
