import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ScrollText, Ruler, RotateCcw, Calendar, CheckCircle2, ShieldAlert, X } from 'lucide-react';

export const Jubah: React.FC = () => {
  const { jubahBooking, bookJubah, scheduleReturn, cancelJubahBooking, user } = useApp();

  // Inputs
  const [height, setHeight] = useState(165);
  const [weight, setWeight] = useState(60);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [address, setAddress] = useState('');
  
  // Return Schedulers
  const [returnMethod, setReturnMethod] = useState<'self' | 'locker' | 'courier'>('self');
  const [returnDate, setReturnDate] = useState('2026-06-15');
  const [returnTime, setReturnTime] = useState('14:00');

  // Sizing assistant calculation
  const [sizeSuggestion, setSizeSuggestion] = useState<'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'>('M');

  useEffect(() => {
    if (height < 155) setSizeSuggestion('XS');
    else if (height < 165) setSizeSuggestion(weight < 60 ? 'S' : 'M');
    else if (height < 175) setSizeSuggestion(weight < 70 ? 'M' : 'L');
    else if (height < 185) setSizeSuggestion(weight < 85 ? 'L' : 'XL');
    else setSizeSuggestion('XXL');
  }, [height, weight]);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryType === 'delivery' && !address.trim()) {
      alert('Please specify your dormitory / residential room address.');
      return;
    }
    bookJubah(height, weight, gender, deliveryType, address);
  };

  const handleScheduleReturn = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleReturn(returnMethod, returnDate, returnTime);
  };

  const deliveryCost = deliveryType === 'delivery' ? 15.00 : 0.00;

  return (
    <div className="flex-grow bg-slate-50/50 overflow-y-auto no-scrollbar pb-6 px-4 animate-fade-in flex flex-col gap-4">
      
      {/* HEADER HERO BANNER */}
      <div className="mt-4 bg-gradient-to-r from-blue-700 to-indigo-600 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-15 select-none translate-x-2 translate-y-4">
          <ScrollText className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold font-heading m-0 flex items-center gap-2">
            Convocation Gown Services
          </h2>
          <p className="text-[10px] text-blue-100 font-semibold uppercase tracking-wider mt-1">
            Official Robe Bookings, Tracking & Scheduled Returns
          </p>
        </div>
      </div>

      {!jubahBooking ? (
        /* BOOKING SETUP */
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col gap-5">
          <h3 className="text-sm font-black text-slate-800 m-0 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-blue-500" />
            Size Assistant & Reservation
          </h3>

          <form onSubmit={handleBook} className="flex flex-col gap-4">
            
            {/* Height & Weight Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                  Height ({height} cm)
                </label>
                <input
                  type="range"
                  min="140"
                  max="200"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                  Weight ({weight} kg)
                </label>
                <input
                  type="range"
                  min="35"
                  max="120"
                  value={weight}
                  onChange={(e) => setWeight(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            {/* Gender Selectors */}
            <div className="flex gap-2">
              {(['male', 'female'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    gender === g 
                      ? 'border-blue-500 bg-blue-50 text-blue-600' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {g.toUpperCase()}
                </button>
              ))}
            </div>

            {/* AI Size recommendation ticker */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-blue-500 font-extrabold uppercase tracking-wider">Recommended Size</span>
                <div className="text-xl font-black text-blue-700 mt-0.5">Size {sizeSuggestion}</div>
              </div>
              <p className="text-[9px] text-blue-600 font-semibold text-right leading-tight max-w-[150px]">
                Recommended fitting for standard 2026 convocation garments.
              </p>
            </div>

            {/* Delivery Methods */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                Fulfillment Option
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-center ${
                    deliveryType === 'pickup' 
                      ? 'border-blue-500 bg-blue-50 text-blue-600' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Self-Pick Up (Free)
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-center ${
                    deliveryType === 'delivery' 
                      ? 'border-blue-500 bg-blue-50 text-blue-600' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Dorm Delivery (+RM15)
                </button>
              </div>
            </div>

            {/* Address Field if delivery */}
            {deliveryType === 'delivery' && (
              <div className="flex flex-col gap-1 animate-fade-in">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                  Dormitory / Room Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. KK1, Block B, Room 302"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                  required
                />
              </div>
            )}

            {/* Budget Warning */}
            {deliveryCost > 0 && user.balance < deliveryCost && (
              <div className="bg-danger/10 border border-danger/20 text-danger rounded-xl p-3 text-[10px] font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Wallet credit low (RM{user.balance.toFixed(2)} available).
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={deliveryCost > 0 && user.balance < deliveryCost}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:bg-slate-200 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition mt-2 flex items-center justify-center gap-2"
            >
              <ScrollText className="w-4 h-4" />
              Confirm Robe Reservation
            </button>
          </form>
        </div>
      ) : (
        /* ROBE TRACKING AND RETURN PANEL */
        <div className="flex flex-col gap-4">
          
          {/* A. ROBE LOGISTICS MONITOR */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-50">
              <div>
                <span className="text-[9px] text-blue-500 font-extrabold uppercase tracking-wider">RESERVATION ACTIVE</span>
                <h3 className="text-sm font-black text-slate-800 m-0 mt-0.5">Robe Size: {jubahBooking.size}</h3>
              </div>
              <button 
                onClick={cancelJubahBooking}
                className="text-xs text-slate-400 hover:text-danger font-bold flex items-center gap-0.5"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            </div>

            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 pl-1">
              Robe Preparation Steps
            </h4>

            {/* Vertical progress flow */}
            <div className="flex flex-col gap-4 pl-2">
              {[
                { key: 'ordered', label: 'Order Confirmed', desc: 'Robe reserved in system registry.' },
                { key: 'cleaning', label: 'Dry Cleaning & Sanitizing', desc: 'Prepping fabric for graduation hygiene.' },
                { key: 'packaging', label: 'Packaging', desc: 'Folding and wrapping in protective coat bag.' },
                { key: 'delivering', label: jubahBooking.deliveryType === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup', desc: jubahBooking.deliveryType === 'delivery' ? 'Rider heading to college.' : 'Available at KK1 Exam Hall counter.' },
                { key: 'delivered', label: jubahBooking.deliveryType === 'delivery' ? 'Delivered successfully' : 'Collected by Student', desc: 'Safe in your hands!' }
              ].map((step, idx) => {
                const steps = ['ordered', 'cleaning', 'packaging', 'delivering', 'delivered'];
                const currentIdx = steps.indexOf(jubahBooking.status);
                const isPast = currentIdx >= idx;
                const isCurrent = jubahBooking.status === step.key;

                return (
                  <div key={step.key} className="flex gap-4 relative">
                    {/* Stepper line connector */}
                    {idx < 4 && (
                      <div className={`absolute left-2.5 top-6 bottom-0 w-0.5 -translate-x-1/2 ${
                        currentIdx > idx ? 'bg-blue-500' : 'bg-slate-100'
                      }`} />
                    )}

                    {/* Check indicator circle */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center relative z-10 transition duration-300 ${
                      isPast 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'bg-white border-slate-200 text-transparent'
                    }`}>
                      {isPast && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1 -mt-0.5">
                      <h5 className={`text-xs font-bold leading-tight ${
                        isCurrent ? 'text-blue-600 font-black' : isPast ? 'text-slate-700' : 'text-slate-300'
                      }`}>
                        {step.label}
                      </h5>
                      <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <p className="text-[8px] text-slate-400 leading-normal mt-5 pl-1 italic">
              Logistics progress is simulated. Expect automated status steps in 15-second cycles for demonstrator use.
            </p>
          </div>

          {/* B. RETURN SCHEDULER PANEL */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-blue-500 animate-spin" />
              Schedule Robe Return
            </h3>

            {!jubahBooking.returnScheduled ? (
              <form onSubmit={handleScheduleReturn} className="flex flex-col gap-4">
                <p className="text-xs text-slate-500 leading-normal">
                  Academic rules require return bookings within 7 days post-convocation. Choose parameters:
                </p>

                {/* Return Methods */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'self', label: 'Hub Counter' },
                    { id: 'locker', label: 'Smart Locker' },
                    { id: 'courier', label: 'Home Courier' }
                  ].map((met) => (
                    <button
                      key={met.id}
                      type="button"
                      onClick={() => setReturnMethod(met.id as any)}
                      className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition text-center ${
                        returnMethod === met.id 
                          ? 'border-blue-500 bg-blue-50 text-blue-600' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {met.label}
                    </button>
                  ))}
                </div>

                {/* Date and Time Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 font-bold focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                      Time Slot
                    </label>
                    <input
                      type="time"
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-700 font-bold focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Submit Return */}
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-extrabold py-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 text-xs uppercase"
                >
                  <Calendar className="w-4 h-4" />
                  Confirm Return Appointment
                </button>
              </form>
            ) : (
              /* APPOINTMENT RECEIPT */
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 flex flex-col gap-3 animate-scale-in">
                <div className="flex items-center gap-2.5 text-indigo-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-wider">Return Receipt Confirmed</span>
                </div>
                <div className="text-xs text-slate-600 flex flex-col gap-1 border-t border-indigo-100/50 pt-2">
                  <div>Method: <span className="text-indigo-800 font-bold uppercase">{jubahBooking.returnMethod}</span></div>
                  <div>Scheduled: <span className="text-indigo-800 font-bold">{jubahBooking.returnDate} at {jubahBooking.returnTime}</span></div>
                  <div>Dropoff Hub: <span className="text-indigo-800 font-bold">Smart Locker Hub Block A</span></div>
                </div>
                <p className="text-[9px] text-slate-400 italic leading-tight">
                  Please clean and bundle all cap, hood and robe layers before locker dropping. QR code will trigger via inbox.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
