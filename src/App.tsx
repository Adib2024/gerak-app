import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SplashScreen } from './pages/SplashScreen';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Transport } from './pages/Transport';
import { Jubah } from './pages/Jubah';
import { Food } from './pages/Food';
import { Profile } from './pages/Profile';
import { NotificationsPage } from './pages/NotificationsPage';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallButton: React.FC = () => {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === 'accepted') {
      setInstallEvent(null);
      setInstalled(true);
    }
  };

  if (!installEvent || installed) return null;

  return (
    <button
      onClick={handleInstall}
      className="fixed top-4 left-4 z-[9999] flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm px-4 py-2 rounded-full shadow-md transition active:scale-95"
    >
      <Download className="w-4 h-4" />
      Install App
    </button>
  );
};

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'splash':
        return <SplashScreen />;
      case 'login':
        return <Login />;
      case 'register':
        return <Register />;
      case 'dashboard':
        return <Dashboard />;
      case 'transport':
        return <Transport />;
      case 'jubah':
        return <Jubah />;
      case 'food':
        return <Food />;
      case 'profile':
        return <Profile />;
      case 'notifications':
        return <NotificationsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="mobile-container flex flex-col h-full bg-white select-none">
      <Header />
      {renderPage()}
      <BottomNav />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <InstallButton />
      <AppContent />
    </AppProvider>
  );
}

export default App;
