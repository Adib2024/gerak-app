import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, ChevronLeft } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentPage, setCurrentPage, goBack, canGoBack, notifications, user } = useApp();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (currentPage === 'splash' || currentPage === 'login' || currentPage === 'register') {
    return null;
  }

  return (
    <>
      <header
        className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-sm"
        style={{ paddingTop: 'calc(0.75rem + env(safe-area-inset-top))' }}
      >
        {/* Left: Back button (when available) + Branding */}
        <div className="flex items-center gap-1">
          {canGoBack && (
            <button
              onClick={goBack}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 active:scale-90 transition text-slate-600 mr-0.5"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        <div
          className="flex items-center gap-2 cursor-pointer transition active:scale-95"
          onClick={() => {
            if (user.role === 'driver') setCurrentPage('driver-home');
            else if (user.role === 'admin' || user.role === 'superadmin') setCurrentPage('admin-home');
            else setCurrentPage('dashboard');
          }}
        >
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-800 m-0 leading-none" style={{ fontFamily: 'Prata, serif' }}>
              ger<span style={{ color: '#EF4444' }}>a</span>k
            </h1>
            <span className="text-[10px] text-slate-800 font-bold tracking-wider">
              Smart Campus
            </span>
          </div>
        </div>
        </div>

        {/* Right: Points & Notifications */}
        <div className="flex items-center gap-2">

          {/* Notification Bell */}
          <button 
            onClick={() => setCurrentPage('notifications')}
            className="relative p-2 text-slate-600 hover:text-primary rounded-full hover:bg-slate-50 transition active:scale-90"
            aria-label="Inbox"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>
    </>
  );
};
