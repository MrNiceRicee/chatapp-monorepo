import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryProviders } from './api/QueryProviders.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryProviders>
      <App />
    </QueryProviders>
  </React.StrictMode>,
);
