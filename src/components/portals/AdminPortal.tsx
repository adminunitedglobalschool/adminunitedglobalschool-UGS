import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { StudentAdminView } from './admin/StudentAdminView';
import { TeacherAdminView } from './admin/TeacherAdminView';
import { AdministratorAdminView } from './admin/AdministratorAdminView';
import { StaffAdminView } from './admin/StaffAdminView';
import { PvcSheetPrintView } from './admin/PvcSheetPrintView';
import { UserCredentialsManager } from './admin/UserCredentialsManager';
import { 
  ShieldCheck, 
  Users, 
  GraduationCap,
  CreditCard, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Plus, 
  Send, 
  Calendar, 
  FileText,
  UserPlus,
  ArrowUpRight,
  TrendingUp,
  Download,
  LayoutDashboard,
  Sparkles,
  Key,
  Receipt,
  FileCheck,
  Award,
  Settings,
  LogOut,
  User,
  X,
  ShieldAlert
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { 
    students, 
    teachers, 
    staff, 
    administrators,
    transactions, 
    announcements, 
    addAnnouncement, 
    openReceiptModal, 
    setRole, 
    setPublicPage,
    showToast,
    userCredentials,
    firebaseConnected 
  } = useSchool();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    setRole('public');
    setPublicPage('home');
    showToast('Logged out successfully from Admin Panel.');
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'teachers' | 'administrators' | 'staff' | 'credentials' | 'fees' | 'circulars' | 'pvc-sheet'>('overview');
  const [studentSubTab, setStudentSubTab] = useState<'directory' | 'collect-fee' | 'admit-card' | 'results' | 'add' | 'idcard' | 'pvc-sheet'>('directory');
  
  // Announcement state
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<'Academic' | 'Notice' | 'Sports' | 'Examination'>('Notice');
  const [newNoticeUrgent, setNewNoticeUrgent] = useState(false);

  // Financial aggregates
  const totalSchoolFeeDue = students.reduce((sum, s) => sum + s.totalFee, 0);
  const totalSchoolFeeCollected = students.reduce((sum, s) => sum + s.paidFee, 0);
  const totalSchoolFeePending = students.reduce((sum, s) => sum + s.pendingFee, 0);
  const collectionPercentage = totalSchoolFeeDue > 0 ? ((totalSchoolFeeCollected / totalSchoolFeeDue) * 100).toFixed(1) : '100.0';

  // Attendance aggregates
  const avgAttendance = students.length > 0 ? (students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length).toFixed(1) : '100.0';
  const lowAttendanceStudents = students.filter(s => s.attendanceRate < 75);

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) return;

    addAnnouncement({
      title: newNoticeTitle,
      content: newNoticeContent,
      category: newNoticeCategory,
      date: '2026-10-10',
      targetRole: 'All',
      isUrgent: newNoticeUrgent,
    });

    setNewNoticeTitle('');
    setNewNoticeContent('');
    setNewNoticeUrgent(false);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      
      {/* Admin Panel Header with Profile Icon, Super Admin switch, and Log Out Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 border border-purple-400/40 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 shrink-0">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold font-display text-white">
                Admin Panel
              </h1>
              <span className="text-[10px] text-purple-300 font-mono font-semibold px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30">
                Operational Directorate
              </span>
            </div>
            <p className="text-xs text-slate-400">
              United Global School · Student Administration, Admissions, Attendance & Digital Fees
            </p>
          </div>
        </div>

        {/* Action Controls: Jump to Super Admin, Profile Icon, and Logout */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
          {/* Direct Switch to Super Admin Portal */}
          <button
            onClick={() => setRole('super_admin')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-400 text-rose-300 hover:text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
            title="Open Super Admin Portal for Credentials Issuance, Permissions Matrix & Website CMS"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Super Admin Portal</span>
            <span className="sm:hidden">Super Admin</span>
          </button>

          {/* Profile Button */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-purple-500/30 hover:border-purple-400 text-slate-200 hover:text-white transition-all shadow-sm cursor-pointer group"
              title="View Admin Profile"
            >
              <div className="relative">
                <div className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
                  <User className="w-4 h-4" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-white leading-tight">Dr. Mukut Sharma</div>
                <div className="text-[10px] text-purple-300 font-medium leading-tight">Principal Desk</div>
              </div>
            </button>

            {/* Profile Dropdown / Card */}
            {isProfileOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-slate-900 border border-purple-500/40 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      MS
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Dr. Mukut Sharma</div>
                      <div className="text-xs text-purple-300">Principal & Operational Head</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsProfileOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="py-3 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-slate-200 font-mono truncate max-w-[170px]" title="adminunitedglobalschool@gmail.com">adminunitedglobalschool@gmail.com</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Institutional Role:</span>
                    <span className="text-purple-300 font-semibold">Principal & Head of School</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Clearance Level:</span>
                    <span className="text-emerald-400 font-semibold">Executive Level 4 (Operations)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Campus:</span>
                    <span className="text-slate-200">Bhakatgaon, Rupahi Town</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 hover:text-rose-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out of Admin Panel</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dedicated Log Out Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 text-rose-300 hover:text-white text-xs font-semibold transition-all shadow-sm cursor-pointer active:scale-95"
            title="Log out of Admin Panel"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Portal Top Bar Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800">
        {/* Core Administration Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 w-full">
          
          {/* 0. Overview Console Button */}
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white font-bold shadow-purple-600/30 ring-1 ring-purple-400'
                : 'bg-slate-900 border border-slate-700 hover:border-purple-500/50 text-slate-200 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-purple-400" />
            <span>Overview</span>
          </button>

          {/* 1. Student Button */}
          <button
            onClick={() => {
              setActiveTab('students');
              setStudentSubTab('directory');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              activeTab === 'students' && studentSubTab === 'directory'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-cyan-500/20 ring-1 ring-cyan-400'
                : 'bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Student</span>
          </button>

          {/* 2. Teacher Button */}
          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              activeTab === 'teachers'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-emerald-500/20 ring-1 ring-emerald-400'
                : 'bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-slate-200 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Teacher</span>
          </button>

          {/* 3. Administrator Button */}
          <button
            onClick={() => setActiveTab('administrators')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              activeTab === 'administrators'
                ? 'bg-purple-600 text-white font-bold shadow-purple-600/30 ring-1 ring-purple-400'
                : 'bg-slate-900 border border-slate-700 hover:border-purple-500/50 text-slate-200 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Administrator</span>
          </button>

          {/* 4. Staff Button */}
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              activeTab === 'staff'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-amber-500/20 ring-1 ring-amber-400'
                : 'bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-slate-200 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Staff</span>
          </button>

          {/* Super Admin Login Credentials Hub Button */}
          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              activeTab === 'credentials'
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold shadow-purple-600/30 ring-1 ring-purple-300'
                : 'bg-slate-900 border border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4 text-purple-400" />
            <span>Login Credentials ({userCredentials.length})</span>
          </button>

          {/* 5. Collect Fees Unique Action */}
          <button
            onClick={() => {
              setActiveTab('students');
              setStudentSubTab('collect-fee');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              activeTab === 'students' && studentSubTab === 'collect-fee'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-indigo-600/30 ring-1 ring-indigo-300'
                : 'bg-slate-900 border border-indigo-500/40 hover:border-indigo-400 text-indigo-300 hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4 text-indigo-400" />
            <span>Collect Fees</span>
          </button>

          {/* 6. Admit Card Unique Action */}
          <button
            onClick={() => {
              setActiveTab('students');
              setStudentSubTab('admit-card');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              activeTab === 'students' && studentSubTab === 'admit-card'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-cyan-500/30 ring-1 ring-cyan-200'
                : 'bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white'
            }`}
          >
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span>Admit Card</span>
          </button>

          {/* 7. Result & Marksheet Unique Action */}
          <button
            onClick={() => {
              setActiveTab('students');
              setStudentSubTab('results');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              activeTab === 'students' && studentSubTab === 'results'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold shadow-amber-500/30 ring-1 ring-amber-200'
                : 'bg-slate-900 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Result & Marksheet</span>
          </button>

          {/* 8. 9-PVC Card A4 Sheet Print Button */}
          <button
            onClick={() => setActiveTab('pvc-sheet')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              activeTab === 'pvc-sheet'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-cyan-500/30 ring-1 ring-cyan-300'
                : 'bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>9-PVC A4 Print</span>
          </button>
        </div>
      </div>

      {/* Breadcrumb banner when inside a dedicated page */}
      {activeTab !== 'overview' && (
        <div className="flex items-center justify-between p-3.5 px-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center gap-2.5 text-slate-400">
            <button 
              onClick={() => setActiveTab('overview')} 
              className="hover:text-cyan-400 flex items-center gap-1.5 text-slate-300 font-medium transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-purple-400" />
              <span>Overview</span>
            </button>
            <span className="text-slate-600 font-bold">/</span>
            <span className="text-white font-bold">
              {activeTab === 'students' ? (
                studentSubTab === 'collect-fee' ? 'Student Administration · Collect Fees Digital Counter' :
                studentSubTab === 'admit-card' ? 'Student Administration · Admit Cards & Hall Tickets' :
                studentSubTab === 'results' ? 'Student Administration · Examination Results & Marksheets' :
                studentSubTab === 'add' ? 'Student Administration · Register New Student' :
                'Student Administration'
              ) :
               activeTab === 'teachers' ? 'Faculty & Teacher Administration' :
               activeTab === 'administrators' ? 'School Directorate Cabinet' :
               activeTab === 'staff' ? 'Operational Staff Management' :
               activeTab === 'credentials' ? 'Super Admin Master Access · Login Credentials & Role Permissions Hub' :
               activeTab === 'pvc-sheet' ? '9-PVC Card A4 Sheet Print Studio' :
               activeTab === 'fees' ? 'Fee Collection Audit Log' :
               'Broadcast Circular Desk'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {/* Add Student Button in Breadcrumb Section */}
            <button
              onClick={() => {
                setActiveTab('students');
                setStudentSubTab('add');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                activeTab === 'students' && studentSubTab === 'add'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-cyan-500/25 ring-1 ring-cyan-300'
                  : 'bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white'
              }`}
              title="Add a new student"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Student</span>
            </button>

            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
              firebaseConnected
                ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-950/80 border-amber-500/30 text-amber-300'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${firebaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>{firebaseConnected ? 'Firebase Live' : 'Firebase Reconnecting'}</span>
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              ← Return to Overview
            </button>
          </div>
        </div>
      )}

      {/* OVERVIEW-ONLY: KPI METRICS STRIP AND TAB RIBBON */}
      {activeTab === 'overview' && (
        <>
          {/* Real-time Cloud Database Status Strip */}
          <div className="flex items-center justify-between p-3 px-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-slate-200">Firebase Firestore Cloud Database:</span>
              <span className="text-emerald-400 font-medium">Synchronized & Active</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Project: gen-lang-client-0139487269
            </span>
          </div>

          {/* Top 4 KPI Metrics Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Enrolled Students</span>
                <GraduationCap className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-white tabular-nums">
                {students.length} Students
              </div>
              <div className="text-[11px] text-cyan-400 font-medium">
                {teachers.length} Faculty · {staff.length} Operational Staff
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Average Attendance</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-emerald-400 tabular-nums">
                {avgAttendance}%
              </div>
              <div className="text-[11px] text-slate-400">
                {lowAttendanceStudents.length > 0 ? (
                  <span className="text-amber-400 font-medium">
                    {lowAttendanceStudents.length} under 75% threshold
                  </span>
                ) : (
                  'All above minimum 75%'
                )}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Fee Realization</span>
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-white tabular-nums">
                {collectionPercentage}%
              </div>
              <div className="text-[11px] text-slate-400 tabular-nums">
                ₹{totalSchoolFeeCollected.toLocaleString('en-IN')} collected
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Pending Receivables</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-amber-400 tabular-nums">
                ₹{totalSchoolFeePending.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400">
                Quarter 3 Dues in Progress
              </div>
            </div>

          </div>

      {/* Primary Tab Navigation Ribbon (Quick shortcuts from Overview) */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        
        <button
          onClick={() => setActiveTab('overview')}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap bg-purple-500/20 text-purple-300 border border-purple-500/40"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Operations & Summary
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap text-slate-400 hover:text-cyan-300 hover:bg-slate-900 border border-transparent hover:border-cyan-500/30"
        >
          <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
          Student ({students.length})
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap text-slate-400 hover:text-emerald-300 hover:bg-slate-900 border border-transparent hover:border-emerald-500/30"
        >
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          Teacher ({teachers.length})
        </button>

        <button
          onClick={() => setActiveTab('administrators')}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap text-slate-400 hover:text-purple-300 hover:bg-slate-900 border border-transparent hover:border-purple-500/30"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          Administrator ({administrators.length})
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap text-slate-400 hover:text-amber-300 hover:bg-slate-900 border border-transparent hover:border-amber-500/30"
        >
          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
          Staff ({staff.length})
        </button>

        <button
          onClick={() => setActiveTab('fees')}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap text-slate-400 hover:text-white hover:bg-slate-900"
        >
          Fee Collection Audit
        </button>

        <button
          onClick={() => setActiveTab('circulars')}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap text-slate-400 hover:text-white hover:bg-slate-900"
        >
          Broadcast Notice
        </button>

        <button
          onClick={() => setActiveTab('pvc-sheet')}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap text-cyan-400 hover:text-cyan-200 hover:bg-cyan-500/10 border border-cyan-500/30"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          9-PVC A4 Sheet Print (9 Cards/Page)
        </button>
      </div>

      {/* VIEW 1: OPERATIONS & SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Col: Attendance Alerts & Quick Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Low Attendance Alert Section */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">
                    Attendance Defaulter Tracker (&lt; 75%)
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {lowAttendanceStudents.length} Students Flagged
                </span>
              </div>

              {lowAttendanceStudents.length === 0 ? (
                <div className="text-xs text-emerald-400 flex items-center gap-2 py-4">
                  <CheckCircle2 className="w-4 h-4" />
                  All enrolled students satisfy the CBSE mandatory 75% attendance threshold.
                </div>
              ) : (
                <div className="space-y-2">
                  {lowAttendanceStudents.map(std => (
                    <div 
                      key={std.id}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-white">{std.name}</span>
                        <span className="text-slate-400 ml-2">({std.grade} - {std.section})</span>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Parent Contact: {std.phone}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-rose-400 font-mono font-bold">{std.attendanceRate}%</span>
                        <button
                          onClick={() => showToast(`Automated SMS attendance notice dispatched to guardian of ${std.name}`)}
                          className="block text-[10px] text-cyan-400 hover:underline mt-0.5"
                        >
                          Send SMS Alert
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Directorate Telemetry Links */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Directorate Quick Management Deck
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => setActiveTab('students')}
                  className="p-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold text-center transition-colors"
                >
                  <GraduationCap className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
                  Students ({students.length})
                </button>

                <button
                  onClick={() => setActiveTab('teachers')}
                  className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-center transition-colors"
                >
                  <Users className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                  Teachers ({teachers.length})
                </button>

                <button
                  onClick={() => setActiveTab('administrators')}
                  className="p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold text-center transition-colors"
                >
                  <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                  Administrators ({administrators.length})
                </button>

                <button
                  onClick={() => setActiveTab('staff')}
                  className="p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold text-center transition-colors"
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                  Staff ({staff.length})
                </button>
              </div>
            </div>

            {/* Website Customizer CMS Console (Exclusive to Admin) */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Settings className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      School Website Customizer & Live CMS
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-mono font-bold">
                      Admin Access
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live edit public website branding, hero banner, campus labs, fees, toppers, notices & circulars
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRole('settings')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all whitespace-nowrap"
              >
                <Settings className="w-4 h-4" />
                <span>Customize Website</span>
              </button>
            </div>

            {/* Super Admin Login Credentials & Access Control Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900 border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)] shrink-0">
                  <Key className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      Super Admin Credentials & Login Access Gateway
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 font-mono font-bold">
                      Master Key Control
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Issue, edit, generate, and revoke secure login credentials for Administrators, Teachers, Students, and Accounts Staff.
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5 mt-2 text-[11px] font-mono text-slate-400">
                    <span className="text-purple-300 font-semibold">{userCredentials.filter(u => u.role === 'administrator').length} Admins</span>
                    <span>·</span>
                    <span className="text-emerald-300 font-semibold">{userCredentials.filter(u => u.role === 'teacher').length} Teachers</span>
                    <span>·</span>
                    <span className="text-blue-300 font-semibold">{userCredentials.filter(u => u.role === 'student').length} Students</span>
                    <span>·</span>
                    <span className="text-amber-300 font-semibold">{userCredentials.filter(u => u.role === 'staff' || u.role === 'accountant').length} Staff</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('credentials')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer shrink-0"
              >
                <Key className="w-4 h-4" />
                <span>Issue & Manage Credentials</span>
              </button>
            </div>

          </div>

          {/* Right Col: Quick Notice Publisher & Fee Health */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Fee Health Mini Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Fee Realization Health</span>
                <span className="text-xs text-blue-400 font-mono">TERM 3</span>
              </h3>

              <div className="space-y-2">
                <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${collectionPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Collected: ₹{totalSchoolFeeCollected.toLocaleString('en-IN')}</span>
                  <span>Due: ₹{totalSchoolFeePending.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('fees')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  View Full Audit Log →
                </button>
              </div>
            </div>

            {/* Quick Broadcast Widget */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                Latest Published Notice
              </h3>

              {announcements.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-purple-400 font-semibold">{announcements[0].category}</span>
                    <span className="font-mono">{announcements[0].date}</span>
                  </div>
                  <div className="font-bold text-white">{announcements[0].title}</div>
                  <p className="text-slate-300 text-[11px] line-clamp-2">{announcements[0].content}</p>
                </div>
              )}

              <button
                onClick={() => setActiveTab('circulars')}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Compose New Notice
              </button>
            </div>

          </div>

        </div>
      </>
    )}

      {/* VIEW 2: DEDICATED STUDENT PAGE */}
      {activeTab === 'students' && (
        <StudentAdminView initialSubTab={studentSubTab} />
      )}

      {/* VIEW 3: DEDICATED TEACHER PAGE */}
      {activeTab === 'teachers' && (
        <TeacherAdminView />
      )}

      {/* VIEW 4: DEDICATED ADMINISTRATOR PAGE */}
      {activeTab === 'administrators' && (
        <AdministratorAdminView />
      )}

      {/* VIEW 5: DEDICATED STAFF PAGE */}
      {activeTab === 'staff' && (
        <StaffAdminView />
      )}

      {/* VIEW 6: FEES AUDIT */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Digital Fee Transaction Log
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time ledger entries with automated receipt numbers and payment mode verification
                </p>
              </div>
              <button
                onClick={() => showToast('Fee ledger exported to CSV successfully.')}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Export Ledger (CSV)
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="py-3 px-3">Receipt No</th>
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Class</th>
                    <th className="py-3 px-3">Term</th>
                    <th className="py-3 px-3">Payment Mode</th>
                    <th className="py-3 px-3 text-right">Amount Paid</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {transactions.map(txn => (
                    <tr key={txn.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-mono font-semibold text-cyan-400">{txn.receiptNo}</td>
                      <td className="py-3 px-3 font-medium text-white">{txn.studentName}</td>
                      <td className="py-3 px-3">{txn.grade} ({txn.section})</td>
                      <td className="py-3 px-3 text-slate-300">{txn.term}</td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-[11px] text-slate-300">{txn.paymentMethod}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400 tabular-nums">
                        ₹{txn.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => openReceiptModal(txn)}
                          className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold text-[11px]"
                        >
                          Print Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 7: BROADCAST CIRCULAR */}
      {activeTab === 'circulars' && (
        <div className="max-w-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Publish Official Notice / Bulletin
            </h3>
            <p className="text-xs text-slate-400">
              Notices published here appear immediately across the Public Website, Student Portal, and Teacher Portal.
            </p>
          </div>

          <form onSubmit={handlePostNotice} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Notice Title *
              </label>
              <input
                type="text"
                required
                value={newNoticeTitle}
                onChange={e => setNewNoticeTitle(e.target.value)}
                placeholder="e.g. Schedule for Mid-Term Examination 2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Category
                </label>
                <select
                  value={newNoticeCategory}
                  onChange={e => setNewNoticeCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="Academic">Academic</option>
                  <option value="Notice">General Notice</option>
                  <option value="Sports">Sports</option>
                  <option value="Examination">Examination</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="urgentCheck"
                  checked={newNoticeUrgent}
                  onChange={e => setNewNoticeUrgent(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-0 bg-slate-950 border-slate-700"
                />
                <label htmlFor="urgentCheck" className="text-slate-300 font-medium cursor-pointer">
                  Mark as Urgent Action
                </label>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Notice Detailed Content *
              </label>
              <textarea
                required
                rows={4}
                value={newNoticeContent}
                onChange={e => setNewNoticeContent(e.target.value)}
                placeholder="Provide full notice details, deadlines, and instructions..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Publish Notice Immediately
            </button>
          </form>
        </div>
      )}

      {/* VIEW 8: 9 PVC CARDS A4 SHEET PRINT STUDIO */}
      {activeTab === 'pvc-sheet' && (
        <PvcSheetPrintView />
      )}

      {/* VIEW 9: SUPER ADMIN CREDENTIALS & LOGIN MANAGEMENT */}
      {activeTab === 'credentials' && (
        <UserCredentialsManager />
      )}

    </div>
  );
};
