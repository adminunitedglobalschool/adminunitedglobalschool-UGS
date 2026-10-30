import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  QrCode, 
  ShieldCheck, 
  School, 
  Sparkles, 
  RotateCw,
  CheckCircle2,
  Calendar,
  Phone,
  MapPin,
  Layers
} from 'lucide-react';

export interface IdCardData {
  type: 'student' | 'teacher' | 'administrator' | 'staff';
  id: string;
  code: string; // Admission No or Emp ID
  name: string;
  roleOrGrade: string; // e.g. "Class 10 - Sec A" or "Senior Faculty & STEM Head"
  departmentOrHouse?: string; // e.g. "House Emerald" or "Physics & Robotics"
  phone: string;
  email: string;
  avatar: string;
  bloodGroup?: string;
  validThrough: string;
  zoneOrRoll?: string; // e.g. "Roll No: 04" or "Zone: Labs Wing"
  securityLevel?: string; // for admin
}

interface IdCardRendererProps {
  data: IdCardData;
  onPrint?: () => void;
  onOpenBatchA4?: () => void;
}

export const IdCardRenderer: React.FC<IdCardRendererProps> = ({ data, onPrint, onOpenBatchA4 }) => {
  const [side, setSide] = useState<'front' | 'back'>('front');

  const getTheme = () => {
    switch (data.type) {
      case 'student':
        return {
          badge: 'STUDENT SMART PASS',
          accentBorder: 'border-cyan-500/60',
          gradientBg: 'from-slate-900 via-cyan-950/40 to-slate-950',
          chipColor: 'from-cyan-400 to-blue-500',
          accentText: 'text-cyan-400',
          tagBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        };
      case 'teacher':
        return {
          badge: 'FACULTY RFID IDENTITY',
          accentBorder: 'border-emerald-500/60',
          gradientBg: 'from-slate-900 via-emerald-950/40 to-slate-950',
          chipColor: 'from-emerald-400 to-teal-500',
          accentText: 'text-emerald-400',
          tagBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      case 'administrator':
        return {
          badge: 'EXECUTIVE CLEARANCE BADGE',
          accentBorder: 'border-purple-500/60',
          gradientBg: 'from-slate-900 via-purple-950/50 to-slate-950',
          chipColor: 'from-amber-400 via-purple-400 to-indigo-500',
          accentText: 'text-purple-400',
          tagBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        };
      case 'staff':
        return {
          badge: 'OPERATIONAL STAFF PASS',
          accentBorder: 'border-amber-500/60',
          gradientBg: 'from-slate-900 via-amber-950/40 to-slate-950',
          chipColor: 'from-amber-400 to-orange-500',
          accentText: 'text-amber-400',
          tagBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
    }
  };

  const theme = getTheme();

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      
      {/* Control bar */}
      <div className="no-print flex flex-wrap items-center justify-between w-full max-w-sm gap-2">
        <button
          type="button"
          onClick={() => setSide(side === 'front' ? 'back' : 'front')}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
          Flip {side === 'front' ? 'Back' : 'Front'}
        </button>

        <div className="flex items-center gap-1.5">
          {onOpenBatchA4 && (
            <button
              type="button"
              onClick={onOpenBatchA4}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/50 text-cyan-300 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Print on A4 9-PVC Card Sheet"
            >
              <Layers className="w-3 h-3 text-cyan-400" />
              9-PVC A4 Sheet
            </button>
          )}

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Card
          </button>
        </div>
      </div>

      {/* The Printable Card (Standard CR80 Credit Card Ratio) */}
      <div 
        id="printable-id-card"
        className={`w-full max-w-sm h-[480px] rounded-3xl p-5 border-2 ${theme.accentBorder} bg-gradient-to-br ${theme.gradientBg} shadow-2xl relative overflow-hidden flex flex-col justify-between select-none transition-all duration-300`}
      >
        {/* Holographic shimmer line */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {side === 'front' ? (
          <>
            {/* Top School Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md">
                    <School className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold font-display text-white tracking-wider block">
                      UNITED GLOBAL SCHOOL
                    </span>
                    <span className="text-[10px] text-cyan-400 font-medium block">
                      Bhakatgaon, Rupahi Town · Assam
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider border ${theme.tagBg}`}>
                  {theme.badge}
                </span>
              </div>

              {/* Holographic Microchip & Contactless RFID Symbol */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {/* Smart Gold/Cyber Chip */}
                  <div className={`w-9 h-7 rounded-md bg-gradient-to-tr ${theme.chipColor} p-0.5 shadow-inner flex flex-col justify-around`}>
                    <div className="h-0.5 bg-black/30 w-full" />
                    <div className="h-0.5 bg-black/30 w-full" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">RFID ENABLED</span>
                </div>

                <div className="text-[11px] font-mono text-slate-400 font-semibold">
                  {data.code}
                </div>
              </div>
            </div>

            {/* Middle Section: Avatar Photo + Bio */}
            <div className="flex flex-col items-center my-2 text-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl p-1 bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 shadow-xl overflow-hidden">
                  <img 
                    src={data.avatar} 
                    alt={data.name} 
                    className="w-full h-full rounded-xl bg-slate-900 object-cover" 
                  />
                </div>
                {data.bloodGroup && (
                  <div className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold shadow-md">
                    {data.bloodGroup}
                  </div>
                )}
              </div>

              <h2 className="text-lg font-extrabold font-display text-white mt-2.5 tracking-tight leading-tight">
                {data.name}
              </h2>
              
              <div className="text-xs font-semibold text-slate-300 mt-0.5">
                {data.roleOrGrade}
              </div>

              {data.departmentOrHouse && (
                <div className={`text-[11px] font-medium mt-1 ${theme.accentText}`}>
                  {data.departmentOrHouse}
                </div>
              )}
            </div>

            {/* Bottom Meta & Barcode Strip */}
            <div>
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-500 block">Identifier:</span>
                  <span className="font-mono font-bold text-white">{data.zoneOrRoll || data.code}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Valid Academic Term:</span>
                  <span className="font-mono font-semibold text-emerald-400">{data.validThrough}</span>
                </div>
              </div>

              {/* Barcode Graphic */}
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                {/* Simulated SVG Barcode */}
                <div className="flex items-center gap-0.5 h-6">
                  {[2, 4, 1, 3, 5, 2, 6, 2, 4, 1, 3, 5, 2, 4, 1, 3, 4, 2].map((w, i) => (
                    <div 
                      key={i} 
                      className="bg-slate-300 h-full" 
                      style={{ width: `${w * 1.5}px` }} 
                    />
                  ))}
                </div>
                <div className="text-[9px] font-mono text-slate-500">
                  SECURE TOKEN ID-2026
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Back Side of ID Card */
          <>
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <span className="text-xs font-bold text-white font-display">
                  INSTITUTIONAL TERMS & TELEMETRY
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  CBSE AFFILIATED
                </span>
              </div>

              {/* Magnetic Stripe graphic */}
              <div className="mt-3 w-full h-8 bg-slate-950 rounded-lg border border-slate-800 flex items-center px-3">
                <div className="w-full h-2 bg-slate-800/60 rounded" />
              </div>

              <div className="mt-4 space-y-2 text-[10px] text-slate-400 leading-relaxed">
                <p>
                  1. This smart card is the official property of United Global School, Bhakatgaon, Rupahi Town.
                </p>
                <p>
                  2. Mandatory for campus entry, biometric gate access, STEM laboratory safety protocols, and digital fee processing.
                </p>
                <p>
                  3. If found, please return to Principal's Directorate or Contact: +91 94350 88210.
                </p>
              </div>
            </div>

            {/* QR Code & Contact Details */}
            <div>
              <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800/80 flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
                  <QrCode className="w-14 h-14 text-slate-950" />
                </div>
                <div className="text-[10px] text-slate-300 space-y-0.5">
                  <div className="font-bold text-white">Emergency Verification:</div>
                  <div>Phone: {data.phone}</div>
                  <div className="truncate max-w-[170px]">Email: {data.email}</div>
                  <div className="text-cyan-400 font-mono">Rupahi, Nagaon, Assam</div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <div className="text-center">
                  <div className="font-serif italic text-white text-xs">Principal ABC</div>
                  <div className="text-[9px] text-slate-500">Principal Signature</div>
                </div>

                <div className="flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Official Seal Verified
                </div>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
};
