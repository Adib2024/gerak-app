import React from 'react';
import { useApp } from '../context/AppContext';
import type { ActivePage } from '../context/AppContext';
import { Home, Car, ShoppingBag, ScrollText, UserCircle } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentPage, setCurrentPage, cart, activeRide, activeFoodOrder, jubahBooking } = useApp();

  if (currentPage === 'splash' || currentPage === 'login' || currentPage === 'register') {
    return null;
  }

  const items = [
    {
      id: 'dashboard' as ActivePage,
      label: 'Home',
      icon: Home,
      badge: false
    },
    {
      id: 'transport' as ActivePage,
      label: 'Ride',
      icon: Car,
      badge: activeRide !== null && activeRide.status !== 'completed'
    },
    {
      id: 'food' as ActivePage,
      label: 'Food',
      icon: ShoppingBag,
      badge: cart.length > 0 || (activeFoodOrder !== null && activeFoodOrder.status !== 'completed')
    },
    {
      id: 'jubah' as ActivePage,
      label: 'Jubah',
      icon: ScrollText,
      badge: jubahBooking !== null
    },
    {
      id: 'profile' as ActivePage,
      label: 'Profile',
      icon: UserCircle,
      badge: false
    }
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 px-2 py-2 flex items-center justify-around shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className="relative flex flex-col items-center justify-center py-1 px-3 min-w-[64px] transition-all duration-300 rounded-2xl active:scale-90"
            aria-label={item.label}
          >
            {/* Icon Wrapper with indicator */}
            <div className={`p-1.5 rounded-xl transition-all duration-300 relative ${
              isActive 
                ? 'bg-primary/10 text-primary scale-110' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}>
              <Icon className="w-5 h-5" />

              {/* Dynamic Notification Dot */}
              {item.badge && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white animate-ping" />
              )}
              {item.badge && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white" />
              )}
            </div>

            {/* Label */}
            <span className={`text-[10px] mt-1 font-bold transition-all duration-200 ${
              isActive ? 'text-primary scale-105' : 'text-slate-400'
            }`}>
              {item.label}
            </span>
            
            {/* Grab-like Active Pill line */}
            {isActive && (
              <span className="absolute bottom-0 w-4 h-0.75 bg-primary rounded-full animate-fade-in" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
