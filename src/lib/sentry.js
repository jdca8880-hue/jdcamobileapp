// Sentry wiring. Lives in its own module so main.jsx stays small and so the
// SyncService can report permanent failures without pulling React in.
//
// Enabled only when VITE_SENTRY_DSN is set at build time. If the env var is
// missing (e.g. local dev without an account), initSentry is a no-op and the
// captureException helper does nothing — the app works unchanged.
import * as Sentry from '@sentry/react';

let initialized = false;

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn || initialized) return;
  const env = import.meta.env.MODE || 'production';
  Sentry.init({
    dsn,
    environment: env,
    // Keep traces off by default on the free tier — error events only.
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    beforeSend(event) {
      // Scrub Supabase JWTs if they end up in any extra context by accident.
      if (event.extra) {
        for (const k of Object.keys(event.extra)) {
          const v = event.extra[k];
          if (typeof v === 'string' && v.startsWith('eyJ')) event.extra[k] = '[redacted]';
        }
      }
      return event;
    }
  });
  initialized = true;
}

export function captureException(err, context = {}) {
  if (!initialized) return;
  try {
    Sentry.captureException(err, { extra: context });
  } catch { /* never let Sentry itself crash the app */ }
}

export function captureMessage(message, context = {}) {
  if (!initialized) return;
  try {
    Sentry.captureMessage(message, { level: 'warning', extra: context });
  } catch {}
}

// Pass-through for the ErrorBoundary HOC. If Sentry isn't initialized the
// consumer falls back to its own boundary.
export const SentryErrorBoundary = Sentry.ErrorBoundary;
export const withSentryProfiler = Sentry.withProfiler;
