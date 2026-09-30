import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClientDashboardPage } from '../pages/ClientDashboardPage';
import '../index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClientDashboardPage />
  </StrictMode>
);
