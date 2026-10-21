import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { UserRole } from '../types/school';
import { 
  GraduationCap, 
  ShieldCheck, 
  Users, 
  UserCheck, 
  CreditCard, 
  Sparkles,
  ChevronDown,
  Menu,
  X,
  School,
  Settings,
  FileText
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
    openPrincipalAppointmentModal 
  } = useSchool();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roleOptions: { key: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: 'public', label: 'Public Website', icon: <School className="w-4 h-4 text-cyan-400" />, desc: 'School Showcase, Campus & Admissions' },
    { key: 'admin', label: 'Admin Portal', icon: <ShieldCheck className="w-4 h-4 text-purple-400" />, desc: 'Principal & Executive Management' },
    { key: 'teacher', label: 'Teacher Portal', icon: <Users className="w-4 h-4 text-emerald-400" />, desc: 'Attendance Marker & Gradebook' },
    { key: 'student', label: 'Student Portal', icon: <GraduationCap className="w-4 h-4 text-blue-400" />, desc: 'Fees, Attendance & Assignments' },
    { key: 'staff', label: 'Staff / Accounts', icon: <CreditCard className="w-4 h-4 text-amber-400" />, desc: 'Digital Fee Counter & Administration' },
    { key: 'settings', label: 'Website Customizer', icon: <Settings className="w-4 h-4 text-cyan-400" />, desc: 'Live Manual Edit, Upload & Delete' },
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setRole('public')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <School className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-display text-white tracking-tight whitespace-nowrap">
                  United Global School
                </span>
                <span className="text-[11px] text-cyan-400 font-medium tracking-wide">
                  Bhakatgaon, Rupahi Town
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Only shown on Public Website; hidden in Admin) */}
          {role === 'public' ? (
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
              <button 
                onClick={() => {
                  setPublicPage('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                  publicPage === 'home' 
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
                Circulars
                {publicPage === 'circulars' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </button>
            </nav>
          ) : role === 'admin' ? (
            <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900 border border-purple-500/30 text-xs font-mono text-purple-300">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_#c084fc]" />
              <span className="font-semibold tracking-wide uppercase">UGS Administration Management</span>
            </div>
          ) : null}

          {/* Zone 3: 1 primary action with Role Switcher (Hidden on public website) */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Role Switcher Pill - Only shown in management/portals, removed on Public Website */}
            {role !== 'public' && (
              <div className="relative">
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500/60 text-white text-xs font-medium transition-all shadow-sm focus:outline-none"
                  aria-expanded={isRoleDropdownOpen}
                >
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    {currentRoleObj.icon}
                    <span className="font-semibold text-slate-100">{currentRoleObj.label}</span>
                  </span>

                  {/* Desktop Chevron */}
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isRoleDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setIsRoleDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Select School Portal
                    </div>
                    <div className="mt-1 space-y-1">
                      {roleOptions.filter(opt => opt.key !== 'settings').map(opt => (
                        <button
                          key={opt.key}
                          onClick={() => {
                            setRole(opt.key);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors ${
                            role === opt.key 
                              ? 'bg-cyan-500/10 border border-cyan-500/30 text-white' 
                              : 'hover:bg-slate-800/80 text-slate-300'
                          }`}
                        >
                          <div className="mt-0.5 p-1.5 rounded-lg bg-slate-800/80">
                            {opt.icon}
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-white flex items-center justify-between">
                              {opt.label}
                              {role === opt.key && (
                                <span className="text-[10px] text-cyan-400 font-medium">Active</span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                              {opt.desc}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu trigger - Only shown on public website */}
            {role === 'public' && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu drawer (Only active for public website) */}
        {mobileMenuOpen && role === 'public' && (
          <div className="md:hidden border-t border-slate-800 py-4 space-y-3">
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
                Circulars
              </button>
            </div>

            {/* Mobile Admission & Visit Actions */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
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

            {/* Subtle Faculty / Admin Portal Access for authorized staff */}
            <div className="pt-2 border-t border-slate-800 flex justify-center">
              <button
                onClick={() => {
                  setRole('admin');
                  setMobileMenuOpen(false);
                }}
                className="text-[11px] font-medium text-slate-400 hover:text-cyan-400 py-1 transition-colors cursor-pointer"
              >
                Staff & Admin Portal Access
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
