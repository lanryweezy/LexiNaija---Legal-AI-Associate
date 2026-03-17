import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

let isInitialized = false;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.1, // 10% sampling for performance traces
    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% sampling for session replays
    replaysOnErrorSampleRate: 1.0, // 100% sampling for error replays
    // Environment
    environment: import.meta.env.MODE || 'development',
    // Release tracking
    release: import.meta.env.VITE_APP_VERSION || 'development',
    // Ignore specific errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'chrome-extension://',
      'moz-extension://',
      // Network errors
      'NetworkError',
      'Network request failed',
      // Random plugins/extensions
      'atomicFindClose',
      'fb_xd_fragment',
      // Other plugins
      'CanvasRenderingContext2D',
    ],
    // Deny specific URLs
    denyUrls: [
      // Chrome extensions
      /extensions\//i,
      /^chrome:\/\//i,
      // Firefox extensions
      /^moz-extension:\/\//i,
      // Facebook flake
      /connect\.facebook\.net\/en_US\/all\.js/i,
    ],
  });
  isInitialized = true;
}

export const captureException = (error: Error, context?: { tags?: Record<string, string>; extra?: Record<string, any> }) => {
  if (!isInitialized) {
    console.error('[Sentry Disabled]', error);
    return;
  }
  
  if (context?.tags) {
    Sentry.setTags(context.tags);
  }
  if (context?.extra) {
    Sentry.setExtras(context.extra);
  }
  Sentry.captureException(error);
};

export const captureMessage = (message: string, level?: Sentry.SeverityLevel) => {
  if (!isInitialized) {
    console.log('[Sentry Disabled]', message);
    return;
  }
  Sentry.captureMessage(message, level);
};

export const setContext = (name: string, context: Record<string, any>) => {
  if (!isInitialized) return;
  Sentry.setContext(name, context);
};

export const setUser = (user: { id?: string; email?: string; username?: string } | null) => {
  if (!isInitialized) return;
  Sentry.setUser(user);
};

export const startSpan = (name: string, callback: () => void) => {
  if (!isInitialized) {
    callback();
    return;
  }
  Sentry.startSpan({ name }, callback);
};

export const addBreadcrumb = (breadcrumb: Sentry.Breadcrumb) => {
  if (!isInitialized) return;
  Sentry.addBreadcrumb(breadcrumb);
};

export default Sentry;
