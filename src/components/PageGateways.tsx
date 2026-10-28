import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { 
  Cpu, 
  Trophy, 
  CreditCard, 
  Bell, 
  ArrowRight, 
  Sparkles,
  Layers,
  Award,
  Calendar
} from 'lucide-react';
import stemLabImg from '../assets/images/stem_robotics_lab_1791694879429.jpg';
import sportsImg from '../assets/images/school_sports_athletics_1791694891463.jpg';

export const PageGateways: React.FC = () => {
  const { setPublicPage } = useSchool();

  return (
    <section className="py-16 lg:py-20 border-t border-slate-800 bg-slate-950/70 relative">
      <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Animated Futuristic Section Header Box */}
        <div className="relative group w-full max-w-6xl xl:max-w-7xl mx-auto mb-12">
          {/* Outer Ambient Glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/25 via-blue-600/25 to-indigo-600/25 blur-xl opacity-40 group-hover:opacity-60 transition-all duration-700 animate-pulse pointer-events-none" />

          {/* Main Cyber Box Enclosure */}
          <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10 rounded-3xl bg-slate-950/90 backdrop-blur-xl border border-cyan-500/40 animate-cyber-glow text-center shadow-2xl shadow-cyan-950/50">
            
            {/* Cyber Corner HUD Tech Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

            {/* Animated Light Sweep Line */}
            <div className="absolute inset-y-0 w-36 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent pointer-events-none animate-cyber-shine" />

            {/* Category Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs text-cyan-300 font-semibold tracking-wide uppercase mb-3.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Dedicated Institutional Portals</span>
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black font-display tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 leading-tight">
              Explore Our Comprehensive School Domains
            </h2>

            {/* Subtext description */}
            <p className="mt-4 max-w-3xl lg:max-w-4xl mx-auto text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed font-normal">
              Access in-depth documentation, live telemetry, and official resources across our specialized dedicated institutional portals.
            </p>
          </div>
        </div>

        {/* 4 Futuristic Gateway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Gateway 1: Campus & Labs */}
          <div 
            onClick={() => {
              setPublicPage('campus');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col justify-between shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="text-[11px] font-mono text-cyan-400 font-semibold uppercase">
                5.2-Acre Infrastructure
              </div>
              <h3 className="text-lg font-bold font-display text-white mt-1 group-hover:text-cyan-300 transition-colors">
                Campus & Labs
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Explore the 3D robotics lab, Olympic-standard athletics turf, cultural arts studio, and 65 kW solar grid in Bhakatgaon.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400 mt-6">
              <span>View Full Campus Page</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Gateway 2: Success Stories */}
          <div 
            onClick={() => {
              setPublicPage('success');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group flex flex-col justify-between shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-105 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="text-[11px] font-mono text-amber-400 font-semibold uppercase">
                Hall of Excellence
              </div>
              <h3 className="text-lg font-bold font-display text-white mt-1 group-hover:text-amber-300 transition-colors">
                Success Stories
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Review student laurels in National STEM Olympiads, Assam State Taekwondo, classical violin, and CBSE distinction tallies.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-400 mt-6">
              <span>View Hall of Fame</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Gateway 3: Fee Structure */}
          <div 
            onClick={() => {
              setPublicPage('fees');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group flex flex-col justify-between shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-105 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="text-[11px] font-mono text-emerald-400 font-semibold uppercase">
                Smart Fee Calculator
              </div>
              <h3 className="text-lg font-bold font-display text-white mt-1 group-hover:text-emerald-300 transition-colors">
                Fee Structure
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Transparent schedules for Primary to Senior Secondary wings, interactive transport route estimator, and waiver criteria.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400 mt-6">
              <span>Estimate & Pay Fees</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Gateway 4: Circulars */}
          <div 
            onClick={() => {
              setPublicPage('circulars');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer group flex flex-col justify-between shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-105 transition-transform">
                <Bell className="w-6 h-6" />
              </div>
              <div className="text-[11px] font-mono text-purple-400 font-semibold uppercase">
                Official Bulletin
              </div>
              <h3 className="text-lg font-bold font-display text-white mt-1 group-hover:text-purple-300 transition-colors">
                Notices & Circulars
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Live official notice dispatches, mid-term examination routines, sports trial notifications, and academic calendar 2026-27.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-purple-400 mt-6">
              <span>Read Notices</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
