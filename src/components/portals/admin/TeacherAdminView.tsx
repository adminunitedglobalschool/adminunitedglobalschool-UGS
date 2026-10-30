import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { Teacher } from '../../../types/school';
import { IdCardRenderer } from './IdCardRenderer';
import { PvcSheetPrintView } from './PvcSheetPrintView';
import { 
  Users, 
  UserPlus, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  DollarSign, 
  Printer, 
  Sparkles, 
  BookOpen, 
  Award,
  Phone,
  Mail,
  FileText,
  X,
  Layers
} from 'lucide-react';

export const TeacherAdminView: React.FC = () => {
  const { 
    teachers, 
    addTeacher, 
    markTeacherAttendance, 
    disburseTeacherSalary, 
    showToast 
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'add' | 'idcard' | 'attendance' | 'payroll' | 'pvc-sheet'>('roster');
  const [selectedTeacherForCard, setSelectedTeacherForCard] = useState<Teacher>(teachers[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayslipTeacher, setSelectedPayslipTeacher] = useState<Teacher | null>(null);

  // New Teacher Onboarding Form State
  const [formData, setFormData] = useState({
    name: '',
    empId: '',
    designation: 'Senior Faculty & TGT',
    subject: 'Mathematics',
    assignedClasses: 'Class 9-A, Class 10-A',
    phone: '',
    email: '',
    qualification: 'M.Sc., B.Ed.',
    experience: '6 Years',
    salary: 52000,
    joiningDate: '2026-10-10',
    bloodGroup: 'B+',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMonthlyPayroll = teachers.reduce((sum, t) => sum + t.salary, 0);
  const paidPayroll = teachers.filter(t => t.salaryStatus === 'paid').reduce((sum, t) => sum + t.salary, 0);
  const pendingPayroll = teachers.filter(t => t.salaryStatus === 'pending').reduce((sum, t) => sum + t.salary, 0);
  const presentTeachersCount = teachers.filter(t => t.attendanceStatus === 'present' || t.attendanceStatus === 'on_duty').length;

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.subject.trim()) {
      showToast('Please enter teacher name, subject, and contact phone.');
      return;
    }

    setIsSubmitting(true);
    const classesArray = formData.assignedClasses.split(',').map(c => c.trim()).filter(Boolean);
    const newTeacher = addTeacher({
      name: formData.name,
      empId: formData.empId || `UGS-T-0${teachers.length + 31}`,
      designation: formData.designation,
      subject: formData.subject,
      assignedClasses: classesArray.length > 0 ? classesArray : ['Class 10-A'],
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@unitedglobalschool.edu.in`,
      qualification: formData.qualification,
      experience: formData.experience,
      salary: Number(formData.salary) || 50000,
      joiningDate: formData.joiningDate,
      bloodGroup: formData.bloodGroup,
    });

    setIsSubmitting(false);
    setSelectedTeacherForCard(newTeacher);
    setActiveSubTab('idcard');
    showToast(`Faculty ${newTeacher.name} onboarded! Generated ID Card preview opened.`);
  };

  const handleDisburseAll = () => {
    teachers.forEach(t => {
      if (t.salaryStatus === 'pending') {
        disburseTeacherSalary(t.id);
      }
    });
    showToast('All pending faculty salaries disbursed successfully.');
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
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Faculty Roster ({teachers.length})
          </button>

          <button
            onClick={() => setActiveSubTab('add')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'add'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Add Teacher
          </button>

          <button
            onClick={() => setActiveSubTab('attendance')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'attendance'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Attendance ({presentTeachersCount}/{teachers.length})
          </button>

          <button
            onClick={() => setActiveSubTab('payroll')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'payroll'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Salary & Payroll
          </button>

          <button
            onClick={() => setActiveSubTab('idcard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'idcard'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            RFID ID Cards
          </button>

          <button
            onClick={() => setActiveSubTab('pvc-sheet')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'pvc-sheet'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 border border-emerald-500/40 text-emerald-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            9-PVC A4 Sheet Print
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400">Total Faculty</div>
          <div className="text-2xl font-bold font-display text-white">{teachers.length} Mentors</div>
          <div className="text-[10px] text-cyan-400">100% Post-Graduate / B.Ed.</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400">Present Today</div>
          <div className="text-2xl font-bold font-display text-emerald-400">{presentTeachersCount} / {teachers.length}</div>
          <div className="text-[10px] text-emerald-400 font-mono">{(presentTeachersCount / teachers.length * 100).toFixed(0)}% Attendance</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400">Monthly Payroll Budget</div>
          <div className="text-2xl font-bold font-display text-white tabular-nums">₹{totalMonthlyPayroll.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-slate-400">October 2026 Cycle</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400">Payroll Status</div>
          <div className="text-2xl font-bold font-display text-amber-400 tabular-nums">₹{pendingPayroll.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-amber-400">{teachers.filter(t => t.salaryStatus === 'pending').length} Pending Disbursals</div>
        </div>
      </div>

      {/* SUB-VIEW 1: ADD / ONBOARD TEACHER */}
      {activeSubTab === 'add' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                Faculty Recruitment & Onboarding Form
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Register certified teachers, assign curriculum responsibilities, configure monthly payroll and generate official RFID passes
              </p>
            </div>
            <button
              onClick={() => setActiveSubTab('roster')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel & View Roster
            </button>
          </div>

          <form onSubmit={handleTeacherSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Teacher Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Teacher XYZ 01"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Employee ID (Optional Auto-Gen)
                </label>
                <input
                  type="text"
                  placeholder="e.g. UGS-T-045"
                  value={formData.empId}
                  onChange={e => setFormData({ ...formData, empId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Designation / Academic Role *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Faculty & STEM Head"
                  value={formData.designation}
                  onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Department / Primary Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics & Advanced Robotics"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Assigned Teaching Classes
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10-A, 11-Science, 12-Science"
                  value={formData.assignedClasses}
                  onChange={e => setFormData({ ...formData, assignedClasses: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Official Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 94350 XXXXX"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Faculty Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@unitedglobalschool.edu.in"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Academic Qualifications
                </label>
                <input
                  type="text"
                  placeholder="e.g. M.Sc., Ph.D. (Physics), B.Ed."
                  value={formData.qualification}
                  onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Experience & Blood Group
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 10 Years"
                    value={formData.experience}
                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                  />
                  <select
                    value={formData.bloodGroup}
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Monthly Basic Salary (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="55000"
                  value={formData.salary}
                  onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Date of Joining Campus
                </label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={e => setFormData({ ...formData, joiningDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
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
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Register Faculty & Generate ID Badge
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-VIEW 2: TEACHER ATTENDANCE TRACKER */}
      {activeSubTab === 'attendance' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Daily Faculty Attendance Register
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Session Date: 10 October 2026 · Morning biometric telemetry & manual overrides
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  teachers.forEach(t => markTeacherAttendance(t.id, 'present'));
                  showToast('Marked all faculty members as PRESENT today');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-colors"
              >
                Mark All Faculty Present
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Faculty Member</th>
                  <th className="py-3 px-4">Subject / Dept</th>
                  <th className="py-3 px-4">Assigned Classes</th>
                  <th className="py-3 px-4">Attendance Rate</th>
                  <th className="py-3 px-4 text-center">Status Today</th>
                  <th className="py-3 px-4 text-right">Quick Mark Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {teachers.map(teacher => (
                  <tr key={teacher.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img 
                        src={teacher.avatar} 
                        alt={teacher.name} 
                        className="w-9 h-9 rounded-xl bg-slate-950 p-0.5 border border-slate-800"
                      />
                      <div>
                        <div className="font-bold text-white text-xs">{teacher.name}</div>
                        <div className="text-[10px] font-mono text-emerald-400">{teacher.empId}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {teacher.subject}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {teacher.assignedClasses.join(', ')}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {teacher.attendanceRate}%
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                        teacher.attendanceStatus === 'present' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                        teacher.attendanceStatus === 'on_duty' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' :
                        teacher.attendanceStatus === 'leave' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      }`}>
                        {teacher.attendanceStatus || 'present'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => markTeacherAttendance(teacher.id, 'present')}
                        className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold transition-colors"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => markTeacherAttendance(teacher.id, 'on_duty')}
                        className="px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[11px] font-bold transition-colors"
                      >
                        On Duty
                      </button>
                      <button
                        onClick={() => markTeacherAttendance(teacher.id, 'leave')}
                        className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[11px] font-bold transition-colors"
                      >
                        Leave
                      </button>
                      <button
                        onClick={() => markTeacherAttendance(teacher.id, 'absent')}
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

      {/* SUB-VIEW 3: TEACHER SALARY & PAYROLL */}
      {activeSubTab === 'payroll' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Monthly Faculty Payroll & Salary Ledger
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                October 2026 Salary Cycle · Authorized by Superintendent Directorate
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDisburseAll}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <DollarSign className="w-4 h-4" />
                Disburse All Pending Salaries
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Faculty Member</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4 font-mono">Monthly Scale</th>
                  <th className="py-3 px-4">Salary Status</th>
                  <th className="py-3 px-4">Last Disbursal Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {teachers.map(teacher => (
                  <tr key={teacher.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img 
                        src={teacher.avatar} 
                        alt={teacher.name} 
                        className="w-9 h-9 rounded-xl bg-slate-950 p-0.5 border border-slate-800"
                      />
                      <div>
                        <div className="font-bold text-white text-xs">{teacher.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{teacher.empId}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {teacher.designation}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                      ₹{teacher.salary.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                        teacher.salaryStatus === 'paid' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {teacher.salaryStatus === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {teacher.salaryStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {teacher.lastSalaryDate || 'Pending Settlement'}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      {teacher.salaryStatus === 'pending' ? (
                        <button
                          onClick={() => disburseTeacherSalary(teacher.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
                        >
                          Disburse Salary
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedPayslipTeacher(teacher)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1 inline-flex"
                        >
                          <FileText className="w-3.5 h-3.5 text-cyan-400" />
                          View Payslip
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

      {/* SUB-VIEW 4: RFID ID CARDS */}
      {activeSubTab === 'idcard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-5 space-y-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Select Teacher for ID Card
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                RFID FACULTY BADGE
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Select from Faculty Staff:
              </label>
              <select
                value={selectedTeacherForCard.id}
                onChange={e => {
                  const found = teachers.find(t => t.id === e.target.value);
                  if (found) setSelectedTeacherForCard(found);
                }}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.empId} · {t.subject})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Teacher Brief */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Faculty Name:</span>
                <span className="text-white font-bold">{selectedTeacherForCard.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Employee ID:</span>
                <span className="font-mono text-emerald-400 font-bold">{selectedTeacherForCard.empId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Designation:</span>
                <span className="text-slate-200">{selectedTeacherForCard.designation}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Qualification:</span>
                <span className="text-slate-300">{selectedTeacherForCard.qualification}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Experience:</span>
                <span className="text-emerald-400 font-semibold">{selectedTeacherForCard.experience}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Salary Status:</span>
                <span className="text-white font-mono font-bold">₹{selectedTeacherForCard.salary.toLocaleString('en-IN')}/mo ({selectedTeacherForCard.salaryStatus.toUpperCase()})</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Encrypted contactless RFID chip for faculty lounge entry</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Authorized examination invigilator credentials</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col items-center p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="text-xs font-mono text-slate-400 mb-4 tracking-wider uppercase">
              Official Faculty Smart Identity Card Preview
            </div>

            <IdCardRenderer
              data={{
                type: 'teacher',
                id: selectedTeacherForCard.id,
                code: selectedTeacherForCard.empId,
                name: selectedTeacherForCard.name,
                roleOrGrade: selectedTeacherForCard.designation,
                departmentOrHouse: `Dept: ${selectedTeacherForCard.subject} · ${selectedTeacherForCard.qualification}`,
                phone: selectedTeacherForCard.phone,
                email: selectedTeacherForCard.email,
                avatar: selectedTeacherForCard.avatar,
                bloodGroup: selectedTeacherForCard.bloodGroup,
                validThrough: 'Valid Through 2027',
                zoneOrRoll: `ID: ${selectedTeacherForCard.empId}`,
              }}
              onPrint={() => {
                showToast(`Printing Faculty ID Card for ${selectedTeacherForCard.name}...`);
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

      {/* SUB-VIEW 5: FACULTY ROSTER CARDS */}
      {activeSubTab === 'roster' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search teacher by name, subject, or designation..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setActiveSubTab('add')}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Onboard Teacher
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTeachers.map(teacher => (
              <div
                key={teacher.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-4 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 p-0.5 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                        <img 
                          src={teacher.avatar} 
                          alt={teacher.name} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {teacher.name}
                        </h4>
                        <div className="text-[11px] font-mono text-emerald-400">
                          {teacher.empId}
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {teacher.experience}
                    </span>
                  </div>

                  <div className="mt-3 text-xs font-semibold text-slate-200">
                    {teacher.designation}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-0.5 font-medium">
                    Subject: {teacher.subject}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Classes:</span>
                      <span className="text-slate-200 truncate block">{teacher.assignedClasses.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Monthly Salary:</span>
                      <span className="font-mono font-bold text-white">₹{teacher.salary.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Attendance:</span>
                      <span className="font-mono font-bold text-emerald-400">{teacher.attendanceRate}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Salary Status:</span>
                      <span className={`font-bold uppercase text-[10px] ${teacher.salaryStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {teacher.salaryStatus}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-slate-400 space-y-1">
                    <div className="truncate">Qualification: <strong className="text-slate-300">{teacher.qualification}</strong></div>
                    <div className="truncate">Contact: <strong className="text-slate-300">{teacher.phone}</strong></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedTeacherForCard(teacher);
                      setActiveSubTab('idcard');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    RFID Card
                  </button>

                  <div className="flex items-center gap-1.5">
                    {teacher.salaryStatus === 'pending' ? (
                      <button
                        onClick={() => disburseTeacherSalary(teacher.id)}
                        className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold transition-colors"
                      >
                        Pay Salary
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedPayslipTeacher(teacher)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium transition-colors"
                      >
                        Payslip
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payslip Modal */}
      {selectedPayslipTeacher && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    Official Faculty Payslip
                  </h4>
                  <div className="text-xs text-slate-400">
                    United Global School · October 2026 Disbursal
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPayslipTeacher(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payslip Particulars */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Employee Name:</span>
                <span className="font-bold text-white">{selectedPayslipTeacher.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Employee ID / Designation:</span>
                <span className="font-mono text-emerald-400 font-semibold">{selectedPayslipTeacher.empId} · {selectedPayslipTeacher.designation}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Department:</span>
                <span className="text-slate-200">{selectedPayslipTeacher.subject}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Basic Monthly Pay:</span>
                <span className="font-mono text-white">₹{Math.round(selectedPayslipTeacher.salary * 0.7).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Dearness & Academic Allowance:</span>
                <span className="font-mono text-white">₹{Math.round(selectedPayslipTeacher.salary * 0.2).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">HRA & Research Grant:</span>
                <span className="font-mono text-white">₹{Math.round(selectedPayslipTeacher.salary * 0.1).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold text-emerald-400">
                <span>Net Disbursed Amount:</span>
                <span className="font-mono">₹{selectedPayslipTeacher.salary.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400">Status: <strong className="text-emerald-400">PAID & CLEARED</strong></span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showToast('Printing official faculty payslip voucher...');
                    window.print();
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Payslip Voucher
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
