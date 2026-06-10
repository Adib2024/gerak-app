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

const isIosSafari = (): boolean => {
  const ua = window.navigator.userAgent;
  const isIos = /iphone|ipad|ipod/i.test(ua);
  const isSafari = /safari/i.test(ua) && !/crios|fxios|opios|edgios/i.test(ua);
  const isStandalone = ('standalone' in window.navigator) && (window.navigator as any).standalone === true;
  return isIos && isSafari && !isStandalone;
};

const InstallButton: React.FC = () => {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Chrome/Android/Desktop install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));

    // iOS Safari — show guide banner after short delay
    if (isIosSafari()) {
      const timer = setTimeout(() => setShowIosGuide(true), 2000);
      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
        clearTimeout(timer);
      };
    }
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

  // iOS Safari guide banner
  if (showIosGuide && !dismissed) {
    return (
      <div className="fixed bottom-6 left-3 right-3 z-[9999] bg-slate-900 text-white rounded-2xl p-4 shadow-2xl flex gap-3 items-start animate-slide-up">
        <div className="text-2xl shrink-0">📲</div>
        <div className="flex-1">
          <p className="text-sm font-bold leading-tight">Install gerak on your iPhone</p>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Tap <span className="bg-slate-700 rounded px-1.5 py-0.5 font-bold">Share</span> <span className="text-slate-400">↑</span> then <span className="bg-slate-700 rounded px-1.5 py-0.5 font-bold">Add to Home Screen</span>
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white text-lg font-bold shrink-0 -mt-1"
        >
          ✕
        </button>
      </div>
    );
  }

  // Chrome/Android/Desktop button
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
