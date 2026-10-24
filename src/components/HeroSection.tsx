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
                  Admissions Open 2026–27 · Online application, downloadable offline form & Principal appointments available on the floating deck.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Campus Imagery (order-1 on mobile so it appears first, order-2 on desktop) */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col space-y-3">
            
            {/* Futuristic Portal HUD Bar at Top of Hero Image */}
            <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 shadow-xl shadow-cyan-950/40">
              <div className="flex items-center justify-between px-2 pb-1.5 border-b border-slate-800/80 mb-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  UGS FUTURISTIC PORTAL DECK
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ACTIVE HUD SYSTEM
                </span>
              </div>

              {/* 4 Futuristic Portal Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  onClick={() => setRole('super_admin')}
                  className={`px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    role === 'super_admin'
                      ? 'bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-rose-600/30 ring-1 ring-rose-400'
                      : 'bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:border-rose-500/50 hover:bg-rose-950/30'
                  }`}
                  title="Super Admin Portal (Master Credentials, Permissions & Website CMS)"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">Super Admin</span>
                </button>

                <button
                  onClick={() => setRole('admin')}
                  className={`px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    role === 'admin'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-purple-600/30 ring-1 ring-purple-400'
                      : 'bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/50 hover:bg-purple-950/30'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="truncate">Admin Panel</span>
                </button>

                <button
                  onClick={() => setRole('teacher')}
                  className={`px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    role === 'teacher'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                      : 'bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-950/30'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">Teachers Portal</span>
                </button>

                <button
                  onClick={() => setRole('student')}
                  className={`px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    role === 'student'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                      : 'bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-blue-950/30'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">Student Portal</span>
                </button>
              </div>
            </div>

            {/* Hero Image Container with Floating Admission & Visitation Deck at Top */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-700/70 shadow-2xl bg-slate-900 flex-1 min-h-[400px] sm:min-h-[480px] lg:min-h-[520px] group">
              <img
                src={siteConfig.heroImageUrl || heroCampusImg}
                alt={`${siteConfig.schoolName || 'United Global School'} Campus, Bhakatgaon, Rupahi Town`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-slate-950/70" />
              
              {/* TOP FLOATING ADMISSION & VISITATION DOCK */}
              <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-20">
                <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-cyan-500/40 shadow-2xl shadow-cyan-950/80 animate-cyber-glow">
                  {/* Status header strip */}
                  <div className="flex items-center justify-between px-2 pb-1.5 border-b border-cyan-500/20 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-cyan-300">
                        ADMISSION & VISITATION DESK · 2026–27
                      </span>
                    </div>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                      BHAKATGAON CAMPUS
                    </span>
                  </div>

                  {/* 3 Floating Buttons Side-by-Side */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* 1. Online Admission Button */}
                    <button
                      onClick={openAdmissionModal}
                      className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-1.5 transition-all group active:scale-95 cursor-pointer ring-1 ring-cyan-300/40 whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-200 group-hover:rotate-12 transition-transform shrink-0" />
                      <span className="truncate">Online Admission</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </button>

                    {/* 2. Offline Admission Form Button */}
                    <button
                      onClick={openOfflineAdmissionModal}
                      className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-300 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-950/40 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">Offline Admission Form</span>
                    </button>

                    {/* 3. Principal Button */}
                    <button
                      onClick={openPrincipalAppointmentModal}
                      className="px-3 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-purple-300 hover:text-white border border-purple-500/40 hover:border-purple-300 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-950/40 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">Principal</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Futuristic Cyber Gallery Quick Gateways Bar at Bottom */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-2.5 sm:p-3 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-cyan-500/40 shadow-2xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-cyan-300">
                    EXCELLENCE SPOTLIGHT
                  </span>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => openPublicGallery('teachers')}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/25 via-teal-500/20 to-cyan-500/20 hover:from-emerald-500/40 hover:to-cyan-500/40 border border-emerald-400/60 hover:border-emerald-300 text-emerald-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/20 group active:scale-95 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>Teachers Gallery</span>
                  </button>

                  <button
                    onClick={() => openPublicGallery('toppers')}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-orange-500/20 hover:from-amber-500/40 hover:to-orange-500/40 border border-amber-400/60 hover:border-amber-300 text-amber-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-amber-500/20 group active:scale-95 cursor-pointer"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Class Toppers Gallery</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
