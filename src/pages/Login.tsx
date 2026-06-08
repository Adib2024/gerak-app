import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, User, Lock, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, setCurrentPage } = useApp();
  const [matricNo, setMatricNo] = useState('WIF210045');
  const [password, setPassword] = useState('password123');
  const [studentName, setStudentName] = useState('Ahmad Faiz');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matricNo.trim() || !password.trim()) {
      setError('Please fill in all credentials.');
      return;
    }
    
    setLoading(true);
    setError('');

    // Simulate network authentication to campus servers
    setTimeout(() => {
      const success = login(matricNo, studentName);
      setLoading(false);
      if (success) {
        setCurrentPage('dashboard');
      } else {
        setError('Invalid Matric Number formatting. Must exceed 5 characters.');
      }
    }, 1200);
  };

  const fillMockCredentials = (id: string, name: string) => {
    setMatricNo(id);
    setPassword('campuspass');
    setStudentName(name);
    setError('');
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col justify-between p-6 select-none animate-fade-in h-full">
      {/* Top Section: Branding */}
      <div className="flex flex-col items-center text-center mt-6">
        <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-3xl shadow-lg shadow-primary/20 mb-3 animate-float">
          G
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight font-heading m-0">
          Sign In to GERAK
        </h2>
        <p className="text-slate-400 text-xs mt-1 font-semibold">
          Smart Campus Unified Credentials Node
        </p>
      </div>

      {/* Center Section: Credentials Form */}
      <div className="w-full bg-white rounded-3xl p-6 border border-slate-100 shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Student Name (Visual addition for user customization) */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">
              Student Full Name
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-700 focus:outline-none focus:border-primary focus:bg-white transition"
                placeholder="Full Name (e.g. Ahmad Faiz)"
                required
              />
            </div>
          </div>

          {/* Matric ID */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">
              Matric ID Number
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={matricNo}
                onChange={(e) => setMatricNo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:border-primary focus:bg-white transition uppercase"
                placeholder="e.g. WIF210045"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">
              Portal Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-700 focus:outline-none focus:border-primary focus:bg-white transition"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-xl p-3 text-xs text-danger font-bold text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover active:scale-[0.99] disabled:bg-slate-200 disabled:active:scale-100 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 rounded-full border-3 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                Secure Login
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Tester presets */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
            Or Quick Login as:
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => fillMockCredentials('WIF210045', 'Ahmad Faiz')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-primary-light border border-slate-200 hover:border-primary/20 rounded-lg text-[10px] font-bold text-slate-600 hover:text-primary transition"
            >
              Faiz (WIF210045)
            </button>
            <button
              onClick={() => fillMockCredentials('AWE200089', 'Siti Sarah')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-primary-light border border-slate-200 hover:border-primary/20 rounded-lg text-[10px] font-bold text-slate-600 hover:text-primary transition"
            >
              Sarah (AWE200089)
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Footer Registration link */}
      <div className="text-center mb-4">
        <span className="text-xs text-slate-400 font-semibold">New student on campus? </span>
        <button
          onClick={() => setCurrentPage('register')}
          className="text-xs text-primary font-bold hover:underline active:scale-95 transition"
        >
          Create Gerak Account
        </button>
      </div>
    </div>
  );
};
