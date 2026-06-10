import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Wallet, Award, Plus } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, currentPage, setCurrentPage, notifications, topUpWallet } = useApp();
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('10');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleQuickTopUp = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const val = parseFloat(topUpAmount);
    if (!isNaN(val) && val > 0) {
      topUpWallet(val);
      setShowTopUp(false);
    }
  };

  if (currentPage === 'splash' || currentPage === 'login' || currentPage === 'register') {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-sm">
        {/* Left: Branding */}
        <div 
          className="flex items-center gap-2 cursor-pointer transition active:scale-95"
          onClick={() => setCurrentPage('dashboard')}
        >
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-primary/20" style={{ color: '#0f172a' }}>
            g
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-800 m-0 leading-none" style={{ fontFamily: 'Prata, serif' }}>
              ger<span style={{ color: '#38bdf8' }}>a</span>k
            </h1>
            <span className="text-[10px] text-primary font-bold tracking-wider uppercase">
              Smart Campus
            </span>
          </div>
        </div>

        {/* Right: Wallet, Points & Notifications */}
        <div className="flex items-center gap-2">
          {/* GerakPay Wallet Pill */}
          <div 
            onClick={() => setShowTopUp(true)}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-primary-light border border-slate-100 hover:border-primary/20 rounded-full px-2.5 py-1 cursor-pointer transition duration-200"
            title="Top Up GerakPay"
          >
            <Wallet className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-slate-700">
              RM{user.balance.toFixed(2)}
            </span>
            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white">
              <Plus className="w-3 h-3" />
            </div>
          </div>

          {/* Reward Points Pill */}
          <div 
            onClick={() => setCurrentPage('profile')}
            className="hidden sm:flex items-center gap-1 bg-amber-50 border border-amber-100 rounded-full px-2 py-1 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-extrabold text-amber-700">
              {user.points} pts
            </span>
          </div>

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

      {/* Modern Pop-Up Dialog for Top-Up Simulator */}
      {showTopUp && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-fade-in">
          <div 
            className="w-full bg-white rounded-t-3xl p-6 shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary animate-bounce" />
                GerakPay Top Up
              </h3>
              <button 
                onClick={() => setShowTopUp(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                Close
              </button>
            </div>
            
            <p className="text-xs text-slate-500 mb-4">
              Deducts from mock bank credentials. Instant simulator credited to student account.
            </p>

            <form onSubmit={handleQuickTopUp}>
              {/* Presets */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {['10', '20', '50', '100'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-2 rounded-xl text-sm font-extrabold border transition ${
                      topUpAmount === amt 
                        ? 'border-primary bg-primary-light text-primary' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    RM{amt}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">RM</span>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-lg font-extrabold text-slate-800 focus:outline-none focus:border-primary focus:bg-white"
                  placeholder="0.00"
                  min="1"
                  max="1000"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover active:scale-[0.99] text-white font-extrabold py-3 rounded-xl shadow-lg shadow-primary/20 transition"
              >
                Confirm Top Up RM{parseFloat(topUpAmount || '0').toFixed(2)}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
