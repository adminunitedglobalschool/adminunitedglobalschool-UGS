import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { 
  School, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck,
  Award
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setRole, setPublicPage, openAdmissionModal, openDonateModal, siteConfig } = useSchool();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white overflow-hidden shrink-0">
                {siteConfig.logoUrl ? (
                  <img src={siteConfig.logoUrl} alt={siteConfig.schoolName} className="w-full h-full object-contain p-1" />
                ) : (
                  <School className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <span className="text-base font-bold font-display text-white tracking-tight block">
                  {siteConfig.schoolName || 'United Global School'}
                </span>
                <span className="text-[11px] text-cyan-400">
                  {siteConfig.tagline || 'Bhakatgaon, Rupahi Town'}
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Committed to holistic student empowerment across STEM, academics, sports, cultural arts, and leadership in Nagaon district, Assam.
            </p>

            <div className="pt-2 text-[11px] text-slate-400 space-y-1">
              <div>CBSE Affiliation Code: <strong>{siteConfig.affiliationCode || 'UGS-AS-2026-89'}</strong></div>
              <div>School U-DISE Code: <strong>{siteConfig.udiseCode || '18100508901'}</strong></div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => {
                    setRole('public');
                    setPublicPage('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setRole('public');
                    setPublicPage('campus');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Campus & Labs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setRole('public');
                    setPublicPage('success');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Success Stories
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setRole('public');
                    setPublicPage('fees');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Fee Structure
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setRole('public');
                    setPublicPage('circulars');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Notices & Circulars
                </button>
              </li>
              <li>
                <button 
                  onClick={openDonateModal}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Donate Our Trust (80G)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Dedicated Portals */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              School Management Portals
            </div>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => {
                    setRole('super_admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  <span className="font-semibold text-rose-300">Super Admin Portal</span>
                  <span className="text-[10px] text-slate-400">(Credentials & CMS)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setRole('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-purple-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span className="font-semibold text-purple-300">Admin Panel</span>
                  <span className="text-[10px] text-slate-400">(Operations & Students)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setRole('teacher');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Teachers Attendance Desk
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setRole('student');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Student Portal (Fees & Records)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setRole('staff');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Accounts & Digital Fee Counter
                </button>
              </li>
              <li>
                <button 
                  onClick={openAdmissionModal}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                >
                  Online Admission Application
                </button>
              </li>
            </ul>
          </div>

            {/* Contact Details in Bhakatgaon, Rupahi Town */}
            <div className="lg:col-span-3 space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Campus Location
              </div>
              <div className="space-y-2.5 text-xs text-slate-400">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{siteConfig.campusLocation || 'Bhakatgaon, Rupahi Town, Nagaon District, Assam, PIN - 782125'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{siteConfig.phone1 || '+91 94350 88210'} {siteConfig.phone2 ? `/ ${siteConfig.phone2}` : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{siteConfig.email || 'adminunitedglobalschool@gmail.com'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{siteConfig.operatingHours || 'Mon – Sat: 08:00 AM – 03:30 PM IST'}</span>
                </div>
              </div>
            </div>

        </div>

        {/* Bottom copyright row */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © 2026 United Global School, Bhakatgaon, Rupahi Town. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Holistic Education Framework</span>
            <span aria-hidden="true">·</span>
            <span>Digital Fee Management System</span>
            <span aria-hidden="true">·</span>
            <span>Attendance Tracking System</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
