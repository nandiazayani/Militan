
import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Corrected import to point to the App component, which will now be correctly resolved as a module by omitting the file extension.
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);