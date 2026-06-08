import React from 'react';
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
      {/* Header (automatically handles page-specific visibility internally) */}
      <Header />
      
      {/* Active Scrollable Page Screen viewport */}
      {renderPage()}
      
      {/* Footer bottom navigation bar (automatically handles page-specific visibility internally) */}
      <BottomNav />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
