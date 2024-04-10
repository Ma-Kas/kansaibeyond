import '@mantine/core/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './components/Router';
import './styles/index.css';
import './styles/variables.css';
import './styles/editor.css';
import { MantineProvider } from '@mantine/core';
import { theme } from './theme';

// Handle runtime errors
const showErrorOverlay = (err: Event) => {
  const ErrorOverlay = customElements.get('vite-error-overlay');
  if (!ErrorOverlay) {
    return;
  }
  if (
    err instanceof ErrorEvent &&
    err.message ===
      'ResizeObserver loop completed with undelivered notifications.'
  ) {
    console.error(err);
    return;
  }
  const overlay = new ErrorOverlay(err);
  const body = document.body;
  if (body !== null) {
    body.appendChild(overlay);
  }
};

window.addEventListener('error', showErrorOverlay);
window.addEventListener('unhandledrejection', ({ reason }) =>
  showErrorOverlay(reason as Event)
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Router />
    </MantineProvider>
  </React.StrictMode>
);
