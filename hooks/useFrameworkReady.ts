import { useEffect } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    // `window` is not guaranteed on native Hermes; guard to avoid startup crashes.
    const maybeWindow =
      typeof globalThis !== 'undefined' ? (globalThis as { window?: Window }).window : undefined;

    maybeWindow?.frameworkReady?.();
  }, []);
}
