import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

export const SplashScreen: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Increment loading progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 4;
      });
    }, 80);

    // Transition to login after progress is filled
    const transitionTimer = setTimeout(() => {
      setCurrentPage('login');
    }, 2400);

    return () => {
      clearInterval(timer);
      clearTimeout(transitionTimer);
    };
  }, [setCurrentPage]);

  return (
    <div className="flex-1 bg-gradient-to-tr from-emerald-950 via-emerald-700 to-emerald-500 flex flex-col items-center justify-between p-8 text-white select-none animate-fade-in h-full">
      {/* Spacer */}
      <div className="h-10" />

      {/* Center Branding */}
      <div className="flex flex-col items-center gap-4 animate-float">
        {/* Animated Glowing Logo Mark */}
        <div className="w-24 h-24 rounded-[32px] bg-white text-primary flex items-center justify-center font-black text-6xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] border-4 border-emerald-300/40 relative">
          G
          {/* Pulsing ring indicator */}
          <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-amber-400 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-extrabold text-slate-800 shadow-md">
            ★
          </span>
        </div>

        <div className="text-center mt-2">
          <h1 className="text-4xl font-extrabold tracking-tight m-0 uppercase font-heading drop-shadow-md">
            GERAK
          </h1>
          <p className="text-emerald-100 font-bold text-xs tracking-wider uppercase mt-1 opacity-90">
            Smart Campus Service Platform
          </p>
        </div>
      </div>

      {/* Bottom Progress Bar & Credits */}
      <div className="w-full max-w-xs flex flex-col items-center gap-6 mb-8">
        {/* Progress Bar Container */}
        <div className="w-full bg-emerald-900/40 border border-emerald-400/20 h-2.5 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div 
            className="bg-gradient-to-r from-amber-400 to-emerald-300 h-full rounded-full transition-all duration-100 shadow-xs"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Loading text */}
        <div className="text-[10px] font-bold text-emerald-200/80 tracking-widest uppercase animate-pulse">
          Connecting to Campus Node... {progress}%
        </div>

        {/* Brand signature */}
        <div className="text-[8px] font-bold text-emerald-300/60 uppercase tracking-widest mt-4">
          Gerak Inc • Powered by Universiti Perdana
        </div>
      </div>
    </div>
  );
};
