import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { Student, FeeTransaction } from '../../../types/school';
import { 
  CreditCard, 
  Search, 
  CheckCircle2, 
  QrCode, 
  Printer, 
  Receipt, 
  AlertCircle, 
  Banknote, 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight, 
  Sparkles,
  Calendar,
  UserCheck,
  TrendingUp,
  Clock,
  Download,
  Filter
} from 'lucide-react';

interface StudentFeeCollectorProps {
  initialStudentId?: string;
}

export const StudentFeeCollector: React.FC<StudentFeeCollectorProps> = ({ initialStudentId }) => {
  const { students, transactions, recordPayment, openReceiptModal, showToast } = useSchool();

  // Find initial student or first student with pending fees, or first student
  const [selectedStudent, setSelectedStudent] = useState<Student>(() => {
    if (initialStudentId) {
      const match = students.find(s => s.id === initialStudentId);
      if (match) return match;
    }
    return students.find(s => s.pendingFee > 0) || students[0];
  });

  const [studentSearch, setStudentSearch] = useState('');
  const [feeStatusFilter, setFeeStatusFilter] = useState<'All' | 'pending' | 'partial' | 'paid'>('All');

  // Form State for payment
  const [payAmount, setPayAmount] = useState<number>(() => {
    return selectedStudent?.pendingFee > 0 ? Math.min(selectedStudent.pendingFee, 10500) : 10000;
  });
  const [payTerm, setPayTerm] = useState<'Quarter 1' | 'Quarter 2' | 'Quarter 3' | 'Quarter 4' | 'Annual Package'>('Quarter 3');
  const [payMethod, setPayMethod] = useState<'UPI' | 'Credit/Debit Card' | 'Net Banking' | 'Cash' | 'Cheque'>('UPI');
  const [customRef, setCustomRef] = useState('');
  const [collectorName, setCollectorName] = useState('Central Accounts Desk · Rupahi Town');
  const [lateFeeWaiver, setLateFeeWaiver] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync amount when student changes
  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    if (student.pendingFee > 0) {
      setPayAmount(Math.min(student.pendingFee, 10500));
    } else {
      setPayAmount(5000);
    }
  };

  // Calculations
  const totalSchoolDemanded = students.reduce((acc, s) => acc + s.totalFee, 0);
  const totalSchoolCollected = students.reduce((acc, s) => acc + s.paidFee, 0);
  const totalSchoolPending = students.reduce((acc, s) => acc + s.pendingFee, 0);
  const totalTransactionsCount = transactions.length;

  const filteredStudents = students.filter(s => {
    const matchesQuery = s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                         s.admissionNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
                         s.grade.toLowerCase().includes(studentSearch.toLowerCase()) ||
                         s.guardianName.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesFilter = feeStatusFilter === 'All' || s.feeStatus === feeStatusFilter;
    return matchesQuery && matchesFilter;
  });

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      showToast('Please select a student first.');
      return;
    }

    if (payAmount <= 0) {
      showToast('Please enter a valid amount greater than ₹0.');
      return;
    }

    setIsProcessing(true);

    const generatedRef = customRef.trim() || `UGS/POS/${Date.now().toString().slice(-7)}`;

    // Breakdown distribution
    const tuition = Math.round(payAmount * 0.60);
    const stemLab = Math.round(payAmount * 0.15);
    const sports = Math.round(payAmount * 0.10);
    const development = Math.round(payAmount * 0.10);
    const transport = payAmount - (tuition + stemLab + sports + development);

    const newTxn = recordPayment({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      admissionNo: selectedStudent.admissionNo,
      grade: selectedStudent.grade,
      section: selectedStudent.section,
      amount: Number(payAmount),
      date: new Date().toISOString().split('T')[0],
      paymentMethod: payMethod,
      transactionRef: generatedRef,
      term: payTerm,
      breakdown: {
        tuitionFee: tuition,
        stemLabFee: stemLab,
        sportsActivityFee: sports,
        developmentFee: development,
        transportFee: Math.max(0, transport),
      },
      status: 'completed',
      collectedBy: collectorName,
    });

    setIsProcessing(false);
    showToast(`Payment of ₹${payAmount.toLocaleString('en-IN')} successfully recorded for ${selectedStudent.name}!`);
    openReceiptModal(newTxn);

    // Update locally selected student view
    setSelectedStudent(prev => ({
      ...prev,
      paidFee: prev.paidFee + payAmount,
      pendingFee: Math.max(0, prev.pendingFee - payAmount),
      feeStatus: Math.max(0, prev.pendingFee - payAmount) === 0 ? 'paid' : 'partial'
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Futuristic Ledger Header & Live KPI Metrics */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 shadow-inner">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
                  Digital Fee Collection Counter & Ledger
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    Live Counter Active
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Conveniently collect tuition & institutional fees, generate holographic receipts, and reconcile student ledgers
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-right">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Institution U-DISE</div>
              <div className="text-xs font-mono font-bold text-indigo-300">18100508901 · CBSE UGS-AS</div>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-right">
              <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">UPI Virtual Terminal</div>
              <div className="text-xs font-mono font-bold text-emerald-300">ugs.bhakatgaon@oksbi</div>
            </div>
          </div>
        </div>

        {/* 4 Financial Key Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Total Fee Demand</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-display text-white tabular-nums">
              ₹{totalSchoolDemanded.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500">
              For {students.length} enrolled students
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
            <div className="text-xs text-emerald-400 flex items-center justify-between">
              <span>Total Fee Collected</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-display text-emerald-300 tabular-nums">
              ₹{totalSchoolCollected.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-400/80 font-medium">
              {Math.round((totalSchoolCollected / (totalSchoolDemanded || 1)) * 100)}% realization rate
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1">
            <div className="text-xs text-amber-400 flex items-center justify-between">
              <span>Outstanding Dues</span>
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-display text-amber-300 tabular-nums">
              ₹{totalSchoolPending.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-amber-400/80 font-medium">
              {students.filter(s => s.pendingFee > 0).length} students pending dues
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-1">
            <div className="text-xs text-cyan-400 flex items-center justify-between">
              <span>Transactions Recorded</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-display text-cyan-300 tabular-nums">
              {totalTransactionsCount} Receipts
            </div>
            <div className="text-[11px] text-cyan-400/80 font-medium">
              Audit trail verified
            </div>
          </div>
        </div>
      </div>

      {/* Main Fee Collection Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Student Selection & Search (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-400" />
                Select Student for Fee Deposit
              </h3>
              <span className="text-xs text-slate-400">
                {filteredStudents.length} matching
              </span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Name, Adm No (UGS/..), or Class..."
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs text-white placeholder-slate-500 transition-colors"
              />
            </div>

            {/* Quick Status Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
              {(['All', 'pending', 'partial', 'paid'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFeeStatusFilter(tab)}
                  className={`flex-1 py-1.5 rounded-lg font-medium capitalize transition-all ${
                    feeStatusFilter === tab
                      ? 'bg-indigo-600 text-white font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab === 'All' ? 'All' : tab}
                </button>
              ))}
            </div>

            {/* Student Scrollable List */}
            <div className="max-h-[460px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredStudents.map(student => {
                const isSelected = selectedStudent?.id === student.id;
                return (
                  <div
                    key={student.id}
                    onClick={() => handleSelectStudent(student)}
                    className={`p-3.5 rounded-2xl cursor-pointer border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-10 h-10 rounded-xl object-cover bg-slate-800 border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                          {student.name}
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-indigo-300">{student.admissionNo}</span>
                          <span>·</span>
                          <span>{student.grade} - {student.section}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-white">
                        ₹{student.pendingFee.toLocaleString('en-IN')}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        student.pendingFee === 0 
                          ? 'text-emerald-400' 
                          : student.paidFee > 0 
                          ? 'text-cyan-400' 
                          : 'text-amber-400'
                      }`}>
                        {student.pendingFee === 0 ? 'Clear' : student.paidFee > 0 ? 'Partial' : 'Due'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Student Profile & Detailed Ledger Breakdown */}
          {selectedStudent && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Student Ledger Dossier
                </span>
                <span className="text-[11px] font-mono text-indigo-400">
                  {selectedStudent.admissionNo}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/40 bg-slate-800 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-base font-bold text-white truncate">
                    {selectedStudent.name}
                  </h4>
                  <div className="text-xs text-slate-400">
                    {selectedStudent.grade} ({selectedStudent.section}) · Roll #{selectedStudent.rollNo}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Guardian: <span className="text-slate-300 font-medium">{selectedStudent.guardianName}</span> ({selectedStudent.phone})
                  </div>
                </div>
              </div>

              {/* Fee Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Payment Clearance</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {Math.round((selectedStudent.paidFee / (selectedStudent.totalFee || 1)) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((selectedStudent.paidFee / (selectedStudent.totalFee || 1)) * 100))}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-400">
                  <span>Paid: ₹{selectedStudent.paidFee.toLocaleString('en-IN')}</span>
                  <span className="text-amber-400 font-bold">Due: ₹{selectedStudent.pendingFee.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Standard Component Distribution */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Annual Component Split</div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-300">
                    <span>Tuition & Core Academics (60%)</span>
                    <span className="font-mono">₹{(selectedStudent.totalFee * 0.60).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>STEM, Robotics & Innovation Labs (15%)</span>
                    <span className="font-mono">₹{(selectedStudent.totalFee * 0.15).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Sports, Martial Arts & Athletics (10%)</span>
                    <span className="font-mono">₹{(selectedStudent.totalFee * 0.10).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Campus Infrastructure Development (10%)</span>
                    <span className="font-mono">₹{(selectedStudent.totalFee * 0.10).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Smart Digital Services & Library (5%)</span>
                    <span className="font-mono">₹{(selectedStudent.totalFee * 0.05).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Interactive Fee Collection Terminal (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleProcessPayment} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-indigo-500/40 shadow-2xl space-y-6 relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-display text-white flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-indigo-400" />
                  Direct Fee Collection Terminal
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Collecting for <span className="text-white font-bold">{selectedStudent.name}</span> ({selectedStudent.admissionNo})
                </p>
              </div>

              <div className="px-3 py-1 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-mono">
                Counter #01
              </div>
            </div>

            {/* Term Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Select Academic Fee Term / Quarter
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4', 'Annual Package'] as const).map(term => (
                  <button
                    type="button"
                    key={term}
                    onClick={() => setPayTerm(term)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all border ${
                      payTerm === term
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input & Presets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                  Amount to Collect (INR ₹)
                </label>
                <span className="text-xs text-amber-400 font-mono font-bold">
                  Remaining Dues: ₹{selectedStudent.pendingFee.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-indigo-400">
                  ₹
                </span>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={payAmount}
                  onChange={e => setPayAmount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border-2 border-slate-800 focus:border-indigo-500 focus:outline-none text-xl font-bold font-mono text-white placeholder-slate-600 transition-colors"
                  placeholder="Enter amount..."
                  required
                />
              </div>

              {/* Quick Amount Suggestion Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedStudent.pendingFee > 0 && (
                  <button
                    type="button"
                    onClick={() => setPayAmount(selectedStudent.pendingFee)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold transition-all"
                  >
                    Full Balance: ₹{selectedStudent.pendingFee.toLocaleString('en-IN')}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPayAmount(10500)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-semibold transition-all"
                >
                  Standard Qtr: ₹10,500
                </button>
                <button
                  type="button"
                  onClick={() => setPayAmount(21000)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-semibold transition-all"
                >
                  Half-Yearly: ₹21,000
                </button>
                <button
                  type="button"
                  onClick={() => setPayAmount(5000)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-semibold transition-all"
                >
                  ₹5,000
                </button>
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300">
                Payment Channel / Mode
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { mode: 'UPI' as const, label: 'UPI / QR', icon: QrCode },
                  { mode: 'Credit/Debit Card' as const, label: 'Card / POS', icon: CreditCard },
                  { mode: 'Cash' as const, label: 'Cash Desk', icon: Banknote },
                  { mode: 'Net Banking' as const, label: 'Net Banking', icon: Building2 },
                  { mode: 'Cheque' as const, label: 'Cheque / DD', icon: Receipt },
                ].map(({ mode, label, icon: Icon }) => (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => setPayMethod(mode)}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border text-center transition-all ${
                      payMethod === mode
                        ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold shadow-md shadow-indigo-600/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${payMethod === mode ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Channel Specific Preview / Info */}
            {payMethod === 'UPI' && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-24 bg-white p-1.5 rounded-xl shadow-md shrink-0 flex items-center justify-center">
                  {/* Dynamic simulated high-res QR pattern */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=ugs.bhakatgaon@oksbi%26pn=United%20Global%20School%26am=${payAmount}%26tn=Fee-${selectedStudent.admissionNo}`}
                    alt="UPI Payment QR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    Instant UPI QR Code (Dynamic)
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Scan via Google Pay, PhonePe, Paytm, or BHIM to pay ₹{payAmount.toLocaleString('en-IN')} directly to United Global School account.
                  </p>
                  <div className="font-mono text-emerald-400 font-bold text-[11px] pt-1">
                    UPI VPA: ugs.bhakatgaon@oksbi
                  </div>
                </div>
              </div>
            )}

            {/* Reference Number & Collector Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">
                  Transaction / Cheque / Slip Ref (Auto if blank)
                </label>
                <input
                  type="text"
                  placeholder="e.g. UPI/REF/984712 or POS-8812"
                  value={customRef}
                  onChange={e => setCustomRef(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">
                  Authorized Collector / Counter Desk
                </label>
                <input
                  type="text"
                  value={collectorName}
                  onChange={e => setCollectorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Late Fee Waiver checkbox */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <input
                type="checkbox"
                id="lateFee"
                checked={lateFeeWaiver}
                onChange={e => setLateFeeWaiver(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
              />
              <label htmlFor="lateFee" className="text-xs text-slate-300 cursor-pointer">
                Apply Late Fee Waiver under 2026 Academic Incentive Policy (Zero Penalty)
              </label>
            </div>

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>CONFIRM PAYMENT & ISSUE OFFICIAL RECEIPT (₹{payAmount.toLocaleString('en-IN')})</span>
            </button>
          </form>
        </div>

      </div>

      {/* RECENT FEE TRANSACTIONS AUDIT LEDGER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-indigo-400" />
              Official Fee Collection Ledger & Audit Trail
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any receipt to view, verify, and reprint the CBSE-standard official digital payment slip
            </p>
          </div>

          <div className="text-xs font-medium text-slate-400">
            Total {transactions.length} receipts archived
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] bg-slate-950/60">
                <th className="py-3 px-4 font-semibold">Receipt No</th>
                <th className="py-3 px-4 font-semibold">Student Name</th>
                <th className="py-3 px-4 font-semibold">Adm No</th>
                <th className="py-3 px-4 font-semibold">Class</th>
                <th className="py-3 px-4 font-semibold">Fee Term</th>
                <th className="py-3 px-4 font-semibold">Mode</th>
                <th className="py-3 px-4 font-semibold text-right">Amount</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transactions.slice(0, 15).map(txn => (
                <tr key={txn.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-300">
                    {txn.receiptNo}
                  </td>
                  <td className="py-3 px-4 font-bold text-white">
                    {txn.studentName}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {txn.admissionNo}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {txn.grade} ({txn.section})
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {txn.term}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] font-semibold text-slate-200">
                      {txn.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-right">
                    ₹{txn.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Paid
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => openReceiptModal(txn)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-white border border-indigo-500/30 text-[11px] font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
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
  );
};
