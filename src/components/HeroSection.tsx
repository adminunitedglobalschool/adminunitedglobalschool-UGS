import React, { useState, useEffect } from 'react';
import { useSchool } from '../context/SchoolContext';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
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
    openPrincipalAppointmentModal,
    openDonateModal,
    openPublicGallery,
    siteConfig,
    administrators = [],
    teachers = []
  } = useSchool();

  const [adminIndex, setAdminIndex] = useState(0);
  const [teacherIndex, setTeacherIndex] = useState(0);
  const [adminFading, setAdminFading] = useState(false);
  const [teacherFading, setTeacherFading] = useState(false);

  // Auto-cycle administrators
  useEffect(() => {
    if (!administrators || administrators.length <= 1) return;
    const interval = setInterval(() => {
      setAdminFading(true);
      setTimeout(() => {
        setAdminIndex((prev) => (prev + 1) % administrators.length);
        setAdminFading(false);
      }, 250);
    }, 4000);
    return () => clearInterval(interval);
  }, [administrators]);

  // Auto-cycle teachers (offset by 2s for lively futuristic alternating feel)
  useEffect(() => {
    if (!teachers || teachers.length <= 1) return;
    const initialDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setTeacherFading(true);
        setTimeout(() => {
          setTeacherIndex((prev) => (prev + 1) % teachers.length);
          setTeacherFading(false);
        }, 250);
      }, 4000);
      return () => clearInterval(interval);
    }, 2000);
    return () => clearTimeout(initialDelay);
  }, [teachers]);

  const currentAdmin = administrators && administrators.length > 0 
    ? administrators[adminIndex % administrators.length] 
    : null;
  const currentTeacher = teachers && teachers.length > 0 
    ? teachers[teacherIndex % teachers.length] 
    : null;

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-gradient-to-b from-cyan-600/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        


        {/* Main 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column - Leadership & Faculty Showcase (order-2 on mobile, order-1 on desktop) */}
          <div className="order-2 lg:order-1 lg:col-span-6 flex flex-col">
            {/* Dual-Column Futuristic Showcase Box: Leadership & Faculty */}
            <div className="relative group">
                {/* Outer Ambient Glow Effect */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-600/30 via-cyan-500/30 to-emerald-600/30 opacity-40 group-hover:opacity-60 blur-xl transition-all duration-700 animate-pulse pointer-events-none" />
                
                {/* Main Cyber Enclosure */}
                <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-950/92 backdrop-blur-xl border border-cyan-500/40 shadow-2xl animate-cyber-glow">
                  
                  {/* Cyber Corner HUD Tech Accents */}
                  <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

                  {/* Animated Light Sweep Line */}
                  <div className="absolute inset-y-0 w-28 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent pointer-events-none animate-cyber-shine" />

                  {/* Dual Column Layout: Column 1 (Admins) | Column 2 (Teachers) */}
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-4 relative z-10">
                    
                    {/* Column 1: Administrators / Leadership Showcase */}
                    <div 
                      onClick={() => openPrincipalAppointmentModal()}
                      className="group/admin p-2 sm:p-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-900 border border-purple-500/40 hover:border-purple-400 shadow-xl shadow-purple-950/40 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
                      title="Click to view Leadership / Schedule Appointment"
                    >
                      {/* Top Cyber Ambient Glow */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-60" />

                      {/* Large Photo Frame (Stylish Cyber Portrait) */}
                      <div className="relative w-full h-36 sm:h-48 md:h-52 rounded-xl overflow-hidden bg-slate-950 border border-purple-500/30 group-hover/admin:border-purple-400/80 shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all">
                        {/* Corner HUD Brackets on Photo */}
                        <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-purple-400 z-20 pointer-events-none" />
                        <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-purple-400 z-20 pointer-events-none" />
                        <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-purple-400 z-20 pointer-events-none" />
                        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-purple-400 z-20 pointer-events-none" />

                        {/* Top-Left Live HUD Badge */}
                        <div className="absolute top-2 left-2 z-20 flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono font-bold tracking-wider bg-slate-950/85 backdrop-blur-md text-purple-300 border border-purple-500/40 shadow-sm">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-400"></span>
                          </span>
                          <span className="hidden xs:inline sm:inline">LEADERSHIP</span>
                          <span className="xs:hidden sm:hidden">ADMIN</span>
                        </div>

                        {/* Top-Right Index Pill */}
                        <div className="absolute top-2 right-2 z-20 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-semibold bg-slate-950/85 backdrop-blur-md text-purple-300/90 border border-purple-500/30 shadow-sm">
                          {administrators.length > 0 ? `${(adminIndex % administrators.length) + 1}/${administrators.length}` : '1/1'}
                        </div>

                        {/* The Large Avatar Image with cross-fade */}
                        {currentAdmin && (
                          <div className={`w-full h-full transition-all duration-300 ${adminFading ? 'opacity-20 scale-95' : 'opacity-100 scale-100'}`}>
                            <img
                              src={currentAdmin.avatar}
                              alt={currentAdmin.name}
                              className="w-full h-full object-cover object-top sm:object-center group-hover/admin:scale-105 transition-transform duration-500"
                            />
                            {/* Subtle dark vignette on photo */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/20 pointer-events-none" />
                          </div>
                        )}

                        {/* Bottom Navigation Indicator Dots inside Photo */}
                        {administrators.length > 1 && (
                          <div className="absolute bottom-1.5 inset-x-0 z-20 flex justify-center items-center gap-1 pointer-events-none">
                            {administrators.map((_, idx) => (
                              <span 
                                key={idx} 
                                className={`h-1 rounded-full transition-all duration-300 ${
                                  idx === (adminIndex % administrators.length) 
                                    ? 'w-3.5 bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]' 
                                    : 'w-1 bg-slate-600/70'
                                }`} 
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Economical, stylish & well-designed details below photo */}
                      {currentAdmin && (
                        <div className={`mt-2 pt-1 transition-all duration-300 ${adminFading ? 'opacity-20' : 'opacity-100'}`}>
                          <h3 className="text-xs sm:text-sm font-bold text-white group-hover/admin:text-purple-200 transition-colors truncate">
                            {currentAdmin.name}
                          </h3>
                          
                          <p className="text-[10px] sm:text-[11px] font-medium text-purple-300 truncate mt-0.5">
                            {currentAdmin.role}
                          </p>

                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-950/90 text-purple-300 border border-purple-500/30 truncate">
                              {currentAdmin.accessLevel || 'Super Admin'}
                            </span>
                            {currentAdmin.qualification && (
                              <span className="text-[9px] text-slate-400 font-mono truncate hidden sm:inline">
                                {currentAdmin.qualification}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Footer micro-action */}
                      <div className="mt-2 pt-1.5 border-t border-purple-500/20 flex items-center justify-between text-[9px] font-mono text-purple-400/80">
                        <span className="flex items-center gap-1 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                          <span className="truncate">DIRECTIVE</span>
                        </span>
                        <span className="text-slate-400 group-hover/admin:text-purple-300 flex items-center gap-0.5 shrink-0">
                          <span>Meet</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>

                    {/* Column 2: Teachers / STEM Mentors Showcase */}
                    <div 
                      onClick={() => openPublicGallery('teachers')}
                      className="group/teacher p-2 sm:p-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-900 border border-emerald-500/40 hover:border-emerald-400 shadow-xl shadow-emerald-950/40 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
                      title="Click to view Faculty & Teachers Gallery"
                    >
                      {/* Top Cyber Ambient Glow */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-60" />

                      {/* Large Photo Frame (Stylish Cyber Portrait) */}
                      <div className="relative w-full h-36 sm:h-48 md:h-52 rounded-xl overflow-hidden bg-slate-950 border border-emerald-500/30 group-hover/teacher:border-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,0.25)] transition-all">
                        {/* Corner HUD Brackets on Photo */}
                        <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-emerald-400 z-20 pointer-events-none" />
                        <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-emerald-400 z-20 pointer-events-none" />
                        <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-emerald-400 z-20 pointer-events-none" />
                        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-emerald-400 z-20 pointer-events-none" />

                        {/* Top-Left Live HUD Badge */}
                        <div className="absolute top-2 left-2 z-20 flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono font-bold tracking-wider bg-slate-950/85 backdrop-blur-md text-emerald-300 border border-emerald-500/40 shadow-sm">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                          </span>
                          <span className="hidden xs:inline sm:inline">FACULTY</span>
                          <span className="xs:hidden sm:hidden">MENTOR</span>
                        </div>

                        {/* Top-Right Index Pill */}
                        <div className="absolute top-2 right-2 z-20 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-semibold bg-slate-950/85 backdrop-blur-md text-emerald-300/90 border border-emerald-500/30 shadow-sm">
                          {teachers.length > 0 ? `${(teacherIndex % teachers.length) + 1}/${teachers.length}` : '1/1'}
                        </div>

                        {/* The Large Avatar Image with cross-fade */}
                        {currentTeacher && (
                          <div className={`w-full h-full transition-all duration-300 ${teacherFading ? 'opacity-20 scale-95' : 'opacity-100 scale-100'}`}>
                            <img
                              src={currentTeacher.avatar}
                              alt={currentTeacher.name}
                              className="w-full h-full object-cover object-top sm:object-center group-hover/teacher:scale-105 transition-transform duration-500"
                            />
                            {/* Subtle dark vignette on photo */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/20 pointer-events-none" />
                          </div>
                        )}

                        {/* Bottom Navigation Indicator Dots inside Photo */}
                        {teachers.length > 1 && (
                          <div className="absolute bottom-1.5 inset-x-0 z-20 flex justify-center items-center gap-1 pointer-events-none">
                            {teachers.map((_, idx) => (
                              <span 
                                key={idx} 
                                className={`h-1 rounded-full transition-all duration-300 ${
                                  idx === (teacherIndex % teachers.length) 
                                    ? 'w-3.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' 
                                    : 'w-1 bg-slate-600/70'
                                }`} 
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Economical, stylish & well-designed details below photo */}
                      {currentTeacher && (
                        <div className={`mt-2 pt-1 transition-all duration-300 ${teacherFading ? 'opacity-20' : 'opacity-100'}`}>
                          <h3 className="text-xs sm:text-sm font-bold text-white group-hover/teacher:text-emerald-200 transition-colors truncate">
                            {currentTeacher.name}
                          </h3>
                          
                          <p className="text-[10px] sm:text-[11px] font-medium text-emerald-300 truncate mt-0.5">
                            {currentTeacher.designation}
                          </p>

                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/30 truncate">
                              {currentTeacher.subject}
                            </span>
                            {currentTeacher.qualification && (
                              <span className="text-[9px] text-slate-400 font-mono truncate hidden sm:inline">
                                {currentTeacher.qualification}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Footer micro-action */}
                      <div className="mt-2 pt-1.5 border-t border-emerald-500/20 flex items-center justify-between text-[9px] font-mono text-emerald-400/80">
                        <span className="flex items-center gap-1 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="truncate">STEM LEAD</span>
                        </span>
                        <span className="text-slate-400 group-hover/teacher:text-emerald-300 flex items-center gap-0.5 shrink-0">
                          <span>Gallery</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>

          {/* Right Column - Hero Campus Imagery (order-1 on mobile so it appears first, order-2 on desktop) */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col w-full">

            {/* Hero Image Container - sleek & compact height in both desktop and mobile */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-700/70 shadow-2xl bg-slate-900 h-44 xs:h-52 sm:h-64 lg:h-[340px] xl:h-[360px] min-h-[180px] xs:min-h-[200px] sm:min-h-[250px] lg:min-h-[340px] group">
              <img
                src={siteConfig.heroImageUrl || heroCampusImg}
                alt={`${siteConfig.schoolName || 'United Global School'} Campus, Rupahi Town`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-slate-950/40" />

              {/* Floating Transparent 'Donate Our Trust' Button at Top */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
                <button
                  onClick={openDonateModal}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-slate-950/50 hover:bg-slate-900/80 backdrop-blur-md border border-emerald-400/50 hover:border-emerald-300 text-emerald-300 hover:text-white font-bold text-xs sm:text-sm shadow-xl shadow-black/60 hover:shadow-emerald-950/50 transition-all flex items-center gap-2 cursor-pointer group/btn active:scale-95"
                >
                  <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400/40 group-hover/btn:fill-emerald-400 group-hover/btn:scale-110 transition-transform" />
                  <span className="tracking-wide">Donate Our Trust</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
