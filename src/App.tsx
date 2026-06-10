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

const isIos = (): boolean => /iphone|ipad|ipod/i.test(window.navigator.userAgent);
const isInStandaloneMode = (): boolean =>
  ('standalone' in window.navigator) && (window.navigator as any).standalone === true;

const InstallButton: React.FC = () => {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIosSheet, setShowIosSheet] = useState(false);

  const iosDevice = isIos();
  const alreadyInstalled = isInStandaloneMode();

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
    if (iosDevice) {
      setShowIosSheet(true);
      return;
    }
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === 'accepted') {
      setInstallEvent(null);
      setInstalled(true);
    }
  };

  // Hide if already installed as standalone
  if (alreadyInstalled || installed) return null;

  // Hide on non-iOS if no install prompt available
  if (!iosDevice && !installEvent) return null;

  return (
    <>
      {/* Install App pill button — top left, always visible on iOS */}
      <button
        onClick={handleInstall}
        className="fixed top-4 left-4 z-[9999] flex items-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold text-sm px-4 py-2 rounded-full shadow-md active:scale-95 transition"
      >
        <Download className="w-4 h-4" />
        Install App
      </button>

      {/* iOS instruction bottom sheet */}
      {showIosSheet && (
        <div
          className="fixed inset-0 z-[9998] bg-black/50 flex items-end justify-center"
          onClick={() => setShowIosSheet(false)}
        >
          <div
            className="w-full bg-white rounded-t-3xl p-6 pb-10 shadow-2xl animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
            <h3 className="text-base font-black text-slate-800 mb-4 text-center">
              Install gerak on your iPhone
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl shrink-0">1</div>
                <p className="text-sm text-slate-700 font-medium">
                  Tap the <span className="font-black">Share</span> button{' '}
                  <span className="inline-block bg-slate-200 rounded px-2 py-0.5 text-base">⬆</span>{' '}
                  at the bottom of Safari
                </p>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl shrink-0">2</div>
                <p className="text-sm text-slate-700 font-medium">
                  Scroll down and tap{' '}
                  <span className="font-black">"Add to Home Screen"</span>
                </p>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl shrink-0">3</div>
                <p className="text-sm text-slate-700 font-medium">
                  Tap <span className="font-black">"Add"</span> — gerak will appear on your home screen
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowIosSheet(false)}
              className="mt-5 w-full bg-slate-900 text-white font-bold py-3 rounded-2xl text-sm"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
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
