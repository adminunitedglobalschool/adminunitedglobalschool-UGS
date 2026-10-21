import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { Staff } from '../../../types/school';
import { IdCardRenderer } from './IdCardRenderer';
import { PvcSheetPrintView } from './PvcSheetPrintView';
import { 
  CreditCard, 
  UserPlus, 
  Users, 
  Clock, 
  CheckCircle2, 
  Search, 
  DollarSign, 
  Printer, 
  Sparkles, 
  Briefcase, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  Mail, 
  FileText,
  X,
  Layers
} from 'lucide-react';

export const StaffAdminView: React.FC = () => {
  const { 
    staff, 
    addStaff, 
    markStaffAttendance, 
    disburseStaffSalary, 
    showToast 
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'add' | 'idcard' | 'attendance' | 'wages' | 'pvc-sheet'>('roster');
  const [selectedStaffForCard, setSelectedStaffForCard] = useState<Staff>(staff[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWageSlipStaff, setSelectedWageSlipStaff] = useState<Staff | null>(null);

  // New Staff Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    empId: '',
    role: 'Transport Lead & Fleet Supervisor',
    department: 'Transport' as any,
    phone: '',
    email: '',
    salary: 32000,
    shift: 'General Day Shift' as any,
    zone: 'Bus Fleet Depot & GPS Terminal',
    joiningDate: '2026-10-10',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.empId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMonthlyWage = staff.reduce((sum, s) => sum + s.salary, 0);
  const pendingWagesCount = staff.filter(s => s.salaryStatus === 'pending').length;
  const presentStaffCount = staff.filter(s => s.attendanceStatus === 'present').length;

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast('Please enter staff name and contact phone.');
      return;
    }

    setIsSubmitting(true);
    const newStaff = addStaff({
      name: formData.name,
      empId: formData.empId || `UGS-ADM-0${staff.length + 20}`,
      role: formData.role,
      department: formData.department,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@unitedglobalschool.edu.in`,
      salary: Number(formData.salary) || 30000,
      shift: formData.shift,
      zone: formData.zone,
      joiningDate: formData.joiningDate,
    });

    setIsSubmitting(false);
    setSelectedStaffForCard(newStaff);
    setActiveSubTab('idcard');
    showToast(`Staff member registered: ${newStaff.name} (${newStaff.role})! Pass preview opened.`);
  };

  const handleDisburseAllWages = () => {
    staff.forEach(s => {
      if (s.salaryStatus === 'pending') {
        disburseStaffSalary(s.id);
      }
    });
    showToast('All pending operational staff wages disbursed.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Sub-Navigation Switchers */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveSubTab('roster')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'roster'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Staff Roster ({staff.length})
          </button>

          <button
            onClick={() => setActiveSubTab('add')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'add'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Hire Staff
          </button>

          <button
            onClick={() => setActiveSubTab('attendance')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'attendance'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            Shifts & Attendance
          </button>

          <button
            onClick={() => setActiveSubTab('wages')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'wages'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Wages & Payroll
          </button>

          <button
            onClick={() => setActiveSubTab('idcard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'idcard'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Duty Passes
          </button>

          <button
            onClick={() => setActiveSubTab('pvc-sheet')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'pvc-sheet'
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-950 border border-amber-500/40 text-amber-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            9-PVC A4 Sheet Print
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400">Total Staff Fleet</div>
          <div className="text-2xl font-bold font-display text-white">{staff.length} Executives</div>
          <div className="text-[10px] text-cyan-400">Finance, Labs, Transport & Logistics</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400">On-Duty Today</div>
          <div className="text-2xl font-bold font-display text-emerald-400">{presentStaffCount} / {staff.length}</div>
          <div className="text-[10px] text-emerald-400 font-mono">{(presentStaffCount / staff.length * 100).toFixed(0)}% Shift Present</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400">Monthly Wage Budget</div>
          <div className="text-2xl font-bold font-display text-white tabular-nums">₹{totalMonthlyWage.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-slate-400">Disbursed by Admin Desk</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400">Pending Wage Settlement</div>
          <div className="text-2xl font-bold font-display text-amber-400">{pendingWagesCount} Staff</div>
          <div className="text-[10px] text-amber-400">October 2026 Cycle</div>
        </div>
      </div>

      {/* SUB-VIEW 1: HIRE STAFF */}
      {activeSubTab === 'add' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                Operational Staff Recruitment & Onboarding
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Register administrative officers, lab assistants, transport wardens, security and facility executives
              </p>
            </div>
            <button
              onClick={() => setActiveSubTab('roster')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel & View Roster
            </button>
          </div>

          <form onSubmit={handleStaffSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Staff Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. Pranjal Baruah"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Employee ID (Optional Auto-Gen)
                </label>
                <input
                  type="text"
                  placeholder="e.g. UGS-ADM-022"
                  value={formData.empId}
                  onChange={e => setFormData({ ...formData, empId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Staff Role / Designation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chief Accounts Officer & Fee Incharge"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Department Portfolio *
                </label>
                <select
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="Accounts & Finance">Accounts & Finance</option>
                  <option value="Administration">General Administration</option>
                  <option value="Admissions">Admissions Directorate</option>
                  <option value="Transport">Transport & Bus Fleet</option>
                  <option value="Campus Security">Campus Safety & Security</option>
                  <option value="IT Support">IT & Telemetry Support</option>
                  <option value="Laboratories">STEM & Science Laboratories</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Duty Shift Allocation *
                </label>
                <select
                  value={formData.shift}
                  onChange={e => setFormData({ ...formData, shift: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="General Day Shift">General Day Shift (08:30 AM – 04:00 PM)</option>
                  <option value="Morning Shift">Morning Early Shift (07:00 AM – 02:30 PM)</option>
                  <option value="Transport Fleet Shift">Transport Fleet Shift (06:30 AM – 05:00 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 94350 XXXXX"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Official Email
                </label>
                <input
                  type="email"
                  placeholder="staff@unitedglobalschool.edu.in"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Assigned Campus Duty Zone
                </label>
                <input
                  type="text"
                  placeholder="e.g. Finance Wing - Counter Desk 01"
                  value={formData.zone}
                  onChange={e => setFormData({ ...formData, zone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Monthly Wage / Salary (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="35000"
                  value={formData.salary}
                  onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>

            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveSubTab('roster')}
                className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Register Staff & Issue Duty Pass
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-VIEW 2: SHIFTS & ATTENDANCE */}
      {activeSubTab === 'attendance' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Operational Staff Daily Duty Shifts & Attendance
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Session Date: 10 October 2026 · Campus Zone Duty & Security Rosters
              </p>
            </div>

            <button
              onClick={() => {
                staff.forEach(s => markStaffAttendance(s.id, 'present'));
                showToast('All operational staff marked ON-DUTY today');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-colors"
            >
              Mark All Staff Present
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Department & Role</th>
                  <th className="py-3 px-4">Duty Shift</th>
                  <th className="py-3 px-4">Assigned Campus Zone</th>
                  <th className="py-3 px-4 text-center">Status Today</th>
                  <th className="py-3 px-4 text-right">Quick Mark Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {staff.map(member => (
                  <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-9 h-9 rounded-xl bg-slate-950 p-0.5 border border-slate-800"
                      />
                      <div>
                        <div className="font-bold text-white text-xs">{member.name}</div>
                        <div className="text-[10px] font-mono text-amber-400">{member.empId}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-white font-medium">{member.role}</div>
                      <div className="text-[10px] text-slate-400">{member.department}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono">
                        {member.shift}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                      {member.zone}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                        member.attendanceStatus === 'present' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                        member.attendanceStatus === 'leave' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      }`}>
                        {member.attendanceStatus || 'present'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => markStaffAttendance(member.id, 'present')}
                        className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold transition-colors"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => markStaffAttendance(member.id, 'leave')}
                        className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[11px] font-bold transition-colors"
                      >
                        Leave
                      </button>
                      <button
                        onClick={() => markStaffAttendance(member.id, 'absent')}
                        className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px] font-bold transition-colors"
                      >
                        Absent
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: WAGES & PAYROLL */}
      {activeSubTab === 'wages' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                Operational Staff Monthly Wage Ledger
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                October 2026 Salary Disbursals · Central Administration
              </p>
            </div>

            <button
              onClick={handleDisburseAllWages}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <DollarSign className="w-4 h-4" />
              Disburse All Pending Wages
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Role & Department</th>
                  <th className="py-3 px-4 font-mono">Monthly Scale</th>
                  <th className="py-3 px-4">Wage Status</th>
                  <th className="py-3 px-4">Last Disbursal Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {staff.map(member => (
                  <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-9 h-9 rounded-xl bg-slate-950 p-0.5 border border-slate-800"
                      />
                      <div>
                        <div className="font-bold text-white text-xs">{member.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{member.empId}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-white font-medium">{member.role}</div>
                      <div className="text-[10px] text-slate-400">{member.department}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                      ₹{member.salary.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                        member.salaryStatus === 'paid' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {member.salaryStatus === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {member.salaryStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {member.lastSalaryDate || 'Pending Settlement'}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      {member.salaryStatus === 'pending' ? (
                        <button
                          onClick={() => disburseStaffSalary(member.id)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
                        >
                          Disburse Wage
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedWageSlipStaff(member)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1 inline-flex"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          Wage Slip
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: SMART DUTY PASSES */}
      {activeSubTab === 'idcard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-5 space-y-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Select Staff for ID Pass
              </span>
              <span className="text-[10px] text-amber-400 font-mono">
                OPERATIONAL BADGE
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Select from Operational Staff:
              </label>
              <select
                value={selectedStaffForCard.id}
                onChange={e => {
                  const found = staff.find(s => s.id === e.target.value);
                  if (found) setSelectedStaffForCard(found);
                }}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-400 focus:outline-none"
              >
                {staff.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.empId} · {s.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Staff Brief */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Staff Name:</span>
                <span className="text-white font-bold">{selectedStaffForCard.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Employee ID:</span>
                <span className="font-mono text-amber-400 font-bold">{selectedStaffForCard.empId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Role & Dept:</span>
                <span className="text-slate-200">{selectedStaffForCard.role} ({selectedStaffForCard.department})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assigned Zone:</span>
                <span className="text-emerald-400 font-semibold">{selectedStaffForCard.zone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Duty Shift:</span>
                <span className="text-cyan-400 font-mono text-[11px]">{selectedStaffForCard.shift}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Monthly Wage:</span>
                <span className="text-white font-mono font-bold">₹{selectedStaffForCard.salary.toLocaleString('en-IN')}/mo ({selectedStaffForCard.salaryStatus.toUpperCase()})</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Authorized for campus infrastructure & logistics access</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Verified emergency protocol personnel</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col items-center p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="text-xs font-mono text-slate-400 mb-4 tracking-wider uppercase">
              Official Operational Campus Duty Pass Preview
            </div>

            <IdCardRenderer
              data={{
                type: 'staff',
                id: selectedStaffForCard.id,
                code: selectedStaffForCard.empId,
                name: selectedStaffForCard.name,
                roleOrGrade: selectedStaffForCard.role,
                departmentOrHouse: `${selectedStaffForCard.department} · ${selectedStaffForCard.zone}`,
                phone: selectedStaffForCard.phone,
                email: selectedStaffForCard.email,
                avatar: selectedStaffForCard.avatar,
                validThrough: 'Valid Through 2027',
                zoneOrRoll: `ZONE: ${selectedStaffForCard.zone}`,
              }}
              onPrint={() => {
                showToast(`Printing Staff Pass for ${selectedStaffForCard.name}...`);
                window.print();
              }}
              onOpenBatchA4={() => setActiveSubTab('pvc-sheet')}
            />
          </div>

        </div>
      )}

      {/* SUB-VIEW: 9-PVC CARD A4 SHEET PRINT STUDIO */}
      {activeSubTab === 'pvc-sheet' && (
        <PvcSheetPrintView />
      )}

      {/* SUB-VIEW 5: STAFF ROSTER CARDS */}
      {activeSubTab === 'roster' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff by name, role, or department..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setActiveSubTab('add')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Hire Staff
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStaff.map(member => (
              <div
                key={member.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 p-0.5 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                        <img 
                          src={member.avatar} 
                          alt={member.name} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                          {member.name}
                        </h4>
                        <div className="text-[11px] font-mono text-amber-400">
                          {member.empId}
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {member.department}
                    </span>
                  </div>

                  <div className="mt-3 text-xs font-semibold text-slate-200">
                    {member.role}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Duty Shift:</span>
                      <span className="text-slate-200 truncate block">{member.shift}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Monthly Wage:</span>
                      <span className="font-mono font-bold text-white">₹{member.salary.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 text-[10px] block">Assigned Zone:</span>
                      <span className="font-semibold text-cyan-400">{member.zone}</span>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-slate-400 space-y-1">
                    <div className="truncate">Contact: <strong className="text-slate-300">{member.phone}</strong></div>
                    <div className="truncate">Email: <strong className="text-slate-300">{member.email}</strong></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedStaffForCard(member);
                      setActiveSubTab('idcard');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Duty Pass
                  </button>

                  <div className="flex items-center gap-1.5">
                    {member.salaryStatus === 'pending' ? (
                      <button
                        onClick={() => disburseStaffSalary(member.id)}
                        className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold transition-colors"
                      >
                        Pay Wage
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedWageSlipStaff(member)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium transition-colors"
                      >
                        Wage Slip
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wage Slip Modal */}
      {selectedWageSlipStaff && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    Operational Staff Wage Disbursal Voucher
                  </h4>
                  <div className="text-xs text-slate-400">
                    United Global School · October 2026 Cycle
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedWageSlipStaff(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Staff Employee:</span>
                <span className="font-bold text-white">{selectedWageSlipStaff.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Employee ID / Role:</span>
                <span className="font-mono text-amber-400 font-semibold">{selectedWageSlipStaff.empId} · {selectedWageSlipStaff.role}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Department / Shift:</span>
                <span className="text-slate-200">{selectedWageSlipStaff.department} ({selectedWageSlipStaff.shift})</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Basic Monthly Wage:</span>
                <span className="font-mono text-white">₹{Math.round(selectedWageSlipStaff.salary * 0.8).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Special Duty Shift Allowance:</span>
                <span className="font-mono text-white">₹{Math.round(selectedWageSlipStaff.salary * 0.2).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold text-amber-400">
                <span>Net Disbursed Wage:</span>
                <span className="font-mono">₹{selectedWageSlipStaff.salary.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400">Status: <strong className="text-emerald-400">PAID & SETTLED</strong></span>
              <button
                onClick={() => {
                  showToast('Printing staff wage voucher...');
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Wage Voucher
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
