import React from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { 
  ShieldCheck, 
  Users, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  BookOpen, 
  Calendar, 
  Award, 
  RotateCcw, 
  Eye, 
  Lock, 
  Unlock, 
  Check, 
  X,
  Sparkles,
  Zap
} from 'lucide-react';

export const RolePermissionsCustomizer: React.FC = () => {
  const { 
    rolePermissions, 
    updateTeacherPermission, 
    updateStaffPermission, 
    resetRolePermissions,
    setRole,
    showToast 
  } = useSchool();

  const teacherPerms = rolePermissions.teacher;
  const staffPerms = rolePermissions.staff;

  const teacherActiveCount = Object.values(teacherPerms).filter(Boolean).length;
  const staffActiveCount = Object.values(staffPerms).filter(Boolean).length;

  const handleGrantAllTeacher = () => {
    updateTeacherPermission('canMarkAttendance', true);
    updateTeacherPermission('canEditGradebook', true);
    updateTeacherPermission('canManageAssignments', true);
    updateTeacherPermission('canViewTimetable', true);
    showToast('Granted all operational permissions to Faculty / Teachers.');
  };

  const handleLockAllTeacher = () => {
    updateTeacherPermission('canMarkAttendance', false);
    updateTeacherPermission('canEditGradebook', false);
    updateTeacherPermission('canManageAssignments', false);
    updateTeacherPermission('canViewTimetable', false);
    showToast('All Faculty / Teacher permissions locked (Restricted Access).');
  };

  const handleGrantAllStaff = () => {
    updateStaffPermission('canCollectFees', true);
    updateStaffPermission('canViewDefaulters', true);
    updateStaffPermission('canViewLedger', true);
    showToast('Granted all operational permissions to Operational Staff.');
  };

  const handleLockAllStaff = () => {
    updateStaffPermission('canCollectFees', false);
    updateStaffPermission('canViewDefaulters', false);
    updateStaffPermission('canViewLedger', false);
    showToast('All Staff permissions locked (Restricted Access).');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0">
              <ShieldCheck className="w-7 h-7 text-cyan-400" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
                </span>
                <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-300 font-bold">
                  SECURITY & ROLES CONTROL MATRIX
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-mono text-[10px] font-bold">
                  LIVE RBAC
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                Teacher & Staff Roles and Permissions Deck
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl font-normal">
                Set and control what Faculty (Teachers) and Administrative Staff can view and operate in their dedicated portals. Updates take effect immediately.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={resetRolePermissions}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
              title="Reset all role permissions to standard school defaults"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Permissions</span>
            </button>
          </div>
        </div>

        {/* Live Simulator Test Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Instant Portal Simulation: Test your configured permissions in realtime</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRole('teacher')}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 hover:text-white transition-all flex items-center gap-1.5 font-semibold text-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Simulate Teacher Portal</span>
            </button>

            <button
              onClick={() => setRole('staff')}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:text-white transition-all flex items-center gap-1.5 font-semibold text-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Simulate Staff Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Teacher Permissions & Staff Permissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* ========================================================= */}
        {/* SECTION 1: TEACHER / FACULTY PERMISSIONS DECK */}
        {/* ========================================================= */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-display">
                    Faculty / Teacher Clearance
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                    teacherActiveCount === 4
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : teacherActiveCount > 0
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                  }`}>
                    {teacherActiveCount}/4 Granted
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Controls capabilities in the Teacher Portal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleGrantAllTeacher}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold transition-colors"
                title="Enable all privileges for teachers"
              >
                Allow All
              </button>
              <button
                onClick={handleLockAllTeacher}
                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] font-semibold transition-colors"
                title="Restrict all privileges for teachers"
              >
                Lock All
              </button>
            </div>
          </div>

          <div className="space-y-4">
            
            {/* 1. Daily Attendance */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4 transition-colors hover:border-slate-700">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  teacherPerms.canMarkAttendance 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Daily Roll Call & Student Attendance</span>
                    {teacherPerms.canMarkAttendance ? (
                      <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-rose-400 font-mono font-semibold flex items-center gap-1">
                        <X className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Grants teacher rights to mark Present, Absent, and Late for enrolled students in their classes.
                  </p>
                </div>
              </div>

              <button
                onClick={() => updateTeacherPermission('canMarkAttendance', !teacherPerms.canMarkAttendance)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  teacherPerms.canMarkAttendance ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
                role="switch"
                aria-checked={teacherPerms.canMarkAttendance}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    teacherPerms.canMarkAttendance ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 2. Gradebook */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4 transition-colors hover:border-slate-700">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  teacherPerms.canEditGradebook 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}>
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Continuous Scholastic Gradebook</span>
                    {teacherPerms.canEditGradebook ? (
                      <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-rose-400 font-mono font-semibold flex items-center gap-1">
                        <X className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Grants teacher rights to view and modify scholastic marks, term assessments, and exam scores.
                  </p>
                </div>
              </div>

              <button
                onClick={() => updateTeacherPermission('canEditGradebook', !teacherPerms.canEditGradebook)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  teacherPerms.canEditGradebook ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
                role="switch"
                aria-checked={teacherPerms.canEditGradebook}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    teacherPerms.canEditGradebook ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 3. Assignments */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4 transition-colors hover:border-slate-700">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  teacherPerms.canManageAssignments 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}>
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Homework & Project Deadlines</span>
                    {teacherPerms.canManageAssignments ? (
                      <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-rose-400 font-mono font-semibold flex items-center gap-1">
                        <X className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Grants teacher rights to post assignments, define submission dates, and view student turn-ins.
                  </p>
                </div>
              </div>

              <button
                onClick={() => updateTeacherPermission('canManageAssignments', !teacherPerms.canManageAssignments)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  teacherPerms.canManageAssignments ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
                role="switch"
                aria-checked={teacherPerms.canManageAssignments}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    teacherPerms.canManageAssignments ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 4. Timetable */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4 transition-colors hover:border-slate-700">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  teacherPerms.canViewTimetable 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}>
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Class Timetable & Period Schedules</span>
                    {teacherPerms.canViewTimetable ? (
                      <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-rose-400 font-mono font-semibold flex items-center gap-1">
                        <X className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Grants teacher access to weekly instructional routines, laboratory sessions, and period timetables.
                  </p>
                </div>
              </div>

              <button
                onClick={() => updateTeacherPermission('canViewTimetable', !teacherPerms.canViewTimetable)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  teacherPerms.canViewTimetable ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
                role="switch"
                aria-checked={teacherPerms.canViewTimetable}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    teacherPerms.canViewTimetable ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: STAFF / ACCOUNTS PERMISSIONS DECK */}
        {/* ========================================================= */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-display">
                    Administrative Staff Clearance
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                    staffActiveCount === 3
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                      : staffActiveCount > 0
                      ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                  }`}>
                    {staffActiveCount}/3 Granted
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Controls capabilities in the Staff & Fee Accounts Portal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleGrantAllStaff}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-semibold transition-colors"
                title="Enable all privileges for operational staff"
              >
                Allow All
              </button>
              <button
                onClick={handleLockAllStaff}
                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] font-semibold transition-colors"
                title="Restrict all privileges for operational staff"
              >
                Lock All
              </button>
            </div>
          </div>

          <div className="space-y-4">
            
            {/* 1. Fee Collection Counter */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4 transition-colors hover:border-slate-700">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  staffPerms.canCollectFees 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Digital Fee Collection Counter</span>
                    {staffPerms.canCollectFees ? (
                      <span className="text-[10px] text-amber-400 font-mono font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-rose-400 font-mono font-semibold flex items-center gap-1">
                        <X className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Grants staff clearance to accept payments (Cash/UPI/Net Banking), log student fees, and issue digital receipts.
                  </p>
                </div>
              </div>

              <button
                onClick={() => updateStaffPermission('canCollectFees', !staffPerms.canCollectFees)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  staffPerms.canCollectFees ? 'bg-amber-500' : 'bg-slate-800'
                }`}
                role="switch"
                aria-checked={staffPerms.canCollectFees}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    staffPerms.canCollectFees ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 2. Pending Dues & Defaulters */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4 transition-colors hover:border-slate-700">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  staffPerms.canViewDefaulters 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Pending Dues & Defaulters Roster</span>
                    {staffPerms.canViewDefaulters ? (
                      <span className="text-[10px] text-amber-400 font-mono font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-rose-400 font-mono font-semibold flex items-center gap-1">
                        <X className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Grants staff clearance to inspect students with overdue quarter fees and follow up on pending balances.
                  </p>
                </div>
              </div>

              <button
                onClick={() => updateStaffPermission('canViewDefaulters', !staffPerms.canViewDefaulters)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  staffPerms.canViewDefaulters ? 'bg-amber-500' : 'bg-slate-800'
                }`}
                role="switch"
                aria-checked={staffPerms.canViewDefaulters}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    staffPerms.canViewDefaulters ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 3. Daily Collection Ledger */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4 transition-colors hover:border-slate-700">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  staffPerms.canViewLedger 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Daily Collection Ledger & Audits</span>
                    {staffPerms.canViewLedger ? (
                      <span className="text-[10px] text-amber-400 font-mono font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-rose-400 font-mono font-semibold flex items-center gap-1">
                        <X className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Grants staff clearance to view complete transaction logs, daily reconciliation sheets, and audit histories.
                  </p>
                </div>
              </div>

              <button
                onClick={() => updateStaffPermission('canViewLedger', !staffPerms.canViewLedger)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  staffPerms.canViewLedger ? 'bg-amber-500' : 'bg-slate-800'
                }`}
                role="switch"
                aria-checked={staffPerms.canViewLedger}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    staffPerms.canViewLedger ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
