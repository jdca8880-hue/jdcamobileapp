import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import { initSentry, captureException } from './lib/sentry';

// Must run before any component mounts so bootup errors are captured too.
initSentry();

// Register PWA service worker and automatically force updates when a new deployment occurs
const updateSW = registerSW({
  onNeedRefresh() {
    // Force the new service worker to take control and reload the page instantly
    updateSW(true);
  },
  onOfflineReady() {
    console.log('JDCA Application is ready to work offline.');
  }
});

import { ErrorBoundary } from './components/ui/ErrorBoundary';

window.addEventListener('error', (e) => {
  console.error('[Global Error]', e.error || e.message);
  captureException(e.error || new Error(e.message), { source: 'window.error' });
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('[Unhandled Rejection]', e.reason);
  captureException(e.reason || new Error('Unhandled promise rejection'), { source: 'unhandledrejection' });
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
