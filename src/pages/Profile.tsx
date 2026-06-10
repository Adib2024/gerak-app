import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, Wallet, ArrowUpRight, LogOut, Heart, Sparkles, HelpCircle } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, logout, topUpWallet } = useApp();

  const handleQuickLoad = (amount: number) => {
    topUpWallet(amount);
  };

  return (
    <div className="flex-grow bg-slate-50/50 overflow-y-auto no-scrollbar pb-6 px-4 animate-fade-in flex flex-col gap-4">
      
      {/* 1. HOLOGRAPHIC STUDENT DIGITAL CARD */}
      <div className="mt-4 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 border border-slate-700/50 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden group hover:shadow-emerald-950/20 transition duration-300">
        
        {/* Holographic Glowing Accents */}
        <div className="absolute -left-10 -top-10 w-28 h-28 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition" />
        <div className="absolute right-0 bottom-0 w-24 h-24 bg-blue-500/10 rounded-full blur-lg" />
        <div className="absolute right-3 top-3 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
        <div className="absolute right-3 top-3 w-1.5 h-1.5 bg-emerald-400 rounded-full" />

        {/* Card Header */}
        <div className="flex justify-between items-start mb-5 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-[10px] text-primary font-black tracking-widest uppercase m-0 leading-none">
              Universiti Perdana
            </h2>
            <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest block mt-0.5">
              Official Identity Card
            </span>
          </div>
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        </div>

        {/* Card Details Grid */}
        <div className="flex gap-4 mb-4">
          {/* Student Photo Frame */}
          <div className="w-16 h-20 bg-slate-800 border border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 shadow-inner select-none relative overflow-hidden">
            <span className="text-xl font-extrabold text-slate-300">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
            <div className="absolute bottom-0 w-full bg-primary/20 text-primary py-0.5 text-center text-[7px] font-black uppercase">
              STUDENT
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-sm font-black text-white m-0 leading-tight">
              {user.name}
            </h3>
            <span className="text-[9px] text-primary font-extrabold tracking-widest mt-0.5 uppercase">
              Matric: {user.matricNo}
            </span>
            
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-[8px] text-slate-400 font-semibold uppercase">
              <div>Faculty:</div>
              <div className="text-white font-bold">FCSIT</div>
              <div>Expiry:</div>
              <div className="text-white font-bold">12/2028</div>
            </div>
          </div>
        </div>

        {/* Simulated Barcode */}
        <div className="bg-white rounded-xl p-2.5 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-50 transition shadow-inner">
          {/* Barcode lines */}
          <div className="w-full flex items-center justify-between opacity-80 h-6">
            {[1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 3, 2, 1, 2, 3, 1].map((wt, i) => (
              <div 
                key={i} 
                className={`bg-slate-900 h-full ${
                  wt === 1 ? 'w-0.5' : wt === 2 ? 'w-0.75' : wt === 3 ? 'w-1' : 'w-1.5'
                }`} 
              />
            ))}
          </div>
          <span className="text-[7px] text-slate-500 font-extrabold tracking-widest font-mono">
            *{user.matricNo}*
          </span>
        </div>
      </div>

      {/* 2. GerakPay WALLET CONSOLE */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5 pl-1">
          <Wallet className="w-4 h-4 text-slate-400" />
          GerakPay Top Up
        </h3>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">Available Wallet Balance</span>
            <span className="text-2xl font-black text-slate-800">RM{user.balance.toFixed(2)}</span>
          </div>
          <span className="bg-emerald-50 text-primary border border-emerald-100 text-[10px] font-black rounded-lg px-2.5 py-1">
            Active Wallet
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-normal mb-4">
          Instantly load virtual credits into your account to purchase meals, shuttle rides, or shipping models.
        </p>

        {/* Load Preset Grid */}
        <div className="grid grid-cols-3 gap-2">
          {[10.00, 20.00, 50.00].map((amt) => (
            <button
              key={amt}
              onClick={() => handleQuickLoad(amt)}
              className="py-2.5 bg-slate-50 hover:bg-primary-light border border-slate-150 hover:border-primary/20 rounded-xl text-xs font-extrabold text-slate-700 hover:text-primary transition flex items-center justify-center gap-1"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              +RM{amt.toFixed(0)}
            </button>
          ))}
        </div>
      </div>

      {/* 3. CAMPUS LOYALTY TIER */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100 shadow-sm animate-float">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[8px] text-slate-400 font-extrabold uppercase">Membership Level</span>
            <h4 className="text-sm font-black text-slate-800 m-0 mt-0.5">Green Diamond Tier</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-none">
              Total Points: <span className="text-amber-500 font-bold">{user.points} pts</span>
            </p>
          </div>
        </div>
        <span className="text-[9px] font-extrabold bg-amber-50 text-amber-700 border border-amber-100 rounded-lg px-2 py-0.5">
          1.5x Point Multiplier
        </span>
      </div>

      {/* 4. ACTIONS MENU */}
      <div className="bg-white border border-slate-100 rounded-3xl p-2.5 shadow-sm flex flex-col gap-1">
        
        <button 
          onClick={() => alert('Campus Information Guide: gerak connects college dining stalls, robe booking portals, and shuttle systems. Developed by Universiti Perdana developers.')}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="text-slate-400"><HelpCircle className="w-4 h-4" /></div>
            <span className="text-xs font-extrabold text-slate-700">Help & User Guide</span>
          </div>
          <span className="text-slate-300 text-xs font-bold">➔</span>
        </button>

        <button 
          onClick={() => alert('Simulated Terms of Campus Services')}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition text-left border-t border-slate-50"
        >
          <div className="flex items-center gap-3">
            <div className="text-slate-400"><Heart className="w-4 h-4" /></div>
            <span className="text-xs font-extrabold text-slate-700">Privacy & Terms</span>
          </div>
          <span className="text-slate-300 text-xs font-bold">➔</span>
        </button>

        <button 
          onClick={logout}
          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-danger/5 hover:text-danger text-slate-600 transition text-left border-t border-slate-50 group"
        >
          <div className="flex items-center gap-3">
            <div className="text-slate-400 group-hover:text-danger"><LogOut className="w-4 h-4" /></div>
            <span className="text-xs font-extrabold">Log Out Session</span>
          </div>
          <span className="text-slate-300 group-hover:text-danger text-xs font-bold">➔</span>
        </button>

      </div>

    </div>
  );
};
