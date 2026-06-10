import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { RotateCcw, Calendar, CheckCircle2, X, Upload, FileText, ShieldAlert } from 'lucide-react';
import { submitJubahToSheets } from '../lib/sheetsService';

const UNIVERSITIES = [
  'Universiti Malaysia Pahang Al-Sultan Abdullah',
  'Universiti Islam Antarabangsa Malaysia',
  'Universiti Teknologi MARA (UiTM)',
];

const UNIVERSITY_FACULTIES: Record<string, string[]> = {
  'Universiti Malaysia Pahang Al-Sultan Abdullah': [
    'FKOM', 'FIST', 'FTKKP', 'FTKMA', 'FTKEE', 'FTKA', 'FTKPM', 'FIM', 'PSM', 'PSK',
  ],
  'Universiti Islam Antarabangsa Malaysia': [
    'AbdulHamid AbuSulayman Kulliyyah of Islamic Revealed Knowledge & Human Sciences',
    'Kulliyyah of Engineering',
    'Kulliyyah of Economics & Management Sciences',
    'Kulliyyah of Architecture & Environmental Design',
    'Ahmad Ibrahim Kulliyyah of Laws',
    'Kulliyyah of Information & Communication Technology (KICT)',
    'Kulliyyah of Education',
    'Kulliyyah of Science',
    'Kulliyyah of Medicine',
    'Kulliyyah of Pharmacy',
    'Kulliyyah of Dentistry',
    'Kulliyyah of Nursing',
    'Kulliyyah of Allied Health Sciences',
    'Kulliyyah of Languages & Management',
  ],
  'Universiti Teknologi MARA (UiTM)': [
    'Faculty of Accountancy',
    'Faculty of Administrative Science and Policy Studies',
    'Faculty of Applied Sciences',
    'Faculty of Architecture, Planning and Surveying',
    'Faculty of Business and Management',
    'Faculty of Computer and Mathematical Sciences',
    'Faculty of Dentistry',
    'Faculty of Education',
    'Faculty of Electrical Engineering',
    'Faculty of Civil Engineering',
    'Faculty of Mechanical Engineering',
    'Faculty of Law',
    'Faculty of Medicine',
    'Faculty of Pharmacy',
  ],
};

const REMARKS = ['Master', 'PHD', 'Degree', 'Diploma'] as const;

