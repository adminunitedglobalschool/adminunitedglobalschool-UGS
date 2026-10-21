import React from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HolisticInfographic } from './components/HolisticInfographic';
import { PublicGalleriesSection } from './components/PublicGalleriesSection';
import { PageGateways } from './components/PageGateways';
import { CampusPage } from './pages/CampusPage';
import { SuccessStoriesPage } from './pages/SuccessStoriesPage';
import { FeeStructurePage } from './pages/FeeStructurePage';
import { CircularsPage } from './pages/CircularsPage';
import { Footer } from './components/Footer';
import { AdmissionModal } from './components/AdmissionModal';
import { OfflineAdmissionModal } from './components/OfflineAdmissionModal';
import { PrincipalAppointmentModal } from './components/PrincipalAppointmentModal';
import { DonateTrustModal } from './components/DonateTrustModal';
import { ReceiptModal } from './components/ReceiptModal';
import { AdminPortal } from './components/portals/AdminPortal';
import { TeacherPortal } from './components/portals/TeacherPortal';
import { StudentPortal } from './components/portals/StudentPortal';
import { StaffPortal } from './components/portals/StaffPortal';
import { MasterWebsiteCustomizer } from './components/portals/MasterWebsiteCustomizer';
import { CheckCircle2, ShieldCheck, Users, GraduationCap, CreditCard } from 'lucide-react';

const AppContent: React.FC = () => {
  const { role, setRole, publicPage, toastMessage } = useSchool();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 border border-cyan-500/50 shadow-2xl shadow-cyan-500/20 text-xs font-semibold text-white flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar />

      {/* Role Navigation Strip for instantaneous switching across portals (active in portal views) */}
      {role !== 'public' && (
        <div className="no-print bg-slate-900/60 border-b border-slate-800/80 py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-2 overflow-x-auto scrollbar-none text-xs">
            <button
              onClick={() => setRole('admin')}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap text-xs font-medium flex items-center gap-1.5 ${
                role === 'admin' 
                  ? 'bg-purple-600 text-white font-bold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Admin Panel
            </button>
            <button
              onClick={() => setRole('teacher')}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap text-xs font-medium flex items-center gap-1.5 ${
                role === 'teacher' 
                  ? 'bg-emerald-600 text-white font-bold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              Teachers Portal
            </button>
            <button
              onClick={() => setRole('student')}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap text-xs font-medium flex items-center gap-1.5 ${
                role === 'student' 
                  ? 'bg-blue-600 text-white font-bold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
              Student Portal
            </button>
            <button
              onClick={() => setRole('staff')}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap text-xs font-medium flex items-center gap-1.5 ${
                role === 'staff' 
                  ? 'bg-amber-600 text-slate-950 font-bold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              Staff & Fees
            </button>
          </div>
        </div>
      )}

      {/* Main View Port */}
      <main className="flex-1">
        {role === 'public' && (
          <>
            {publicPage === 'home' && (
              <>
                <HeroSection />
                <PublicGalleriesSection />
                <HolisticInfographic />
                <PageGateways />
              </>
            )}
            {publicPage === 'campus' && <CampusPage />}
            {publicPage === 'success' && <SuccessStoriesPage />}
            {publicPage === 'fees' && <FeeStructurePage />}
            {publicPage === 'circulars' && <CircularsPage />}
          </>
        )}

        {role === 'admin' && <AdminPortal />}
        {role === 'teacher' && <TeacherPortal />}
        {role === 'student' && <StudentPortal />}
        {role === 'staff' && <StaffPortal />}
        {role === 'settings' && <MasterWebsiteCustomizer />}
      </main>

      {/* Global Modals */}
      <AdmissionModal />
      <OfflineAdmissionModal />
      <PrincipalAppointmentModal />
      <DonateTrustModal />
      <ReceiptModal />

      {/* Footer - Only shown on public website pages; hidden in Admin & management portals */}
      {role === 'public' && <Footer />}

    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <AppContent />
    </SchoolProvider>
  );
}
