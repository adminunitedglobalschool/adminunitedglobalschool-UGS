import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { UserRole } from '../types/school';
import { 
  GraduationCap, 
  ShieldCheck, 
  ShieldAlert,
  Users, 
  UserCheck, 
  CreditCard, 
  Sparkles,
  ChevronDown,
  Menu,
  X,
  School,
  Settings,
  FileText,
  Maximize,
  Minimize,
  Minimize2,
  Tablet,
  LogIn,
  Trophy
} from 'lucide-react';

interface NavbarProps {
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateSection }) => {
  const { 
    role, 
    setRole, 
    publicPage, 
    setPublicPage, 
    openAdmissionModal,
    openOfflineAdmissionModal,
    openPrincipalAppointmentModal,
    openPublicGallery,
    publicGalleryTab,
    siteConfig,
    isFullscreen,
    toggleFullscreen,
    isLeaveScreenView,
    toggleLeaveScreenView
  } = useSchool();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roleOptions: { key: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: 'public', label: 'Public Website', icon: <School className="w-4 h-4 text-cyan-400" />, desc: 'School Showcase, Campus & Admissions' },
    { key: 'super_admin', label: 'Super Admin Portal', icon: <ShieldAlert className="w-4 h-4 text-rose-400" />, desc: 'Master Credentials, RBAC & Website CMS' },
    { key: 'admin', label: 'Admin Panel', icon: <ShieldCheck className="w-4 h-4 text-purple-400" />, desc: 'Operational Management & Students' },
    { key: 'teacher', label: 'Teacher Portal', icon: <Users className="w-4 h-4 text-emerald-400" />, desc: 'Attendance Marker & Gradebook' },
    { key: 'student', label: 'Student Portal', icon: <GraduationCap className="w-4 h-4 text-blue-400" />, desc: 'Fees, Attendance & Assignments' },
    { key: 'staff', label: 'Staff / Accounts', icon: <CreditCard className="w-4 h-4 text-amber-400" />, desc: 'Digital Fee Counter & Administration' },
  ];

  const currentRoleObj = roleOptions.find(r => r.key === role) || roleOptions[0];

  const handleNavClick = (id: string) => {
    if (role !== 'public') {
      setRole('public');
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 overflow-visible w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          
          {/* Zone 1: Campus Emblem / Logo - Always On Top with z-[100] & Floating down towards UGS Live Dispatch */}
          <div className="flex items-center shrink-0 relative z-[100]">
            <button 
              onClick={() => {
                setRole('public');
                setPublicPage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title={siteConfig.schoolName || 'United Global School'}
              aria-label={siteConfig.schoolName || 'United Global School'}
              className="relative z-[100] group focus:outline-none cursor-pointer -top-[2mm] sm:top-[5mm] lg:top-[8mm] translate-y-3.5 sm:translate-y-5 lg:translate-y-6 pointer-events-auto"
            >
              {/* Outer Cyan/Blue Cyber Pulse Glow */}
              <div className="absolute -inset-1 sm:-inset-1.5 rounded-2xl bg-gradient-to-tr from-cyan-500/50 via-blue-500/40 to-indigo-500/50 opacity-75 group-hover:opacity-100 blur-md transition-all duration-300 pointer-events-none" />
              
              {/* Scaled-up Floating Emblem Box (Bigger on mobile) */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-2xl bg-slate-950/95 border-2 border-cyan-400 group-hover:border-cyan-300 shadow-[0_10px_30px_rgba(6,182,212,0.5)] flex items-center justify-center p-1.5 backdrop-blur-xl group-hover:scale-105 transition-all duration-300">
                {/* Tech Corner Accents */}
                <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-300 pointer-events-none" />
                <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-cyan-300 pointer-events-none" />
                <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-cyan-300 pointer-events-none" />
                <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-300 pointer-events-none" />

                {siteConfig.logoUrl ? (
                  <img 
                    src={siteConfig.logoUrl} 
                    alt={siteConfig.schoolName || 'United Global School'} 
                    className="w-full h-full object-contain p-0.5 filter drop-shadow-[0_2px_8px_rgba(6,182,212,0.5)]" 
                  />
                ) : (
                  <School className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 text-cyan-300" />
                )}
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Only shown on Public Website; hidden in Admin & Tablet view) */}
          {role === 'public' ? (
            <nav className={`${isLeaveScreenView ? 'hidden' : 'hidden md:flex'} items-center gap-3.5 lg:gap-5 xl:gap-6 text-sm font-medium text-slate-300`}>
              <button 
                onClick={() => {
                  setPublicPage('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                  publicPage === 'home' && !publicGalleryTab
                    ? 'text-cyan-400 font-semibold' 
                    : 'hover:text-cyan-400 text-slate-300'
                }`}
              >
                Home
                {publicPage === 'home' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </button>
              <button 
                onClick={() => {
                  setPublicPage('campus');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                  publicPage === 'campus' 
                    ? 'text-cyan-400 font-semibold' 
                    : 'hover:text-cyan-400 text-slate-300'
                }`}
              >
                Campus & Labs
                {publicPage === 'campus' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </button>
              <button 
                onClick={() => {
                  setPublicPage('success');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                  publicPage === 'success' 
                    ? 'text-cyan-400 font-semibold' 
                    : 'hover:text-cyan-400 text-slate-300'
                }`}
              >
                Success Stories
                {publicPage === 'success' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </button>
              <button 
                onClick={() => {
                  setPublicPage('fees');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                  publicPage === 'fees' 
                    ? 'text-cyan-400 font-semibold' 
                    : 'hover:text-cyan-400 text-slate-300'
                }`}
              >
                Fee Structure
                {publicPage === 'fees' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </button>
              <button 
                onClick={() => {
                  setPublicPage('circulars');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                  publicPage === 'circulars' 
                    ? 'text-cyan-400 font-semibold' 
                    : 'hover:text-cyan-400 text-slate-300'
                }`}
              >
                Notices
                {publicPage === 'circulars' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </button>
            </nav>
          ) : role === 'super_admin' ? (
            <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900 border border-rose-500/30 text-xs font-mono text-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shadow-[0_0_8px_#fb7185]" />
              <span className="font-semibold tracking-wide uppercase">Super Admin Master Directorate</span>
            </div>
          ) : role === 'admin' ? (
            <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900 border border-purple-500/30 text-xs font-mono text-purple-300">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_#c084fc]" />
              <span className="font-semibold tracking-wide uppercase">UGS Admin Operations</span>
            </div>
          ) : null}

          {/* Zone 3: UGS Login Desk Dropdown (Super Admin, Admin, Teachers, Student) */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* UGS Login Desk Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md transition-all focus:outline-none cursor-pointer group active:scale-95 ${
                  role === 'public'
                    ? 'bg-gradient-to-r from-cyan-600/25 via-blue-600/25 to-indigo-600/25 hover:from-cyan-600/40 hover:to-indigo-600/40 border border-cyan-400/50 hover:border-cyan-300 text-white shadow-cyan-950/50 ring-1 ring-cyan-500/20'
                    : 'bg-slate-900 border border-slate-700/80 hover:border-cyan-500/60 text-white'
                }`}
                aria-expanded={isRoleDropdownOpen}
                title="UGS Login Desk (Super Admin, Admin Panel, Teachers & Student Portals)"
              >
                {role === 'public' ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                    <LogIn className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                    <span className="font-bold tracking-wide whitespace-nowrap">UGS Login Desk</span>
                  </>
                ) : (
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    {currentRoleObj.icon}
                    <span className="font-semibold text-slate-100">{currentRoleObj.label}</span>
                  </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-cyan-400 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* UGS Login Desk Dropdown Menu */}
              {isRoleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-80 bg-slate-950/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/80 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl"
                  onMouseLeave={() => setIsRoleDropdownOpen(false)}
                >
                  <div className="px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                      <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                        UGS Login Desk
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      SECURE ACCESS
                    </span>
                  </div>

                  <div className="mt-1.5 space-y-1">
                    {/* 1. Super Admin */}
                    <button
                      type="button"
                      onClick={() => {
                        setRole('super_admin');
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        role === 'super_admin'
                          ? 'bg-rose-500/15 border border-rose-500/40 text-white'
                          : 'hover:bg-slate-900 text-slate-300 hover:text-white border border-transparent hover:border-slate-800'
                      }`}
                    >
                      <div className="mt-0.5 p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span>Super Admin</span>
                          {role === 'super_admin' && (
                            <span className="text-[10px] text-rose-400 font-mono font-semibold">Active</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Master Credentials, Permissions & CMS
                        </div>
                      </div>
                    </button>

                    {/* 2. Admin Panel */}
                    <button
                      type="button"
                      onClick={() => {
                        setRole('admin');
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        role === 'admin'
                          ? 'bg-purple-500/15 border border-purple-500/40 text-white'
                          : 'hover:bg-slate-900 text-slate-300 hover:text-white border border-transparent hover:border-slate-800'
                      }`}
                    >
                      <div className="mt-0.5 p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span>Admin Panel</span>
                          {role === 'admin' && (
                            <span className="text-[10px] text-purple-400 font-mono font-semibold">Active</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Operational Management & Students
                        </div>
                      </div>
                    </button>

                    {/* 3. Teachers Portal */}
                    <button
                      type="button"
                      onClick={() => {
                        setRole('teacher');
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        role === 'teacher'
                          ? 'bg-emerald-500/15 border border-emerald-500/40 text-white'
                          : 'hover:bg-slate-900 text-slate-300 hover:text-white border border-transparent hover:border-slate-800'
                      }`}
                    >
                      <div className="mt-0.5 p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span>Teachers Portal</span>
                          {role === 'teacher' && (
                            <span className="text-[10px] text-emerald-400 font-mono font-semibold">Active</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Attendance Marker & Gradebook
                        </div>
                      </div>
                    </button>

                    {/* 4. Student Portal */}
                    <button
                      type="button"
                      onClick={() => {
                        setRole('student');
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        role === 'student'
                          ? 'bg-blue-500/15 border border-blue-500/40 text-white'
                          : 'hover:bg-slate-900 text-slate-300 hover:text-white border border-transparent hover:border-slate-800'
                      }`}
                    >
                      <div className="mt-0.5 p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span>Student Portal</span>
                          {role === 'student' && (
                            <span className="text-[10px] text-blue-400 font-mono font-semibold">Active</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Fees, Attendance & Academic Records
                        </div>
                      </div>
                    </button>

                    {/* 5. Staff / Accounts Portal */}
                    <button
                      type="button"
                      onClick={() => {
                        setRole('staff');
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        role === 'staff'
                          ? 'bg-amber-500/15 border border-amber-500/40 text-white'
                          : 'hover:bg-slate-900 text-slate-300 hover:text-white border border-transparent hover:border-slate-800'
                      }`}
                    >
                      <div className="mt-0.5 p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span>Staff / Accounts</span>
                          {role === 'staff' && (
                            <span className="text-[10px] text-amber-400 font-mono font-semibold">Active</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Fee Counter & Terminal Desk
                        </div>
                      </div>
                    </button>

                    {/* Return to Public Website (if in internal portal) */}
                    {role !== 'public' && (
                      <div className="pt-2 border-t border-slate-800/80">
                        <button
                          type="button"
                          onClick={() => {
                            setRole('public');
                            setIsRoleDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
                        >
                          <School className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Return to Public Website</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile/Tablet menu trigger - Shown on mobile */}
            {role === 'public' && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex md:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile/Tablet menu drawer (Active for public website) */}
        {mobileMenuOpen && role === 'public' && (
          <div className={`${isLeaveScreenView ? 'block' : 'md:hidden'} border-t border-slate-800 py-4 space-y-3`}>
            <div className="flex flex-col space-y-2 text-sm font-medium text-slate-300">
              <button 
                onClick={() => {
                  setPublicPage('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg transition-colors ${
                  publicPage === 'home'
                    ? 'bg-cyan-500/10 text-cyan-400 font-bold'
                    : 'hover:bg-slate-800 text-slate-200'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => {
                  setPublicPage('campus');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg transition-colors ${
                  publicPage === 'campus'
                    ? 'bg-cyan-500/10 text-cyan-400 font-bold'
                    : 'hover:bg-slate-800 text-slate-200'
                }`}
              >
                Campus & Labs
              </button>
              <button 
                onClick={() => {
                  setPublicPage('success');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg transition-colors ${
                  publicPage === 'success'
                    ? 'bg-cyan-500/10 text-cyan-400 font-bold'
                    : 'hover:bg-slate-800 text-slate-200'
                }`}
              >
                Success Stories
              </button>
              <button 
                onClick={() => {
                  setPublicPage('fees');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg transition-colors ${
                  publicPage === 'fees'
                    ? 'bg-cyan-500/10 text-cyan-400 font-bold'
                    : 'hover:bg-slate-800 text-slate-200'
                }`}
              >
                Fee Structure
              </button>
              <button 
                onClick={() => {
                  setPublicPage('circulars');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg transition-colors ${
                  publicPage === 'circulars'
                    ? 'bg-cyan-500/10 text-cyan-400 font-bold'
                    : 'hover:bg-slate-800 text-slate-200'
                }`}
              >
                Notices
              </button>
              <button 
                onClick={() => {
                  openPublicGallery('teachers');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  publicPage === 'home' && publicGalleryTab === 'teachers'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'hover:bg-slate-800 text-emerald-400'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Teachers Gallery</span>
              </button>
              <button 
                onClick={() => {
                  openPublicGallery('toppers');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  publicPage === 'home' && publicGalleryTab === 'toppers'
                    ? 'bg-amber-500/20 text-amber-300 font-bold'
                    : 'hover:bg-slate-800 text-amber-400'
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Class Toppers Gallery</span>
              </button>
            </div>

            {/* Mobile Admission & Visit Actions */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider px-3">
                Admissions & Visitation 2026–27
              </span>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    openAdmissionModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Online Admission</span>
                </button>
                <button
                  onClick={() => {
                    openOfflineAdmissionModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 font-semibold text-xs flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Offline Admission Form</span>
                </button>
                <button
                  onClick={() => {
                    openPrincipalAppointmentModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl bg-slate-900 border border-purple-500/30 text-purple-300 font-semibold text-xs flex items-center gap-2"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Principal</span>
                </button>
              </div>
            </div>

            {/* UGS Login Desk for Mobile */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center gap-2 px-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
                  UGS Login Desk
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRole('super_admin');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold text-left cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="truncate">Super Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold text-left cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="truncate">Admin Panel</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('teacher');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-left cursor-pointer"
                >
                  <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">Teachers Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('student');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold text-left cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="truncate">Student Portal</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
