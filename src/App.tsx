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
import { FuturisticNotificationTicker } from './components/FuturisticNotificationTicker';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { role, setRole, publicPage, toastMessage, isLeaveScreenView } = useSchool();

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300 transition-colors duration-300 ${
      isLeaveScreenView 
        ? 'bg-slate-950 sm:bg-slate-900/60 sm:py-4 sm:px-2 flex flex-col items-center justify-start' 
        : 'bg-slate-950'
    }`}>
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 border border-cyan-500/50 shadow-2xl shadow-cyan-500/20 text-xs font-semibold text-white flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container: Leave-Screen Tablet View (768px tablet proportion) or Full-Width */}
      <div className={`w-full flex flex-col min-h-screen transition-all duration-300 ${
        isLeaveScreenView
          ? 'max-w-[768px] mx-auto border-x border-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.95)] bg-slate-950 sm:rounded-2xl sm:border sm:border-slate-800/80 overflow-hidden ring-1 ring-slate-800/50'
          : 'w-full bg-slate-950'
      }`}>
        {/* Top Navbar */}
        <Navbar />

        {/* Futuristic Notification Scroll Bar (Live HUD Stream) */}
        <FuturisticNotificationTicker />

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
          {(role === 'super_admin' || role === 'settings') && <MasterWebsiteCustomizer />}
          {role === 'teacher' && <TeacherPortal />}
          {role === 'student' && <StudentPortal />}
          {role === 'staff' && <StaffPortal />}
        </main>

        {/* Footer - Only shown on public website pages; hidden in Admin & management portals */}
        {role === 'public' && <Footer />}
      </div>

      {/* Global Modals */}
      <AdmissionModal />
      <OfflineAdmissionModal />
      <PrincipalAppointmentModal />
      <DonateTrustModal />
      <ReceiptModal />

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
