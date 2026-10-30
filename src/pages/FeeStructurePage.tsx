import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { 
  CreditCard, 
  Check, 
  HelpCircle, 
  Download, 
  Calculator, 
  ShieldCheck, 
  Bus, 
  Sparkles,
  ArrowRight,
  FileText
} from 'lucide-react';

export const FeeStructurePage: React.FC = () => {
  const { setRole, setPublicPage, openAdmissionModal, showToast } = useSchool();
  
  const [selectedWing, setSelectedWing] = useState<'primary' | 'middle' | 'secondary' | 'senior'>('secondary');
  const [transportRoute, setTransportRoute] = useState<'none' | 'local' | 'rupahi' | 'nagaon'>('local');
  const [billingPlan, setBillingPlan] = useState<'quarterly' | 'annual'>('quarterly');

  const wingData = {
    primary: {
      name: 'Primary Wing (Classes 1 to 5)',
      tuition: 18000,
      stemLab: 4000,
      sportsActivity: 3000,
      annualDev: 5000,
      baseAnnual: 30000,
    },
    middle: {
      name: 'Middle Wing (Classes 6 to 8)',
      tuition: 22000,
      stemLab: 5500,
      sportsActivity: 3500,
      annualDev: 5000,
      baseAnnual: 36000,
    },
    secondary: {
      name: 'Secondary Wing (Classes 9 & 10)',
      tuition: 26000,
      stemLab: 6000,
      sportsActivity: 4000,
      annualDev: 6000,
      baseAnnual: 42000,
    },
    senior: {
      name: 'Senior Secondary (Classes 11 & 12 Science/Arts)',
      tuition: 30000,
      stemLab: 8000,
      sportsActivity: 4000,
      annualDev: 6000,
      baseAnnual: 48000,
    }
  };

  const transportRates = {
    none: 0,
    local: 9600,   // ₹800/mo * 12
    rupahi: 12000, // ₹1,000/mo * 12
    nagaon: 16800  // ₹1,400/mo * 12
  };

  const current = wingData[selectedWing];
  const transportCost = transportRates[transportRoute];
  const annualTotalRaw = current.baseAnnual + transportCost;
  const annualTotal = billingPlan === 'annual' ? Math.round(annualTotalRaw * 0.95) : annualTotalRaw;
  const installmentAmount = Math.round(annualTotal / 4);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-cyan-500/30 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono tracking-widest uppercase">
            <CreditCard className="w-4 h-4" />
            Session 2026–27 Fee Governance
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white tracking-tight leading-tight">
            Academic Fee Schedules & Smart Calculator
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            United Global School guarantees 100% financial transparency. Zero hidden surcharges, zero capitation fees. All academic STEM laboratories, sports turf maintenance, and smart classroom amenities are included.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={() => showToast('Official Fee Schedule Prospectus downloaded!')}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Official Prospectus PDF
            </button>
            <button
              onClick={() => setRole('staff')}
              className="text-slate-300 hover:text-white font-medium"
            >
              Access Staff Fee Counter Desk →
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Fee Estimator & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Calculator Controls */}
        <div className="lg:col-span-7 space-y-6 bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400 tracking-wider">
            <Calculator className="w-4 h-4" />
            Interactive Tuition Estimator
          </div>

          {/* 1. Wing Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              1. Select Student Grade Wing:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setSelectedWing('primary')}
                className={`p-3 rounded-xl text-xs font-bold transition-all text-center ${
                  selectedWing === 'primary'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Primary (1–5)
              </button>
              <button
                onClick={() => setSelectedWing('middle')}
                className={`p-3 rounded-xl text-xs font-bold transition-all text-center ${
                  selectedWing === 'middle'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Middle (6–8)
              </button>
              <button
                onClick={() => setSelectedWing('secondary')}
                className={`p-3 rounded-xl text-xs font-bold transition-all text-center ${
                  selectedWing === 'secondary'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Secondary (9–10)
              </button>
              <button
                onClick={() => setSelectedWing('senior')}
                className={`p-3 rounded-xl text-xs font-bold transition-all text-center ${
                  selectedWing === 'senior'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Senior (11–12)
              </button>
            </div>
          </div>

          {/* 2. Optional Transport Route */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              2. Optional Transport Facility (GPS Bus):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setTransportRoute('none')}
                className={`p-3 rounded-xl text-xs font-medium transition-all text-center ${
                  transportRoute === 'none'
                    ? 'bg-blue-600 text-white font-bold shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Self Commute (₹0)
              </button>
              <button
                onClick={() => setTransportRoute('local')}
                className={`p-3 rounded-xl text-xs font-medium transition-all text-center ${
                  transportRoute === 'local'
                    ? 'bg-blue-600 text-white font-bold shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Rupahi Local (₹800/mo)
              </button>
              <button
                onClick={() => setTransportRoute('rupahi')}
                className={`p-3 rounded-xl text-xs font-medium transition-all text-center ${
                  transportRoute === 'rupahi'
                    ? 'bg-blue-600 text-white font-bold shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Rupahi Town (₹1,000/mo)
              </button>
              <button
                onClick={() => setTransportRoute('nagaon')}
                className={`p-3 rounded-xl text-xs font-medium transition-all text-center ${
                  transportRoute === 'nagaon'
                    ? 'bg-blue-600 text-white font-bold shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Nagaon Bypass (₹1,400/mo)
              </button>
            </div>
          </div>

          {/* 3. Payment Cadence */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              3. Billing Cadence & Term:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setBillingPlan('quarterly')}
                className={`p-3 rounded-xl text-xs font-bold transition-all text-center ${
                  billingPlan === 'quarterly'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Quarterly (4 Installments)
              </button>
              <button
                onClick={() => setBillingPlan('annual')}
                className={`p-3 rounded-xl text-xs font-bold transition-all text-center ${
                  billingPlan === 'annual'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                One-Time Annual (5% Early Waiver)
              </button>
            </div>
          </div>

          {/* Itemized Breakdown Table */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2.5 text-xs">
            <div className="font-bold text-slate-200">Itemized Fee Particulars:</div>
            
            <div className="flex justify-between py-1.5 border-b border-slate-800/60 text-slate-300">
              <span>Tuition & Smart Classroom AV</span>
              <span className="font-mono font-bold text-white tabular-nums">₹{current.tuition.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60 text-slate-300">
              <span>Robotics, 3D Labs & Computing Science</span>
              <span className="font-mono font-bold text-white tabular-nums">₹{current.stemLab.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60 text-slate-300">
              <span>Athletics, Track Maintenance & Coaching</span>
              <span className="font-mono font-bold text-white tabular-nums">₹{current.sportsActivity.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60 text-slate-300">
              <span>Annual Campus Eco-Solar Infrastructure</span>
              <span className="font-mono font-bold text-white tabular-nums">₹{current.annualDev.toLocaleString('en-IN')}</span>
            </div>
            {transportCost > 0 && (
              <div className="flex justify-between py-1.5 border-b border-slate-800/60 text-slate-300">
                <span>GPS Bus Fleet Transport (12 Months)</span>
                <span className="font-mono font-bold text-cyan-400 tabular-nums">₹{transportCost.toLocaleString('en-IN')}</span>
              </div>
            )}
            {billingPlan === 'annual' && (
              <div className="flex justify-between py-1.5 text-emerald-400 font-semibold">
                <span>5% One-Time Advance Concession</span>
                <span className="font-mono tabular-nums">-₹{(annualTotalRaw - annualTotal).toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Calculated Total Card */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">
              {billingPlan === 'annual' ? 'Net Annual Amount' : 'Quarterly Payable Amount'}
            </div>
            
            <div className="text-3xl sm:text-4xl font-black font-display text-white mt-1 tabular-nums">
              ₹{billingPlan === 'annual' ? annualTotal.toLocaleString('en-IN') : installmentAmount.toLocaleString('en-IN')}
            </div>

            <div className="text-xs text-cyan-400 mt-1 font-mono">
              {billingPlan === 'annual' ? 'Full Session 2026-27 Settlement' : 'Per Quarter (4 Installments Totaling ₹' + annualTotal.toLocaleString('en-IN') + ')'}
            </div>

            {/* Scholarships & Concessions Notice */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Special Concessions Available:
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                • <strong>Sibling Discount</strong>: 10% waiver on tuition fees for 2nd child.<br />
                • <strong>Merit Scholarship</strong>: Up to 50% tuition waiver for top 3 district rankers in state science & maths talent exams.
              </p>
            </div>

            <div className="mt-6 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero admission surcharge or security deposit forfeiture</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant automated receipts with authorized school seal</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Payable online via UPI, NetBanking, Card or Counter Desk</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
            <button
              onClick={() => setRole('student')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Pay School Fee in Student Portal
            </button>
            <button
              onClick={() => setPublicPage('home')}
              className="w-full text-center text-xs text-slate-400 hover:text-white"
            >
              ← Return to Main Homepage
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
