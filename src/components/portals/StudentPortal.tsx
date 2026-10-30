import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  GraduationCap, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Download, 
  FileText, 
  QrCode, 
  AlertCircle,
  Sparkles,
  Printer,
  ChevronRight,
  ShieldCheck,
  Check,
  LogOut,
  User,
  X
} from 'lucide-react';
import { STUDENT_TIMETABLE } from '../../data/initialData';

export const StudentPortal: React.FC = () => {
  const { 
    activeStudent, 
    setActiveStudentId, 
    students, 
    transactions, 
    recordPayment, 
    openReceiptModal, 
    setRole, 
    setPublicPage,
    showToast 
  } = useSchool();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    setRole('public');
    setPublicPage('home');
    showToast('Logged out successfully from Student Portal.');
  };

  const [activeTab, setActiveTab] = useState<'fees' | 'attendance' | 'timetable' | 'grades'>('fees');
  
  // Online payment simulation state
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedPayMethod, setSelectedPayMethod] = useState<'UPI' | 'Credit/Debit Card' | 'Net Banking'>('UPI');
  const [payAmount, setPayAmount] = useState<number>(activeStudent.pendingFee > 0 ? activeStudent.pendingFee : 10500);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Student's own transactions
  const studentTxns = transactions.filter(t => t.studentId === activeStudent.id);

  // Simulated attendance calendar for current month (October 2026)
  const daysInOctober = Array.from({ length: 24 }, (_, i) => {
    const day = i + 1;
    // Mark Sundays / Holidays
    if (day % 7 === 4) return { day, status: 'holiday', label: 'Sunday' };
    if (day === 2) return { day, status: 'holiday', label: 'Gandhi Jayanti' };
    if (day === 10) return { day, status: 'present', label: 'Today' };
    if (day === 8 && activeStudent.attendanceRate < 80) return { day, status: 'absent', label: 'Absent' };
    if (day === 14) return { day, status: 'upcoming', label: 'Upcoming' };
    if (day > 10) return { day, status: 'upcoming', label: 'Upcoming' };
    return { day, status: 'present', label: 'Present' };
  });

  const handleSimulatePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const newTxn = recordPayment({
        studentId: activeStudent.id,
        studentName: activeStudent.name,
        admissionNo: activeStudent.admissionNo,
        grade: activeStudent.grade,
        section: activeStudent.section,
        amount: payAmount,
        date: '2026-10-10',
        paymentMethod: selectedPayMethod,
        transactionRef: `${selectedPayMethod.replace(/[^A-Z]/g, '')}-${Date.now().toString().slice(-6)}`,
        term: 'Quarter 3',
        breakdown: {
          tuitionFee: Math.round(payAmount * 0.62),
          stemLabFee: Math.round(payAmount * 0.15),
          sportsActivityFee: Math.round(payAmount * 0.10),
          developmentFee: Math.round(payAmount * 0.08),
          transportFee: Math.round(payAmount * 0.05),
        },
        status: 'completed',
        collectedBy: 'Student Self-Service Online Gateway',
      });

      setIsProcessingPayment(false);
      setIsPayModalOpen(false);
      // Immediately open receipt
      openReceiptModal(newTxn);
    }, 1200);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Student Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 p-1 flex items-center justify-center overflow-hidden">
            <img 
              src={activeStudent.avatar} 
              alt={activeStudent.name} 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-display text-white">
                {activeStudent.name}
              </h1>
              <span className="text-[11px] text-blue-400 font-semibold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                {activeStudent.house} House
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeStudent.grade} (Section {activeStudent.section}) · Roll #{activeStudent.rollNo} · Adm: {activeStudent.admissionNo}
            </p>
          </div>
        </div>

        {/* Profile Icon and Logout Action */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          {/* Profile Button */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-blue-500/30 hover:border-blue-400 text-slate-200 hover:text-white transition-all shadow-sm cursor-pointer group"
              title="View Student Profile"
            >
              <div className="relative">
                <img 
                  src={activeStudent.avatar} 
                  alt={activeStudent.name} 
                  className="w-7 h-7 rounded-lg object-cover border border-blue-400/50 group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight">{activeStudent.name}</div>
                <div className="text-[10px] text-blue-300 font-medium leading-tight">Class {activeStudent.grade}-{activeStudent.section}</div>
              </div>
            </button>

            {/* Profile Dropdown / Card */}
            {isProfileOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-slate-900 border border-blue-500/40 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={activeStudent.avatar} 
                      alt={activeStudent.name} 
                      className="w-10 h-10 rounded-xl object-cover border border-blue-500/40"
                    />
                    <div>
                      <div className="text-sm font-bold text-white">{activeStudent.name}</div>
                      <div className="text-xs text-blue-300">Admission No: {activeStudent.admissionNo}</div>
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
                    <span className="text-slate-400">Class & Section:</span>
                    <span className="text-slate-200 font-medium">Class {activeStudent.grade} ({activeStudent.section})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Roll Number:</span>
                    <span className="text-blue-300 font-mono font-semibold">#{activeStudent.rollNo}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">House:</span>
                    <span className="text-slate-200">{activeStudent.house} House</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Attendance Rate:</span>
                    <span className="text-emerald-400 font-semibold">{activeStudent.attendanceRate}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Fee Status:</span>
                    <span className={`font-semibold ${activeStudent.feeStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {activeStudent.feeStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Guardian:</span>
                    <span className="text-slate-200">{activeStudent.guardianName}</span>
                  </div>

                  {/* Switch Demo Student selector inside profile */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <label className="text-[10px] text-slate-400 block mb-1">Switch Student Profile:</label>
                    <select
                      value={activeStudent.id}
                      onChange={e => {
                        setActiveStudentId(e.target.value);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.grade}-{s.section} · {s.feeStatus.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 hover:text-rose-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out of Student Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dedicated Log Out Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 text-rose-300 hover:text-white text-xs font-semibold transition-all shadow-sm cursor-pointer active:scale-95"
            title="Log out of Student Portal"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Top Quick Status Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Attendance Rate</div>
          <div className="text-2xl font-bold font-display tabular-nums text-white flex items-center justify-between">
            <span className={activeStudent.attendanceRate < 75 ? 'text-rose-400' : 'text-emerald-400'}>
              {activeStudent.attendanceRate}%
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-[11px] text-slate-400">
            {activeStudent.attendanceRate >= 75 ? 'Regular & Compliant' : 'Below 75% Warning'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Fee Payment Status</div>
          <div className="text-2xl font-bold font-display uppercase tracking-wide flex items-center justify-between">
            <span className={
              activeStudent.feeStatus === 'paid' ? 'text-emerald-400' :
              activeStudent.feeStatus === 'overdue' ? 'text-rose-400' : 'text-amber-400'
            }>
              {activeStudent.feeStatus}
            </span>
            <CreditCard className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-[11px] text-slate-400">
            {activeStudent.pendingFee === 0 ? 'All terms cleared' : `₹${activeStudent.pendingFee.toLocaleString('en-IN')} pending`}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Academic Mentor</div>
          <div className="text-base font-bold text-white truncate">
            {activeStudent.mentorTeacher}
          </div>
          <div className="text-[11px] text-cyan-400">
            Senior STEM & Physics Head
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Campus Identity</div>
          <div className="text-sm font-bold text-white font-mono">
            {activeStudent.admissionNo}
          </div>
          <div className="text-[11px] text-slate-400">
            Scholar ID
          </div>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('fees')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'fees'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          Digital Fee & Invoices
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'attendance'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Attendance Calendar ({activeStudent.attendanceRate}%)
        </button>

        <button
          onClick={() => setActiveTab('timetable')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'timetable'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Daily Timetable
        </button>

        <button
          onClick={() => setActiveTab('grades')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'grades'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Grades & Report Card
        </button>
      </div>

      {/* TAB 1: FEES & INVOICES */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          
          {/* Main Fee Summary Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                  Session 2026-27 Fee Ledger
                </div>
                <h3 className="text-2xl font-bold font-display text-white">
                  Academic Fee Account: {activeStudent.name}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Includes CBSE smart classroom tuition, robotics laboratory access, athletics turf upkeep, and campus digital amenities.
                </p>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[11px] text-slate-400">Total Annual Fee</div>
                    <div className="text-lg font-bold font-mono text-white tabular-nums">
                      ₹{activeStudent.totalFee.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[11px] text-slate-400">Total Paid to Date</div>
                    <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                      ₹{activeStudent.paidFee.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[11px] text-slate-400">Outstanding Balance</div>
                    <div className={`text-lg font-bold font-mono tabular-nums ${activeStudent.pendingFee > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                      ₹{activeStudent.pendingFee.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Box */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Quick Clearance</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    activeStudent.pendingFee === 0 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {activeStudent.pendingFee === 0 ? 'Dues Cleared' : 'Payment Due'}
                  </span>
                </div>

                <div className="text-2xl font-bold font-display text-white tabular-nums">
                  {activeStudent.pendingFee === 0 ? '₹0.00 Outstanding' : `₹${activeStudent.pendingFee.toLocaleString('en-IN')} Due`}
                </div>

                <button
                  onClick={() => setIsPayModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  {activeStudent.pendingFee === 0 ? 'Advance / Next Quarter Payment' : 'Pay Online (UPI / Card / NetBanking)'}
                </button>

                <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Instant official receipt generated upon payment
                </div>
              </div>

            </div>
          </div>

          {/* Past Payment Receipts History */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-display">
                Downloadable Payment Receipts
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {studentTxns.length} Settled Transactions
              </span>
            </div>

            {studentTxns.length === 0 ? (
              <div className="text-xs text-slate-400 p-4 rounded-xl bg-slate-950 text-center">
                No past digital payments recorded for this student ID yet. Make a payment above to generate an instant receipt!
              </div>
            ) : (
              <div className="space-y-3">
                {studentTxns.map(txn => (
                  <div
                    key={txn.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{txn.term} Clearance</span>
                        <span className="font-mono text-cyan-400 text-[11px]">({txn.receiptNo})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Paid on {txn.date} via {txn.paymentMethod} · Ref: {txn.transactionRef}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-mono font-bold text-emerald-400 tabular-nums text-sm">
                          ₹{txn.amount.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] text-emerald-400">Verified & Settled</span>
                      </div>

                      <button
                        onClick={() => openReceiptModal(txn)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Print Official Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: ATTENDANCE CALENDAR */}
      {activeTab === 'attendance' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold font-display text-white">
                Monthly Attendance Tracker (October 2026)
              </h3>
              <p className="text-xs text-slate-400">
                Live biometric attendance logged daily at Rupahi Town campus entrance
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Present
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                Absent
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                Holiday / Sunday
              </span>
            </div>
          </div>

          {/* Calendar Heatmap Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
            {daysInOctober.map((item) => (
              <div
                key={item.day}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  item.status === 'present'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : item.status === 'absent'
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                    : item.status === 'holiday'
                    ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                    : 'bg-slate-950/30 border-slate-800/40 text-slate-500'
                }`}
              >
                <div className="text-[11px] font-mono text-slate-400">Oct {item.day}</div>
                <div className="text-xs font-bold mt-1 capitalize">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Subject Attendance Breakdown */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Subject-Wise Attendance Distribution:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400">Physics & Mechanics</div>
                <div className="text-base font-bold text-emerald-400 font-mono mt-1">96.5%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400">Mathematics</div>
                <div className="text-base font-bold text-emerald-400 font-mono mt-1">95.0%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400">STEM Robotics Hub</div>
                <div className="text-base font-bold text-cyan-400 font-mono mt-1">98.2%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400">Physical Athletics</div>
                <div className="text-base font-bold text-emerald-400 font-mono mt-1">92.0%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TIMETABLE */}
      {activeTab === 'timetable' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Daily Class Schedule: {activeStudent.grade} - Section {activeStudent.section}
            </h3>
            <p className="text-xs text-slate-400">
              Central High School Campus · Timing: 08:30 AM to 02:45 PM
            </p>
          </div>

          <div className="space-y-2.5">
            {STUDENT_TIMETABLE.map(item => (
              <div 
                key={item.period}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-mono font-bold">
                    P{item.period}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{item.subject}</div>
                    <div className="text-slate-400">{item.time} · {item.room}</div>
                  </div>
                </div>

                <div className="text-right text-slate-400 font-mono">
                  {item.teacher}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GRADES */}
      {activeTab === 'grades' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Continuous Assessment Grade Report
              </h3>
              <p className="text-xs text-slate-400">Term 1 Evaluative Scores</p>
            </div>
            <button
              onClick={() => showToast('Report card downloaded as PDF!')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download Report Card
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Theory (80)</th>
                  <th className="py-3 px-3">Practical / Lab (20)</th>
                  <th className="py-3 px-3 text-right">Total (100)</th>
                  <th className="py-3 px-3 text-right">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200 font-mono">
                <tr>
                  <td className="py-3 px-3 font-sans font-semibold text-white">Physics</td>
                  <td className="py-3 px-3">74</td>
                  <td className="py-3 px-3">19</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400">93</td>
                  <td className="py-3 px-3 text-right font-bold text-cyan-400">A1</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-sans font-semibold text-white">Mathematics</td>
                  <td className="py-3 px-3">77</td>
                  <td className="py-3 px-3">19</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400">96</td>
                  <td className="py-3 px-3 text-right font-bold text-cyan-400">A1</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-sans font-semibold text-white">STEM Robotics & Coding</td>
                  <td className="py-3 px-3">78</td>
                  <td className="py-3 px-3">20</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400">98</td>
                  <td className="py-3 px-3 text-right font-bold text-cyan-400">A1+</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-sans font-semibold text-white">English Language & Literature</td>
                  <td className="py-3 px-3">71</td>
                  <td className="py-3 px-3">18</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400">89</td>
                  <td className="py-3 px-3 text-right font-bold text-cyan-400">A2</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Online Pay Fee Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  Pay School Fee Online
                </h3>
                <p className="text-xs text-slate-400">
                  United Global School Digital Gateway · Rupahi Town
                </p>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="text-slate-400">Paying for Student:</div>
                  <div className="font-bold text-white text-sm">{activeStudent.name} ({activeStudent.grade}-{activeStudent.section})</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400">Amount Due:</div>
                  <div className="font-mono font-bold text-emerald-400 text-base">
                    ₹{payAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPayMethod('UPI')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedPayMethod === 'UPI'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    UPI QR / VPA
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPayMethod('Credit/Debit Card')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedPayMethod === 'Credit/Debit Card'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPayMethod('Net Banking')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedPayMethod === 'Net Banking'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Net Banking
                  </button>
                </div>
              </div>

              {/* Simulated Gateway View */}
              {selectedPayMethod === 'UPI' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
                  <div className="w-24 h-24 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
                    <QrCode className="w-20 h-20 text-slate-950" />
                  </div>
                  <div className="text-xs font-semibold text-white">
                    Scan with GPay, PhonePe, Paytm, or BHIM
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    UPI ID: unitedglobalschool@sbi
                  </div>
                </div>
              )}

              {selectedPayMethod === 'Credit/Debit Card' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Card Number (4000 1234 5678 9010)"
                    defaultValue="4111 2222 3333 4444"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      defaultValue="12/28"
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      defaultValue="982"
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>
              )}

              {selectedPayMethod === 'Net Banking' && (
                <select className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white">
                  <option>State Bank of India (SBI)</option>
                  <option>HDFC Bank</option>
                  <option>Assam Gramin Vikash Bank (AGVB)</option>
                  <option>Punjab National Bank</option>
                </select>
              )}

              <button
                onClick={handleSimulatePayment}
                disabled={isProcessingPayment}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? (
                  <span>Processing Secure Banking Gateway...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Confirm & Authorize ₹{payAmount.toLocaleString('en-IN')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
