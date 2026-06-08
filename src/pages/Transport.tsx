import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MapLibre } from '../components/MapLibre';
import { Navigation, Compass, Phone, MessageSquare, AlertCircle, PlayCircle, History, X } from 'lucide-react';

const LOCATIONS = [
  'Kolej Kediaman Pertama (KK1)',
  'Kolej Kediaman Ketiga (KK3)',
  'Fakulti Sains Komputer & Teknologi Maklumat',
  'Dewan Peperiksaan Utama',
  'Perpustakaan Sentral',
  'Pusat Sukan'
];

export const Transport: React.FC = () => {
  const { 
    activeRide, 
    rideHistory, 
    bookRide, 
    cancelRide, 
    simulateRideProgress, 
    user 
  } = useApp();

  const [pickup, setPickup] = useState(LOCATIONS[0]);
  const [destination, setDestination] = useState(LOCATIONS[2]);
  const [fare, setFare] = useState(3.50);

  // Recalculate fare based on distance index changes
  useEffect(() => {
    const idx1 = LOCATIONS.indexOf(pickup);
    const idx2 = LOCATIONS.indexOf(destination);
    const diff = Math.abs(idx1 - idx2);
    const calculatedFare = 3.00 + (diff === 0 ? 0.50 : diff * 0.75);
    setFare(calculatedFare);
  }, [pickup, destination]);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (pickup === destination) {
      alert('Pickup and Destination cannot be the exact same building.');
      return;
    }
    bookRide(pickup, destination, fare);
  };

  return (
    <div className="flex-grow bg-slate-50/50 overflow-y-auto no-scrollbar pb-6 px-4 animate-fade-in flex flex-col gap-4">
      
      {/* 1. Map Panel (Always visible at top) */}
      <div className="mt-4">
        <MapLibre />
      </div>

      {/* 2. Interactive Panel State */}
      {!activeRide ? (
        /* BOOKING SETUP */
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            Book a Campus Ride
          </h3>

          <form onSubmit={handleBook} className="flex flex-col gap-4">
            
            {/* Pickup */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center pt-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-blue-100 flex items-center justify-center" />
                <div className="w-0.5 h-10 bg-slate-200 border-dashed" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                  Pickup Location
                </label>
                <select
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-700 font-bold focus:outline-none focus:border-primary"
                >
                  {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc.split(' (')[0]}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Destination */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center pt-2">
                <div className="w-4 h-4 rounded-full bg-danger border-4 border-danger-100 flex items-center justify-center" />
              </div>
              <div className="flex-grow flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                  Destination Location
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-700 font-bold focus:outline-none focus:border-primary"
                >
                  {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc.split(' (')[0]}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fare Estimate HUD */}
            <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100 mt-2">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">GerakPay Ride Fare</span>
                <span className="text-xl font-black text-slate-800">RM{fare.toFixed(2)}</span>
              </div>
              <div className="text-right">
                <span className="bg-emerald-50 text-primary border border-emerald-100 rounded-lg px-2 py-1 text-[9px] font-extrabold block">
                  Earn +{Math.floor(fare * 5)} Points
                </span>
                <span className="text-[8px] text-slate-400 block mt-1">Instant simulated deduction</span>
              </div>
            </div>

            {/* Check Wallet Warnings */}
            {user.balance < fare && (
              <div className="bg-danger/10 border border-danger/20 text-danger rounded-xl p-3 text-[10px] font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Wallet credit low (RM{user.balance.toFixed(2)} available). Please Top-up.
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={user.balance < fare}
              className="w-full bg-primary hover:bg-primary-hover active:scale-[0.99] disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-primary/25 transition mt-2 flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4 fill-white" />
              Book GerakRide
            </button>
          </form>
        </div>
      ) : (
        /* LIVE ACTIVE BOOKING HUD */
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-lg flex flex-col gap-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <span className="bg-primary-light text-primary border border-primary/20 rounded-md px-1.5 py-0.5 text-[8px] font-extrabold tracking-widest uppercase">
                {activeRide.status.toUpperCase()}
              </span>
              <h3 className="text-sm font-black text-slate-800 m-0 mt-1.5">
                {activeRide.status === 'searching' && 'Searching for Shuttle...'}
                {activeRide.status === 'assigned' && 'Driver is Assigned'}
                {activeRide.status === 'arriving' && 'Driver is Arriving'}
                {activeRide.status === 'active' && 'Trip In Progress'}
              </h3>
            </div>
            
            {/* Quick Cancel */}
            {activeRide.status === 'searching' && (
              <button 
                onClick={cancelRide}
                className="text-xs text-danger font-bold flex items-center gap-1 hover:underline p-1"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            )}
          </div>

          {/* Progress visual steps */}
          <div className="grid grid-cols-4 gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
            {['assigned', 'arriving', 'active', 'completed'].map((stage, idx) => {
              const stages = ['assigned', 'arriving', 'active', 'completed'];
              const currentIdx = stages.indexOf(activeRide.status);
              const isPast = currentIdx >= idx;
              
              return (
                <div key={stage} className="flex flex-col items-center gap-1">
                  <div className={`h-1.5 w-full rounded-full transition duration-300 ${
                    isPast ? 'bg-primary' : 'bg-slate-200'
                  }`} />
                  <span className={`text-[7px] font-bold uppercase tracking-wider ${
                    isPast ? 'text-primary' : 'text-slate-400'
                  }`}>
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Driver Card Info */}
          {activeRide.driver && activeRide.status !== 'searching' && (
            <div className="flex items-center justify-between bg-slate-50/70 border border-slate-100 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                {/* Driver Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center border-2 border-white shadow-md">
                  KA
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 m-0 flex items-center gap-1.5">
                    {activeRide.driver.name}
                    <span className="text-[9px] font-bold text-amber-500">★ {activeRide.driver.rating}</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold leading-tight mt-0.5">
                    {activeRide.driver.vehicle}
                  </p>
                  <span className="inline-block bg-white border border-slate-200 rounded px-1 text-[9px] font-extrabold text-slate-600 mt-1">
                    {activeRide.driver.plateNumber}
                  </span>
                </div>
              </div>

              {/* Call buttons */}
              <div className="flex gap-1.5">
                <a href={`tel:${activeRide.driver.phone}`} className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-500">
                  <Phone className="w-4 h-4" />
                </a>
                <button onClick={() => alert('Simulated Chat Interface')} className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-500">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Interactive Simulation Controls for user testing */}
          <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <PlayCircle className="w-3.5 h-3.5 text-primary" />
              Demo Testing Controls
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={simulateRideProgress}
                className="flex-grow bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-extrabold py-2 px-3 rounded-xl text-[10px] transition uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
              >
                Fast-Forward Stage ➔
              </button>
              
              {activeRide.status !== 'searching' && (
                <button
                  onClick={cancelRide}
                  className="bg-danger/10 hover:bg-danger/15 text-danger font-bold py-2 px-3 rounded-xl text-[10px] transition border border-danger/10 uppercase"
                >
                  Cancel & Refund
                </button>
              )}
            </div>
            <p className="text-[8px] text-slate-400 leading-normal">
              Stages simulate driving parameters automatically every 6s. Press fast-forward to trigger immediate stages.
            </p>
          </div>
        </div>
      )}

      {/* 3. Rides Archive Logs */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 pl-1">
          <History className="w-4 h-4 text-slate-400" />
          Ride History
        </h3>

        {rideHistory.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-6">No previous rides recorded.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {rideHistory.map((hist) => (
              <div key={hist.id} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 text-slate-500 flex items-center justify-center">
                    <Navigation className="w-4 h-4 rotate-45 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 m-0">{hist.pickup.split(' (')[0]} ➔ {hist.destination.split(' (')[0]}</h4>
                    <span className="text-[9px] text-slate-400 font-semibold mt-0.5 block">{hist.date} • {hist.id}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-800">RM{hist.fare.toFixed(2)}</span>
                  <span className="text-[8px] text-primary font-bold uppercase tracking-wider block mt-0.5">COMPLETED</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
