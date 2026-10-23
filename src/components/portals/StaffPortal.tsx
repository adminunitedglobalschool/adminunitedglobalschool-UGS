import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  CreditCard, 
  Search, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  Plus, 
  FileText,
  DollarSign,
  Download,
  Bus,
  ShieldCheck,
  Check,
  ShieldAlert,
  LogOut,
  User,
  X
} from 'lucide-react';
import { Student } from '../../types/school';

export const StaffPortal: React.FC = () => {
  const { 
    students, 
    transactions, 
    recordPayment, 
    openReceiptModal, 
    setRole, 
    setPublicPage,
    showToast,
    rolePermissions 
  } = useSchool();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    setRole('public');
    setPublicPage('home');
    showToast('Logged out successfully from Staff & Accounts Desk.');
  };

  const canCollectFees = rolePermissions.staff.canCollectFees;
  const canViewDefaulters = rolePermissions.staff.canViewDefaulters;
  const canViewLedger = rolePermissions.staff.canViewLedger;

  const availableTabs: ('counter' | 'dues' | 'logs')[] = [];
  if (canCollectFees) availableTabs.push('counter');
  if (canViewDefaulters) availableTabs.push('dues');
  if (canViewLedger) availableTabs.push('logs');

  const [activeTab, setActiveTab] = useState<'counter' | 'dues' | 'logs'>(
    availableTabs[0] || 'counter'
  );

  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [canCollectFees, canViewDefaulters, canViewLedger]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(students[0]);

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState<number>(10500);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Cheque' | 'Credit/Debit Card'>('Cash');
  const [paymentTerm, setPaymentTerm] = useState<'Quarter 1' | 'Quarter 2' | 'Quarter 3' | 'Quarter 4' | 'Annual Package'>('Quarter 3');
  const [paymentRef, setPaymentRef] = useState('');

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingDuesStudents = students.filter(s => s.pendingFee > 0);

  const handleProcessCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || paymentAmount <= 0) return;

    const ref = paymentRef.trim() || `${paymentMode.toUpperCase()}-CNT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTxn = recordPayment({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      admissionNo: selectedStudent.admissionNo,
      grade: selectedStudent.grade,
      section: selectedStudent.section,
      amount: paymentAmount,
      date: '2026-10-10',
      paymentMethod: paymentMode as any,
      transactionRef: ref,
      term: paymentTerm,
      breakdown: {
        tuitionFee: Math.round(paymentAmount * 0.62),
        stemLabFee: Math.round(paymentAmount * 0.15),
        sportsActivityFee: Math.round(paymentAmount * 0.10),
        developmentFee: Math.round(paymentAmount * 0.08),
        transportFee: Math.round(paymentAmount * 0.05),
      },
      status: 'completed',
      collectedBy: 'Mr. Pranjal Baruah (Fee Counter Desk)',
    });

    setPaymentRef('');
    openReceiptModal(newTxn);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-display text-white">
                Accounts & Digital Fee Management Desk
              </h1>
              <span className="text-[11px] text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                Mr. Pranjal Baruah (Accounts Officer)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              United Global School · Bhakatgaon Administrative Wing, Rupahi Town
            </p>
          </div>
        </div>

        {/* Profile Icon and Logout Action */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          {/* Profile Button */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-400 text-slate-200 hover:text-white transition-all shadow-sm cursor-pointer group"
              title="View Staff Profile"
            >
              <div className="relative">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <User className="w-4 h-4" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight">Mr. Pranjal Baruah</div>
                <div className="text-[10px] text-amber-400 font-medium leading-tight">Accounts Officer</div>
              </div>
            </button>

            {/* Profile Dropdown / Card */}
            {isProfileOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      PB
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Mr. Pranjal Baruah</div>
                      <div className="text-xs text-amber-400">Chief Accounts & Bursar</div>
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
                    <span className="text-slate-400">Staff ID:</span>
                    <span className="text-slate-200 font-mono">STF-ACC-101</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Department:</span>
                    <span className="text-amber-400 font-semibold">Bursar & Digital Fee Counter</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Terminal:</span>
                    <span className="text-emerald-400 font-medium">Counter #01 (Active POS)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Official Email:</span>
                    <span className="text-slate-200 font-mono">accounts@unitedglobalschool.in</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Authorization:</span>
                    <span className="text-emerald-400 font-semibold">Fee Collection & Audit Clearance</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 hover:text-rose-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out of Staff & Fees Desk</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dedicated Log Out Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 text-rose-300 hover:text-white text-xs font-semibold transition-all shadow-sm cursor-pointer active:scale-95"
            title="Log out of Staff Portal"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Top Tabs (Enforced by Admin Permissions) */}
      {availableTabs.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-rose-500/40 text-center space-y-4 shadow-2xl animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-display text-white">
              Staff Access Restricted by School Administration
            </h2>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Your permissions for Fee Collection Counter, Defaulters Dues, and Ledger Audits have been locked in the Central Roles & Permissions Matrix. Contact the School Directorate to update your operational clearance.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {canCollectFees && (
            <button
              onClick={() => setActiveTab('counter')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'counter'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Fee Collection Counter</span>
            </button>
          )}

          {canViewDefaulters && (
            <button
              onClick={() => setActiveTab('dues')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'dues'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Pending Dues & Defaulters ({pendingDuesStudents.length})</span>
            </button>
          )}

          {canViewLedger && (
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'logs'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Daily Collection Ledger ({transactions.length})</span>
            </button>
          )}
        </div>
      )}

      {/* TAB 1: FEE COLLECTION COUNTER */}
      {activeTab === 'counter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Student Selection & Search */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                1. Select or Search Student
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Type name, roll, or admission ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="max-h-80 overflow-y-auto space-y-1.5 pr-1">
                {filteredStudents.map(std => {
                  const isSelected = selectedStudent?.id === std.id;
                  return (
                    <button
                      key={std.id}
                      onClick={() => {
                        setSelectedStudent(std);
                        setPaymentAmount(std.pendingFee > 0 ? std.pendingFee : 10500);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left transition-colors flex items-center justify-between text-xs border ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/40 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-white">{std.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {std.admissionNo} · {std.grade} ({std.section})
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-mono font-bold tabular-nums text-xs ${std.pendingFee > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {std.pendingFee > 0 ? `₹${std.pendingFee.toLocaleString('en-IN')}` : 'Cleared'}
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase">{std.feeStatus}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Fee Collection Form */}
          <div className="lg:col-span-7 space-y-4">
            {selectedStudent ? (
              <form onSubmit={handleProcessCollection} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
                
                {/* Selected Student Banner */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                      Selected Candidate:
                    </span>
                    <h3 className="text-xl font-bold font-display text-white">
                      {selectedStudent.name}
                    </h3>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {selectedStudent.grade} - Section {selectedStudent.section} · Guardian: {selectedStudent.guardianName} ({selectedStudent.phone})
                    </div>
                  </div>

                  <div className="text-right p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="text-slate-400">Current Outstanding:</div>
                    <div className="font-mono font-bold text-amber-400 text-base tabular-nums">
                      ₹{selectedStudent.pendingFee.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Billing Installment / Term
                    </label>
                    <select
                      value={paymentTerm}
                      onChange={e => setPaymentTerm(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="Quarter 1">Quarter 1 (April - June)</option>
                      <option value="Quarter 2">Quarter 2 (July - Sept)</option>
                      <option value="Quarter 3">Quarter 3 (Oct - Dec)</option>
                      <option value="Quarter 4">Quarter 4 (Jan - March)</option>
                      <option value="Annual Package">Full Annual Settlement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={paymentMode}
                      onChange={e => setPaymentMode(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="Cash">Cash at Counter</option>
                      <option value="UPI">UPI Digital Payment</option>
                      <option value="Cheque">Bank Cheque / DD</option>
                      <option value="Credit/Debit Card">POS Card Swipe</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Collection Amount (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={paymentAmount}
                      onChange={e => setPaymentAmount(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Reference / Cheque No / VPA (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CHQ-992014 or UPI-TXN"
                      value={paymentRef}
                      onChange={e => setPaymentRef(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Instant Itemized Breakdown Preview */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Ledger Allocation Preview:
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Tuition & Smart Classroom (62%):</span>
                    <span className="font-mono tabular-nums">₹{Math.round(paymentAmount * 0.62).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>STEM & Robotics Innovation Lab (15%):</span>
                    <span className="font-mono tabular-nums">₹{Math.round(paymentAmount * 0.15).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Sports & Physical Fitness (10%):</span>
                    <span className="font-mono tabular-nums">₹{Math.round(paymentAmount * 0.10).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Campus Development & Energy (8%):</span>
                    <span className="font-mono tabular-nums">₹{Math.round(paymentAmount * 0.08).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Record Collection & Issue Official Stamped Receipt
                </button>

              </form>
            ) : (
              <div className="p-12 text-center text-slate-400 bg-slate-900 rounded-3xl border border-slate-800 text-xs">
                Please search or select a student on the left to process fee collection.
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: PENDING DUES */}
      {activeTab === 'dues' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Outstanding Balance & Overdue Registry
              </h3>
              <p className="text-xs text-slate-400">
                Follow up with guardians via SMS reminders or direct collection
              </p>
            </div>
            <button
              onClick={() => showToast('Automated SMS reminders broadcasted to all overdue guardians.')}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-colors"
            >
              Broadcast Bulk Reminders
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-3 px-3">Student & Adm No</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3">Guardian Mobile</th>
                  <th className="py-3 px-3 text-right">Total Annual</th>
                  <th className="py-3 px-3 text-right">Paid</th>
                  <th className="py-3 px-3 text-right">Balance Due</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {pendingDuesStudents.map(std => (
                  <tr key={std.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{std.name}</div>
                      <div className="text-[11px] font-mono text-cyan-400">{std.admissionNo}</div>
                    </td>
                    <td className="py-3 px-3">{std.grade} ({std.section})</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{std.phone}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums">₹{std.totalFee.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-400">₹{std.paidFee.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-rose-400">
                      ₹{std.pendingFee.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedStudent(std);
                          setActiveTab('counter');
                          setPaymentAmount(std.pendingFee);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-[11px]"
                      >
                        Collect at Counter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DAILY LEDGER */}
      {activeTab === 'logs' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Accounts Settlement Ledger
              </h3>
              <p className="text-xs text-slate-400">All authenticated receipts issued by accounts wing</p>
            </div>
            <button
              onClick={() => showToast('Audit ledger exported to accounts Excel/CSV.')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Export Accounts CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-3 px-3">Receipt No</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Term</th>
                  <th className="py-3 px-3">Mode</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {transactions.map(txn => (
                  <tr key={txn.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-mono font-bold text-cyan-400">{txn.receiptNo}</td>
                    <td className="py-3 px-3 font-medium text-white">{txn.studentName}</td>
                    <td className="py-3 px-3 text-slate-400">{txn.date}</td>
                    <td className="py-3 px-3">{txn.term}</td>
                    <td className="py-3 px-3 font-mono">{txn.paymentMethod}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400 tabular-nums">
                      ₹{txn.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => openReceiptModal(txn)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-[11px]"
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
      )}

    </div>
  );
};
