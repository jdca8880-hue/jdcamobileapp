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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
    captureException(error, { componentStack: errorInfo?.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', fontFamily: 'sans-serif' }}>
          <h2>Something went wrong.</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '12px' }}>
            {this.state.error && this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

window.addEventListener('error', (e) => {
  captureException(e.error || new Error(e.message), { source: 'window.error' });
  document.body.innerHTML = `<div style="padding:20px;color:red;">Global Error: ${e.message}<br/><pre>${e.error?.stack}</pre></div>`;
});

window.addEventListener('unhandledrejection', (e) => {
  captureException(e.reason || new Error('Unhandled promise rejection'), { source: 'unhandledrejection' });
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
