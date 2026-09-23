import { useEffect, useState } from 'react';
import { HomePage } from './pages/HomePage';
import { GamesPage } from './pages/GamesPage';
import { PlansPage } from './pages/PlansPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { CommunityPage } from './pages/CommunityPage';
import { SupportPage } from './pages/SupportPage';

export function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (currentPath === '/games' || currentPath.endsWith('games.html')) {
    return <GamesPage />;
  }
  if (currentPath === '/plans' || currentPath.endsWith('plans.html')) {
    return <PlansPage />;
  }
  if (currentPath === '/features' || currentPath.endsWith('features.html')) {
    return <FeaturesPage />;
  }
  if (currentPath === '/community' || currentPath.endsWith('community.html')) {
    return <CommunityPage />;
  }
  if (currentPath === '/support' || currentPath.endsWith('support.html')) {
    return <SupportPage />;
  }

  return <HomePage />;
}

export default App;
