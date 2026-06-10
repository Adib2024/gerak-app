import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Car, GraduationCap, Soup, ArrowRight, Sparkles, Megaphone } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, setCurrentPage, activeRide, activeFoodOrder } = useApp();
  const [activeBanner, setActiveBanner] = useState(0);

  const banners = [
    {
      title: 'Convocation Gowns 2026',
      subtitle: 'Size reservations are now active. Select dimensions and choose dorm drop-off delivery.',
      tag: 'JUBAH RENTAL',
      color: 'from-blue-600 to-indigo-500'
    },
    {
      title: 'GerakPay 10% Cashback!',
      subtitle: 'Top up RM50.00 or more in your GerakPay wallet to receive immediate bonus campus points.',
      tag: 'PROMO',
      color: 'from-emerald-600 to-teal-500'
    },
    {
      title: 'Campus Food Express',
      subtitle: 'Enjoy RM3.00 flat delivery fees across all college dormitories. Browse local stalls now.',
      tag: 'FOOD DEAL',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  // Auto-rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="flex-grow bg-slate-50/50 overflow-y-auto no-scrollbar pb-6 px-4 animate-fade-in">
      
      {/* 1. Student Greeting Panel */}
      <div className="mt-4 mb-4 bg-gradient-to-r from-emerald-800 to-emerald-600 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute right-12 -top-12 w-20 h-20 bg-white/10 rounded-full blur-lg pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-xs border border-white/20 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase">
            <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-spin" />
            Verified Campus Account
          </div>
          <span className="text-[10px] text-emerald-200 font-extrabold tracking-widest">{user.matricNo}</span>
        </div>

        <h2 className="text-xl font-bold font-heading m-0 leading-none">
          Hello, {user.name}!
        </h2>
        <p className="text-xs text-emerald-100/80 font-medium mt-1 mb-3">
          Where would you like to gerak today?
        </p>

        {/* Quick balance display */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/15 relative z-10">
          <div 
            onClick={() => setCurrentPage('profile')}
            className="cursor-pointer active:scale-95 transition bg-white/10 rounded-2xl p-2.5 flex flex-col hover:bg-white/15"
          >
            <span className="text-[9px] text-emerald-200 font-bold uppercase tracking-wider">GerakPay Balance</span>
            <span className="text-lg font-black mt-0.5">RM{user.balance.toFixed(2)}</span>
          </div>
          <div 
            onClick={() => setCurrentPage('profile')}
            className="cursor-pointer active:scale-95 transition bg-white/10 rounded-2xl p-2.5 flex flex-col hover:bg-white/15"
          >
            <span className="text-[9px] text-emerald-200 font-bold uppercase tracking-wider">Campus Rewards</span>
            <span className="text-lg font-black mt-0.5">{user.points} pts</span>
          </div>
        </div>
      </div>

      {/* 2. Floating Tickers for Active Tasks */}
      {(activeRide !== null && activeRide.status !== 'completed') && (
        <div 
          onClick={() => setCurrentPage('transport')}
          className="mb-4 bg-blue-50 border border-blue-100 hover:bg-blue-100/50 rounded-2xl p-3 shadow-md flex items-center justify-between cursor-pointer animate-pulse-glow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-md">
              <Car className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="text-[10px] text-blue-600 font-extrabold uppercase tracking-wider">Active Shuttle Booking</div>
              <div className="text-xs font-black text-slate-800">
                {activeRide.status === 'searching' && 'Searching for Driver'}
                {activeRide.status === 'assigned' && 'Driver Assigned'}
                {activeRide.status === 'arriving' && 'Driver is Arriving'}
                {activeRide.status === 'active' && 'Trip In Progress'}
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-blue-500" />
        </div>
      )}

      {(activeFoodOrder !== null && activeFoodOrder.status !== 'completed') && (
        <div 
          onClick={() => setCurrentPage('food')}
          className="mb-4 bg-amber-50 border border-amber-100 hover:bg-amber-100/50 rounded-2xl p-3 shadow-md flex items-center justify-between cursor-pointer animate-pulse-glow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Soup className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="text-[10px] text-amber-600 font-extrabold uppercase tracking-wider">Active Meal Delivery</div>
              <div className="text-xs font-black text-slate-800">
                {activeFoodOrder.status === 'placed' && 'Order Placed'}
                {activeFoodOrder.status === 'preparing' && 'Kitchen Preparing'}
                {activeFoodOrder.status === 'delivering' && 'Rider on the Way'}
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-500" />
        </div>
      )}

      {/* 3. Sliding Banner Carousel */}
      <div className="mb-6 relative overflow-hidden rounded-3xl h-28 bg-slate-800 shadow-md">
        {banners.map((ban, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-gradient-to-tr ${ban.color} p-4 text-white flex flex-col justify-between transition-all duration-500 ${
              idx === activeBanner ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-95 translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="bg-white/20 backdrop-blur-xs border border-white/25 rounded-md px-1.5 py-0.5 text-[8px] font-extrabold tracking-widest uppercase">
                {ban.tag}
              </span>
              <Megaphone className="w-3.5 h-3.5 opacity-80" />
            </div>
            <div>
              <h4 className="text-sm font-black font-heading leading-tight m-0">{ban.title}</h4>
              <p className="text-[9px] text-white/80 font-medium leading-tight mt-0.5 line-clamp-2">
                {ban.subtitle}
              </p>
            </div>
          </div>
        ))}

        {/* Carousel indicators */}
        <div className="absolute bottom-2 right-4 flex gap-1 z-10">
          {banners.map((_, idx) => (
            <span
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === activeBanner ? 'w-3 bg-white' : 'w-1 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 4. Large Service Cards (Grid) */}
      <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3 pl-1">
        Campus Modules
      </h3>

      <div className="flex flex-col gap-4">
        
        {/* A. Transportation Module */}
        <div 
          onClick={() => setCurrentPage('transport')}
          className="group relative bg-white border border-slate-100 rounded-3xl p-5 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md active:scale-[0.99] transition duration-200"
        >
          {/* Accent vertical left-border */}
          <div className="absolute left-0 top-6 bottom-6 w-1 bg-primary rounded-r-lg group-hover:scale-y-110 transition duration-300" />
          
          <div className="flex items-center gap-4 pl-1">
            {/* Emerald Icon Frame */}
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition duration-300">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-800 m-0">Gerak Car</h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Book point-to-point campus travel. Live path tracking.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition" />
        </div>

        {/* B. Jubah Delivery Module */}
        <div 
          onClick={() => setCurrentPage('jubah')}
          className="group relative bg-white border border-slate-100 rounded-3xl p-5 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md active:scale-[0.99] transition duration-200"
        >
          <div className="absolute left-0 top-6 bottom-6 w-1 bg-blue-500 rounded-r-lg group-hover:scale-y-110 transition duration-300" />
          
          <div className="flex items-center gap-4 pl-1">
            {/* Sky Blue Icon Frame */}
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition duration-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-800 m-0">Jubah Delivery</h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Convocation robe size calculator, deliveries & returns.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition" />
        </div>

        {/* C. Food Delivery Module */}
        <div 
          onClick={() => setCurrentPage('food')}
          className="group relative bg-white border border-slate-100 rounded-3xl p-5 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md active:scale-[0.99] transition duration-200"
        >
          <div className="absolute left-0 top-6 bottom-6 w-1 bg-amber-500 rounded-r-lg group-hover:scale-y-110 transition duration-300" />
          
          <div className="flex items-center gap-4 pl-1">
            {/* Amber Icon Frame */}
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition duration-300">
              <Soup className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-800 m-0">Campus Cafeteria</h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Browse student cafe menus and order quick delivery.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition" />
        </div>

      </div>

      {/* 5. Campus Fast Stats HUD */}
      <div className="mt-6 bg-slate-100/50 border border-slate-200/40 rounded-2xl p-4 grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[16px] font-black text-slate-700">12</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Active Shuttles</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center border-x border-slate-200">
          <span className="text-[16px] font-black text-slate-700">4 min</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Avg Shuttle ETA</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[16px] font-black text-slate-700">22</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Stalls Open</span>
        </div>
      </div>
    </div>
  );
};
