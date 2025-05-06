import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  const errorMessage = document.createElement('div');
  errorMessage.className = 'text-red-500 font-body p-4';
  errorMessage.textContent = 'Failed to find the root element.';
  document.body.appendChild(errorMessage);
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Rendering failed:', error);
    if (rootElement instanceof HTMLElement) {
        rootElement.innerHTML = '<div class="text-red-500 font-body p-4">Rendering failed. Please check the console for errors.</div>';
    }
  }
}