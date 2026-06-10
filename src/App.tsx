import React, { useEffect, useRef, useState } from 'react';
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

const SwipeBackGesture: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { goBack, canGoBack } = useApp();

  const [renderDragX, setRenderDragX] = useState(0);
  const dragXRef    = useRef(0);
  const isDragRef   = useRef(false);
  const startXRef   = useRef(0);
  const startYRef   = useRef(0);
  const dirLockRef  = useRef<'h' | 'v' | null>(null);
  const canGoBackRef = useRef(canGoBack);
  const goBackRef    = useRef(goBack);

  useEffect(() => { canGoBackRef.current = canGoBack; }, [canGoBack]);
  useEffect(() => { goBackRef.current = goBack; }, [goBack]);

  const EDGE    = 40;  // px from left edge to start gesture
  const TRIGGER = 90;  // px drag distance to trigger back

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startXRef.current  = t.clientX;
      startYRef.current  = t.clientY;
      isDragRef.current  = t.clientX < EDGE && canGoBackRef.current;
      dirLockRef.current = null;
      dragXRef.current   = 0;
    };

    const onMove = (e: TouchEvent) => {
      if (!isDragRef.current) return;
      const t  = e.touches[0];
      const dx = t.clientX - startXRef.current;
      const dy = Math.abs(t.clientY - startYRef.current);

      if (!dirLockRef.current) {
        if (Math.abs(dx) > 6 || dy > 6) {
          dirLockRef.current = Math.abs(dx) >= dy ? 'h' : 'v';
        } else return;
      }
      if (dirLockRef.current === 'v') { isDragRef.current = false; return; }

      if (dx > 0) {
        dragXRef.current = Math.min(dx, window.innerWidth * 0.85);
        setRenderDragX(dragXRef.current);
        e.preventDefault();
      }
    };

    const onEnd = () => {
      if (!isDragRef.current) return;
      isDragRef.current = false;
      if (dragXRef.current >= TRIGGER) goBackRef.current();
      dragXRef.current = 0;
      setRenderDragX(0);
    };

    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove',  onMove,  { passive: false });
    window.addEventListener('touchend',   onEnd,   { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove',  onMove);
      window.removeEventListener('touchend',   onEnd);
    };
  }, []);

  const progress = Math.min(renderDragX / TRIGGER, 1);
  const dragging = renderDragX > 0;

  return (
    <>
      {/* Shadow layer revealed behind the sliding page */}
      {dragging && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9990,
            background: `linear-gradient(to right, rgba(0,0,0,0.08), rgba(0,0,0,0.18))`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Sliding page */}
      <div
        style={{
          transform: dragging ? `translateX(${renderDragX}px)` : 'translateX(0)',
          transition: dragging ? 'none' : 'transform 0.28s cubic-bezier(0.25,0.46,0.45,0.94)',
          position: 'relative', zIndex: 9991,
        }}
      >
        {children}
      </div>

      {/* Back arrow circle that floats on left edge */}
      {dragging && (
        <div
          style={{
            position: 'fixed',
            left: Math.max(8, renderDragX - 30),
            top: '50%',
            transform: `translateY(-50%) scale(${0.55 + progress * 0.45})`,
            width: 44, height: 44,
            borderRadius: '50%',
            background: progress >= 1 ? '#0f172a' : 'rgba(255,255,255,0.96)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 99999, pointerEvents: 'none',
            transition: 'background 0.15s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke={progress >= 1 ? 'white' : '#1e293b'}
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
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
      <SwipeBackGesture>
        <AppContent />
      </SwipeBackGesture>
    </AppProvider>
  );
}

export default App;
