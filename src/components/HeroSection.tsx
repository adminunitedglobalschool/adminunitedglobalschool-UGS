import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { 
  ArrowRight, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  CreditCard,
  CheckCircle2,
  Play,
  School,
  Trophy,
  Award,
  FileText,
  UserCheck,
  Heart,
  ShieldAlert
} from 'lucide-react';
import heroCampusImg from '../assets/images/hero_united_global_school_1791694864291.jpg';

export const HeroSection: React.FC = () => {
  const { 
    role, 
    setRole, 
    setPublicPage, 
    openAdmissionModal, 
    openOfflineAdmissionModal,
    openPrincipalAppointmentModal,
    openDonateModal,
    openPublicGallery,
    siteConfig
  } = useSchool();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-gradient-to-b from-cyan-600/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        


        {/* Main 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          
          {/* Left Column - Headline & Core Value (order-2 on mobile, order-1 on desktop) */}
          <div className="order-2 lg:order-1 lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Animated Futuristic Box for United Global School */}
              <div className="relative group mb-5">
                {/* Outer Ambient Glow Effect */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 opacity-30 group-hover:opacity-50 blur-xl transition-all duration-700 animate-pulse" />
                
                {/* Main Cyber Enclosure */}
                <div className="relative overflow-hidden p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-950/90 backdrop-blur-xl border border-cyan-500/50 animate-cyber-glow">
                  
                  {/* Cyber Corner HUD Tech Accents */}
                  <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

                  {/* Animated Light Sweep Line */}
                  <div className="absolute inset-y-0 w-28 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent pointer-events-none animate-cyber-shine" />

                  {/* United Global School Main Title - Center Aligned */}
                  <div className="flex flex-col items-center justify-center text-center gap-4 sm:gap-5">
                    {/* Glowing Logo Emblem - Enlarged */}
                    <div className="relative shrink-0 flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-cyan-500/25 via-blue-600/30 to-indigo-600/30 border-2 border-cyan-400/60 shadow-[0_0_35px_rgba(6,182,212,0.45)] group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                      <div className="absolute inset-1 rounded-2xl bg-cyan-400/10 animate-pulse pointer-events-none" />
                      {siteConfig.logoUrl ? (
                        <img 
                          src={siteConfig.logoUrl} 
                          alt={siteConfig.schoolName} 
                          className="w-full h-full object-contain p-2 rounded-2xl relative z-10" 
                        />
                      ) : (
                        <School className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-300 relative z-10" />
                      )}
                    </div>

                    <div className="space-y-1 text-center">
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-display tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 whitespace-nowrap text-center">
                        {siteConfig.schoolName || 'United Global School'}
                      </h1>
                      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs font-mono text-cyan-400/90 font-medium text-center">
                        <span>{siteConfig.tagline || 'BHAKATGAON, RUPAHI TOWN'}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-400">NAGAON, ASSAM</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                United Global School converges academic rigor with applied robotics, athletic discipline, and ethical leadership to shape visionary global thinkers.
              </p>

              {/* Core differentiators */}
              <div className="mt-5 space-y-2 text-sm text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Integrated 5-Pillar Holistic Pedagogy</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Biometric Attendance & Automated Guardian Telemetry</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Digital Treasury Suite & Frictionless E-Invoicing</span>
                </div>
              </div>

              {/* Campus Location & Curriculum Line */}
              <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  Bhakatgaon, Rupahi Town · Nagaon, Assam
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-300 font-medium">CBSE Curriculum & Futuristic STEM Program</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-emerald-400 font-semibold">Admissions Open 2026–27</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={openDonateModal}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all flex items-center gap-2 cursor-pointer group active:scale-95 ring-1 ring-emerald-400/40"
                >
                  <Heart className="w-4 h-4 text-emerald-200 fill-emerald-300 group-hover:scale-110 transition-transform" />
                  <span>Donate Our Trust</span>
                </button>
                <button
                  onClick={() => setPublicPage('fees')}
                  className="px-5 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700 font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  Fee Structure 2026–27
                </button>
              </div>

              {/* Helpful admission status indicator */}
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>
                  Admissions Open 2026–27 · Online application & offline forms available via the Admission Desk.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Campus Imagery (order-1 on mobile so it appears first, order-2 on desktop) */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col space-y-3">

            {/* Hero Image Container */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-700/70 shadow-2xl bg-slate-900 flex-1 min-h-[400px] sm:min-h-[480px] lg:min-h-[520px] group">
              <img
                src={siteConfig.heroImageUrl || heroCampusImg}
                alt={`${siteConfig.schoolName || 'United Global School'} Campus, Bhakatgaon, Rupahi Town`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-slate-950/40" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
