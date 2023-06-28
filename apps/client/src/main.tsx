import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryProviders } from './api/QueryProviders.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryProviders>
      <Suspense>
        <App />
      </Suspense>
    </QueryProviders>
  </React.StrictMode>,
);
