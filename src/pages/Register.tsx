import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, User, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

export const Register: React.FC = () => {
  const { register, setCurrentPage } = useApp();
  const [name, setName] = useState('');
  const [matricNo, setMatricNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!name || !matricNo || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');
    const { error: authError } = await register(name, matricNo, email, password);
    setLoading(false);
    if (authError) setError(authError);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col justify-between p-6 select-none animate-fade-in h-full">
      {/* Top Section: Header */}
      <div className="flex flex-col items-center text-center mt-4">
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-black text-2xl shadow-lg shadow-primary/20 mb-2" style={{ color: '#0f172a' }}>
          g
        </div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight font-heading m-0">
          Create Gerak Account
        </h2>
        <p className="text-slate-400 text-[10px] mt-1 font-bold">
          Register with unified campus login parameters.
        </p>
      </div>

      {/* Center Section: Forms */}
      <div className="w-full bg-white rounded-3xl p-5 border border-slate-100 shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider pl-1">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <User className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-700 focus:outline-none focus:border-primary focus:bg-white transition"
                placeholder="Full Student Name"
                required
              />
            </div>
          </div>

          {/* Matric ID */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider pl-1">
              Matric ID
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={matricNo}
                onChange={(e) => setMatricNo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-primary focus:bg-white transition uppercase"
                placeholder="e.g. WIF210045"
                required
              />
            </div>
          </div>

          {/* Campus Email */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider pl-1">
              Campus Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="w-3.5 h-3.5" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-700 focus:outline-none focus:border-primary focus:bg-white transition"
                placeholder="e.g. name@student.um.edu.my"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider pl-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-3.5 h-3.5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-700 focus:outline-none focus:border-primary focus:bg-white transition"
                placeholder="At least 6 characters"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider pl-1">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-3.5 h-3.5" />
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-700 focus:outline-none focus:border-primary focus:bg-white transition"
                placeholder="Re-enter password"
                required
              />
            </div>
          </div>

          {/* Error Feed */}
          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-xl p-2.5 text-[10px] text-danger font-bold text-center flex items-center justify-center gap-1.5 animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover active:scale-[0.99] disabled:bg-slate-200 text-white font-extrabold py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-1.5"
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                Register & Claim RM10
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Bottom Section */}
      <div className="text-center mb-2">
        <span className="text-xs text-slate-400 font-semibold">Already registered? </span>
        <button
          onClick={() => setCurrentPage('login')}
          className="text-xs text-primary font-bold hover:underline active:scale-95 transition"
        >
          Sign In Here
        </button>
      </div>
    </div>
  );
};
