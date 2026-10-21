import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { 
  CreditCard, 
  Check, 
  HelpCircle, 
  Download, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const FeeStructureSection: React.FC = () => {
  const { setRole } = useSchool();
  const [selectedClassGroup, setSelectedClassGroup] = useState<'primary' | 'middle' | 'secondary' | 'senior'>('secondary');

  const feeData = {
    primary: {
      grades: 'Primary Wing (Classes 1 to 5)',
      tuition: 18000,
      stemLab: 4000,
      sportsActivity: 3000,
      annualDev: 5000,
      totalAnnual: 30000,
      quarterlyInstallment: 7500,
    },
    middle: {
      grades: 'Middle Wing (Classes 6 to 8)',
      tuition: 22000,
      stemLab: 5500,
      sportsActivity: 3500,
      annualDev: 5000,
      totalAnnual: 36000,
      quarterlyInstallment: 9000,
    },
    secondary: {
      grades: 'Secondary Wing (Classes 9 & 10)',
      tuition: 26000,
      stemLab: 6000,
      sportsActivity: 4000,
      annualDev: 6000,
      totalAnnual: 42000,
      quarterlyInstallment: 10500,
    },
    senior: {
      grades: 'Senior Secondary (Classes 11 & 12 Science/Arts)',
      tuition: 30000,
      stemLab: 8000,
      sportsActivity: 4000,
      annualDev: 6000,
      totalAnnual: 48000,
      quarterlyInstallment: 12000,
    }
  };

  const current = feeData[selectedClassGroup];

  return (
    <section id="fees-admissions" className="py-16 lg:py-24 border-t border-slate-800 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-2">
              Transparent Financial Management
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              Academic Fee Structure (Session 2026–27)
            </h2>
            <p className="mt-2 text-slate-300 text-sm max-w-2xl">
              Zero hidden charges. Complete digital breakdown covering holistic STEM labs, sports coaching, and smart academics in Bhakatgaon, Rupahi Town.
            </p>
          </div>

          <button
            onClick={() => setRole('staff')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap self-start md:self-auto"
          >
            <CreditCard className="w-4 h-4 text-cyan-400" />
            Open Digital Fee Desk
          </button>
        </div>

        {/* Wing Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
          <button
            onClick={() => setSelectedClassGroup('primary')}
            className={`p-3 rounded-xl text-xs font-semibold transition-all text-center ${
              selectedClassGroup === 'primary'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            Primary (Grades 1–5)
          </button>

          <button
            onClick={() => setSelectedClassGroup('middle')}
            className={`p-3 rounded-xl text-xs font-semibold transition-all text-center ${
              selectedClassGroup === 'middle'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            Middle (Grades 6–8)
          </button>

          <button
            onClick={() => setSelectedClassGroup('secondary')}
            className={`p-3 rounded-xl text-xs font-semibold transition-all text-center ${
              selectedClassGroup === 'secondary'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            Secondary (Grades 9 & 10)
          </button>

          <button
            onClick={() => setSelectedClassGroup('senior')}
            className={`p-3 rounded-xl text-xs font-semibold transition-all text-center ${
              selectedClassGroup === 'senior'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            Senior (Grades 11 & 12)
          </button>
        </div>

        {/* Detailed Breakdown Card */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Breakdown Table */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-base font-bold text-white font-display">
                  {current.grades}
                </span>
                <span className="text-xs text-slate-400">Quarterly Billing Cadence</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-300">Tuition & Smart Classroom Fee</span>
                  <span className="font-mono font-semibold text-white tabular-nums">
                    ₹{current.tuition.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-300">Robotics, 3D Lab & Computer Science</span>
                  <span className="font-mono font-semibold text-white tabular-nums">
                    ₹{current.stemLab.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-300">Athletics, Turf Maintenance & PE Coaching</span>
                  <span className="font-mono font-semibold text-white tabular-nums">
                    ₹{current.sportsActivity.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-300">Annual Campus Infrastructure & Solar Grid</span>
                  <span className="font-mono font-semibold text-white tabular-nums">
                    ₹{current.annualDev.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <span>Optional Transport: ₹800 - ₹1,400/mo depending on distance from Rupahi Town</span>
                <span className="text-emerald-400 font-medium">No Admission Surcharge</span>
              </div>
            </div>

            {/* Right Summary & Action Box */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-6">
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  Total Annual Package
                </div>
                <div className="text-3xl font-extrabold font-display text-white mt-1 tabular-nums">
                  ₹{current.totalAnnual.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-cyan-400 mt-1">
                  Or 4 Quarterly Installments of ₹{current.quarterlyInstallment.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Instant receipt generation with authorized QR code</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Supports UPI, Net Banking, Debit/Credit Card, or Cash Counter</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>10% Sibling Concession & Merit Scholarship available</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setRole('student')}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay Fee in Student Portal
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
