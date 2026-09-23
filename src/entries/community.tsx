import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CommunityPage } from '../pages/CommunityPage';
import '../index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CommunityPage />
  </StrictMode>
);