export const Jubah: React.FC = () => {
  const { jubahBooking, bookJubah, scheduleReturn, cancelJubahBooking, user } = useApp();

  const [fullName, setFullName]       = useState('');
  const [icNumber, setIcNumber]       = useState('');
  const [hpNumber, setHpNumber]       = useState('');
  const [university, setUniversity]   = useState('');
  const [faculty, setFaculty]         = useState('');
  const [matricId, setMatricId]       = useState('');
  const [paymentMode, setPaymentMode] = useState<'pickup' | 'postage'>('pickup');
  const [remark, setRemark]           = useState<typeof REMARKS[number]>('Degree');
  const [combinedFile, setCombinedFile] = useState<File | null>(null);
  const [fileError, setFileError]     = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [returnMethod, setReturnMethod] = useState<'self' | 'locker' | 'courier'>('self');
  const [returnDate, setReturnDate]     = useState('2026-06-15');
  const [returnTime, setReturnTime]     = useState('14:00');

  const cost = paymentMode === 'postage' ? 80 : 55;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileError('');
    if (file && file.type !== 'application/pdf') {
      setFileError('Only PDF files are accepted.');
      setCombinedFile(null);
      return;
    }
    setCombinedFile(file);
  };

  const handleBook = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!university) { alert('Please select your university.'); return; }
    if (!faculty) { alert('Please select your faculty.'); return; }
    if (!combinedFile) { setFileError('Please upload your combined PDF file.'); return; }
    if (user.balance < cost) return;
    bookJubah(fullName, icNumber, hpNumber, university, faculty, matricId, paymentMode, remark, combinedFile.name);
    submitJubahToSheets({ fullName, icNumber, hpNumber, university, faculty, matricId, paymentMode, remark, combinedFileName: combinedFile.name, cost });
  };

  const handleScheduleReturn = (e: React.SyntheticEvent) => {
    e.preventDefault();
    scheduleReturn(returnMethod, returnDate, returnTime);
  };

  return (
    <div className="flex-grow bg-slate-50/50 overflow-y-auto no-scrollbar pb-6 px-4 animate-fade-in flex flex-col gap-4">

      {/* HEADER */}
      <div className="mt-4 px-1">
        <h2 className="text-xl font-bold m-0 text-blue-900">Convocation Robe Service</h2>
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
          Official Robe Bookings, Tracking & Scheduled Returns
        </p>
      </div>

      {!jubahBooking ? (
        <form onSubmit={handleBook} className="flex flex-col gap-4">

          {/* ── PERSONAL INFORMATION ── */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Personal Information</h3>

            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Full Name <span className="text-danger">*</span>
              </label>
              <p className="text-[9px] text-slate-400 -mt-0.5">Use uppercase letters. Example: MUHAMMAD AMIRUDDIN BIN AHMAD</p>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value.toUpperCase())}
                placeholder="FULL NAME AS PER IC"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* IC Number */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                IC Number <span className="text-danger">*</span>
              </label>
              <p className="text-[9px] text-slate-400 -mt-0.5">Example: 980123456789 (Without ' - ')</p>
              <input
                type="text"
                value={icNumber}
                onChange={e => setIcNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="980123456789"
                maxLength={12}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* HP Number */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                HP Number <span className="text-danger">*</span>
              </label>
              <p className="text-[9px] text-slate-400 -mt-0.5">Example: 012345678 (Without ' - ') · Our runner will be in touch shortly.</p>
              <input
                type="text"
                value={hpNumber}
                onChange={e => setHpNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="01XXXXXXXXX"
                maxLength={11}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Matric ID */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Matric ID <span className="text-danger">*</span>
              </label>
              <p className="text-[9px] text-slate-400 -mt-0.5">Use uppercase letters. Example: HB19021</p>
              <input
                type="text"
                value={matricId}
                onChange={e => setMatricId(e.target.value.toUpperCase())}
                placeholder="HB19021"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* ── ACADEMIC INFORMATION ── */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Academic Information</h3>

            {/* University */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                University <span className="text-danger">*</span>
              </label>
              <select
                value={university}
                onChange={e => { setUniversity(e.target.value); setFaculty(''); }}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="" disabled>Select your university...</option>
                {UNIVERSITIES.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            {/* Faculty — list changes based on selected university */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Faculty <span className="text-danger">*</span>
              </label>
              <select
                value={faculty}
                onChange={e => setFaculty(e.target.value)}
                required
                disabled={!university}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                  {university ? 'Select your faculty...' : 'Select a university first'}
                </option>
                {(UNIVERSITY_FACULTIES[university] ?? []).map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Remark */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Remark <span className="text-danger">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {REMARKS.map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRemark(r)}
                    className={`py-2 rounded-xl text-[11px] font-bold border transition ${
                      remark === r
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── PAYMENT MODE ── */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col gap-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Payment Mode</h3>

            {[
              {
                value: 'pickup' as const,
                label: 'Full payment (RM55) — Self Pickup',
                desc: 'Service charge for pickup only at UMPSA Gambang on your scheduled date. We store, manage and maintain all items (jubah, mortarboard, kad jemputan, cenderahati & selempang) until handover.',
              },
              {
                value: 'postage' as const,
                label: 'Postage (RM80) — Pickup & Postage SM',
                desc: 'Pickup & Postage (Semenanjung Malaysia). Total weight ≈ 3–4 kg (jubah, mortarboard, kad jemputan, cenderahati & selempang).',
              },
            ].map(opt => (
              <label
                key={opt.value}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                  paymentMode === opt.value
                    ? 'border-blue-400 bg-blue-50/60'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMode"
                  value={opt.value}
                  checked={paymentMode === opt.value}
                  onChange={() => setPaymentMode(opt.value)}
                  className="mt-0.5 accent-blue-600 shrink-0"
                />
                <div>
                  <span className={`text-xs font-bold block ${paymentMode === opt.value ? 'text-blue-700' : 'text-slate-700'}`}>
                    {opt.label}
                  </span>
                  <span className="text-[9px] text-slate-400 leading-relaxed block mt-0.5">{opt.desc}</span>
                </div>
              </label>
            ))}

            {/* Cost HUD */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between mt-1">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Total Payment</span>
                <span className="text-xl font-black text-slate-800">RM{cost}.00</span>
              </div>
              <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg px-2 py-1 text-[9px] font-extrabold">
                Earn +{paymentMode === 'postage' ? 200 : 150} Points
              </span>
            </div>

            {user.balance < cost && (
              <div className="bg-danger/10 border border-danger/20 text-danger rounded-xl p-3 text-[10px] font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                Insufficient GerakPay balance (RM{user.balance.toFixed(2)} available). Please top up.
              </div>
            )}
          </div>

          {/* ── DOCUMENT UPLOAD ── */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col gap-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Combined Document</h3>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Upload your <span className="font-bold text-slate-700">combined PDF</span> of{' '}
              <span className="text-blue-600 font-bold">Convo Slip</span>,{' '}
              <span className="text-blue-600 font-bold">OSCAR</span>, and{' '}
              <span className="text-blue-600 font-bold">SKPG</span>.
            </p>

            {/* Instructions */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex flex-col gap-1.5 text-[10px] text-slate-500">
              <p className="font-bold text-slate-600">What you need to do:</p>
              <p>1) Compile documents <span className="text-emerald-600 font-bold">OSCAR + SKPG + KONVO SLIP</span> into <strong>1 PDF</strong></p>
              <p>2) Save PDF file as <strong>your full name</strong> (e.g. Ali Bin Ahmad.pdf)</p>
              <p>3) Upload the combined file below</p>
            </div>

            {/* File picker */}
            <input
              type="file"
              accept=".pdf,application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {!combinedFile ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-200 rounded-2xl py-6 flex flex-col items-center gap-2 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition"
              >
                <Upload className="w-6 h-6" />
                <span className="text-xs font-bold">Tap to upload PDF</span>
                <span className="text-[9px]">OSCAR · SKPG · KONVO SLIP combined</span>
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5">
                <FileText className="w-8 h-8 text-emerald-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-emerald-700 truncate">{combinedFile.name}</p>
                  <p className="text-[9px] text-emerald-500 mt-0.5">{(combinedFile.size / 1024).toFixed(1)} KB · PDF</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setCombinedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="text-slate-400 hover:text-danger transition shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {fileError && (
              <p className="text-[10px] text-danger font-bold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> {fileError}
              </p>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={user.balance < cost}
            className="mx-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-bold px-8 py-2.5 rounded-full shadow-md shadow-blue-500/30 transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Book
          </button>
        </form>

      ) : (
        /* ── TRACKING & RETURN ── */
        <div className="flex flex-col gap-4">

          {/* Booking Summary */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9px] text-blue-500 font-extrabold uppercase tracking-wider">Reservation Active</span>
                <h3 className="text-sm font-black text-slate-800 mt-0.5">{jubahBooking.fullName}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {jubahBooking.remark} · {jubahBooking.faculty} · {jubahBooking.matricId}
                </p>
              </div>
              <button onClick={cancelJubahBooking} className="text-xs text-slate-400 hover:text-danger font-bold flex items-center gap-0.5 shrink-0">
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-slate-50 rounded-xl p-2.5">
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[8px]">Payment</span>
                <span className="font-black text-slate-700">RM{jubahBooking.cost.toFixed(2)}</span>
                <span className="text-slate-400 block">{jubahBooking.paymentMode === 'postage' ? 'Postage' : 'Pickup'}</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5">
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[8px]">Document</span>
                <span className="font-bold text-slate-700 truncate block">{jubahBooking.combinedFileName || '—'}</span>
              </div>
            </div>

            {/* Progress steps */}
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Robe Preparation</h4>
            <div className="flex flex-col gap-4 pl-2">
              {[
                { key: 'ordered',   label: 'Order Confirmed',     desc: 'Booking registered in system.' },
                { key: 'cleaning',  label: 'Dry Cleaning',        desc: 'Prepping fabric for convocation.' },
                { key: 'packaging', label: 'Packaging',           desc: 'Wrapped in protective coat bag.' },
                { key: 'delivering', label: jubahBooking.paymentMode === 'postage' ? 'Out for Delivery' : 'Ready for Pickup',
                                    desc: jubahBooking.paymentMode === 'postage' ? 'Rider heading to your address.' : 'Available at collection counter.' },
                { key: 'delivered', label: jubahBooking.paymentMode === 'postage' ? 'Delivered' : 'Collected',
                                    desc: 'Safe in your hands!' },
              ].map((step, idx) => {
                const order = ['ordered', 'cleaning', 'packaging', 'delivering', 'delivered'];
                const currentIdx = order.indexOf(jubahBooking.status);
                const isPast    = currentIdx >= idx;
                const isCurrent = jubahBooking.status === step.key;
                return (
                  <div key={step.key} className="flex gap-4 relative">
                    {idx < 4 && (
                      <div className={`absolute left-2.5 top-6 bottom-0 w-0.5 -translate-x-1/2 ${currentIdx > idx ? 'bg-blue-500' : 'bg-slate-100'}`} />
                    )}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center relative z-10 transition ${isPast ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-slate-200'}`}>
                      {isPast && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 -mt-0.5">
                      <h5 className={`text-xs font-bold leading-tight ${isCurrent ? 'text-blue-600 font-black' : isPast ? 'text-slate-700' : 'text-slate-300'}`}>
                        {step.label}
                      </h5>
                      <p className="text-[10px] text-slate-400 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[8px] text-slate-400 italic mt-1">Status updates in 15-second cycles for demo purposes.</p>
          </div>

          {/* Return Scheduler */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-blue-500" />
              Schedule Robe Return
            </h3>

            {!jubahBooking.returnScheduled ? (
              <form onSubmit={handleScheduleReturn} className="flex flex-col gap-4">
                <p className="text-xs text-slate-500 leading-normal">Return required within 7 days post-convocation.</p>
                <div className="grid grid-cols-3 gap-2">
                  {[{ id: 'self', label: 'Hub Counter' }, { id: 'locker', label: 'Smart Locker' }, { id: 'courier', label: 'Home Courier' }].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setReturnMethod(m.id as any)}
                      className={`py-2 rounded-xl text-[10px] font-bold border transition ${returnMethod === m.id ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Return Date</label>
                    <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} required
                      className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 focus:outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Time Slot</label>
                    <input type="time" value={returnTime} onChange={e => setReturnTime(e.target.value)} required
                      className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 focus:outline-none" />
                  </div>
                </div>
                <button type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-extrabold py-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 text-xs uppercase">
                  <Calendar className="w-4 h-4" />
                  Confirm Return Appointment
                </button>
              </form>
            ) : (
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2.5 text-indigo-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-wider">Return Confirmed</span>
                </div>
                <div className="text-xs text-slate-600 flex flex-col gap-1 border-t border-indigo-100/50 pt-2">
                  <div>Method: <span className="text-indigo-800 font-bold uppercase">{jubahBooking.returnMethod}</span></div>
                  <div>Scheduled: <span className="text-indigo-800 font-bold">{jubahBooking.returnDate} at {jubahBooking.returnTime}</span></div>
                </div>
                <p className="text-[9px] text-slate-400 italic leading-tight">
                  Please clean and bundle all items before dropping off. QR code will be sent to your phone.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
