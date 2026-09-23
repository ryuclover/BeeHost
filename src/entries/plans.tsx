import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PlansPage } from '../pages/PlansPage';
import '../index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlansPage />
  </StrictMode>
);
