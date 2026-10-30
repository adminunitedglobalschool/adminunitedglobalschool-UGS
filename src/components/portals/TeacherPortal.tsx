import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  HelpCircle, 
  Calendar, 
  BookOpen, 
  Check, 
  FileText,
  Save,
  Sparkles,
  Award,
  ShieldAlert,
  Lock,
  LogOut,
  User,
  X
} from 'lucide-react';
import { STUDENT_TIMETABLE } from '../../data/initialData';

export const TeacherPortal: React.FC = () => {
  const { 
    students, 
    teachers, 
    attendanceRecords, 
    markAttendance, 
    bulkMarkAttendance, 
    setRole, 
    setPublicPage,
    showToast,
    rolePermissions
  } = useSchool();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    setRole('public');
    setPublicPage('home');
    showToast('Logged out successfully from Teacher Portal.');
  };

  const canMarkAttendance = rolePermissions.teacher.canMarkAttendance;
  const canEditGradebook = rolePermissions.teacher.canEditGradebook;
  const canViewTimetable = rolePermissions.teacher.canViewTimetable;
  const canManageAssignments = rolePermissions.teacher.canManageAssignments;

  const availableTabs: ('attendance' | 'gradebook' | 'timetable' | 'assignments')[] = [];
  if (canMarkAttendance) availableTabs.push('attendance');
  if (canEditGradebook) availableTabs.push('gradebook');
  if (canViewTimetable) availableTabs.push('timetable');
  if (canManageAssignments) availableTabs.push('assignments');

  const [activeTab, setActiveTab] = useState<'attendance' | 'gradebook' | 'timetable' | 'assignments'>(
    availableTabs[0] || 'attendance'
  );

  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [canMarkAttendance, canEditGradebook, canViewTimetable, canManageAssignments]);
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState('2026-10-10');

  // Gradebook state simulation
  const [marksState, setMarksState] = useState<{ [studentId: string]: { physics: number; math: number; stem: number } }>({
    'std-101': { physics: 92, math: 95, stem: 98 },
    'std-102': { physics: 96, math: 98, stem: 94 },
    'std-103': { physics: 68, math: 71, stem: 80 },
    'std-104': { physics: 84, math: 86, stem: 90 },
    'std-105': { physics: 89, math: 88, stem: 87 },
  });

  // Homework state
  const [assignments, setAssignments] = useState([
    {
      id: 'asg-1',
      title: 'Robotics Microcontroller Logic Design',
      subject: 'STEM Robotics',
      deadline: '2026-10-15',
      grade: 'Class 10-A',
      submissions: 16,
      total: 20,
    },
    {
      id: 'asg-2',
      title: 'Electromagnetic Induction Numerical Problem Set',
      subject: 'Physics',
      deadline: '2026-10-14',
      grade: 'Class 10-A',
      submissions: 18,
      total: 20,
    }
  ]);
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgSubject, setNewAsgSubject] = useState('STEM Robotics');
  const [newAsgDeadline, setNewAsgDeadline] = useState('2026-10-18');

  // Filter class students
  const classStudents = students.filter(
    s => s.grade === selectedClass && s.section === selectedSection
  );

  const getStudentStatusForDate = (studentId: string) => {
    const record = attendanceRecords.find(r => r.studentId === studentId && r.date === selectedDate);
    return record?.status || 'present';
  };

  const handleMarkChange = (studentId: string, subject: 'physics' | 'math' | 'stem', value: number) => {
    setMarksState(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { physics: 75, math: 75, stem: 75 }),
        [subject]: Math.min(100, Math.max(0, value)),
      }
    }));
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle.trim()) return;

    setAssignments(prev => [
      {
        id: `asg-${Date.now()}`,
        title: newAsgTitle,
        subject: newAsgSubject,
        deadline: newAsgDeadline,
        grade: `${selectedClass}-${selectedSection}`,
        submissions: 0,
        total: classStudents.length,
      },
      ...prev,
    ]);

    setNewAsgTitle('');
    showToast(`Assignment "${newAsgTitle}" assigned to ${selectedClass}-${selectedSection}!`);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-display text-white">
                Faculty Academic & Attendance Desk
              </h1>
              <span className="text-[11px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                Teacher XYZ 01 (Mentor)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Assigned: Class 10-A, 11-Science · Department of Physics & Robotics
            </p>
          </div>
        </div>

        {/* Profile Icon and Logout Action */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          {/* Profile Button */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-emerald-500/30 hover:border-emerald-400 text-slate-200 hover:text-white transition-all shadow-sm cursor-pointer group"
              title="View Teacher Profile"
            >
              <div className="relative">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <User className="w-4 h-4" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight">Teacher XYZ 01</div>
                <div className="text-[10px] text-emerald-400 font-medium leading-tight">Physics & STEM Faculty</div>
              </div>
            </button>

            {/* Profile Dropdown / Card */}
            {isProfileOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      XYZ
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Teacher XYZ 01</div>
                      <div className="text-xs text-emerald-400">Senior Faculty & Mentor</div>
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
                    <span className="text-slate-400">Employee ID:</span>
                    <span className="text-slate-200 font-mono">FAC-UGS-2026-08</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Department:</span>
                    <span className="text-emerald-400 font-semibold">Physics & Applied Robotics</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Assigned Classes:</span>
                    <span className="text-slate-200 font-medium">Class 10-A, 11-Science</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Institutional Email:</span>
                    <span className="text-slate-200 font-mono">teacher.xyz01@unitedglobalschool.edu.in</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Portal Clearance:</span>
                    <span className="text-emerald-400 font-semibold">Attendance & Gradebook Verified</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Photo & Profile:</span>
                    <span className="text-amber-300 font-medium flex items-center gap-1 text-[11px]">
                      <Lock className="w-3 h-3 text-amber-400" />
                      Locked by Super Admin
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 hover:text-rose-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out of Teacher Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dedicated Log Out Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 text-rose-300 hover:text-white text-xs font-semibold transition-all shadow-sm cursor-pointer active:scale-95"
            title="Log out of Teacher Portal"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Enforced by Admin Permissions) */}
      {availableTabs.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-rose-500/40 text-center space-y-4 shadow-2xl animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-display text-white">
              Faculty Access Restricted by School Administration
            </h2>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Your permissions for Attendance, Gradebook, Timetable, and Homework have been locked in the Central Roles & Permissions Matrix. Contact the Administrator or Principal to update your operational clearance.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {canMarkAttendance && (
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'attendance'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Daily Roll Call & Attendance</span>
            </button>
          )}

          {canEditGradebook && (
            <button
              onClick={() => setActiveTab('gradebook')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'gradebook'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Continuous Evaluation Gradebook</span>
            </button>
          )}

          {canViewTimetable && (
            <button
              onClick={() => setActiveTab('timetable')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'timetable'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Class Timetable</span>
            </button>
          )}

          {canManageAssignments && (
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'assignments'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Homework & Project Deadlines</span>
            </button>
          )}
        </div>
      )}

      {/* TAB 1: ATTENDANCE TRACKER */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          
          {/* Controls bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Grade</label>
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  <option value="Class 10">Class 10</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 11">Class 11</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Section</label>
                <select
                  value={selectedSection}
                  onChange={e => setSelectedSection(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>

            {/* Quick Bulk Action */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => bulkMarkAttendance(selectedClass, selectedSection, 'present', selectedDate)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Mark All Present
              </button>

              <button
                onClick={() => showToast(`Roll call for ${selectedClass}-${selectedSection} saved & synchronized to server.`)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                Save Roll Call
              </button>
            </div>
          </div>

          {/* Roll Call Grid */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-3 px-4">Roll</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Admission No</th>
                  <th className="py-3 px-4 text-center">Cumulative Attendance</th>
                  <th className="py-3 px-4 text-right">Attendance Status (Click to Toggle)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {classStudents.map(std => {
                  const status = getStudentStatusForDate(std.id);
                  return (
                    <tr key={std.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                        #{std.rollNo}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {std.name}
                        {std.attendanceRate < 75 && (
                          <span className="ml-2 text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded font-mono">
                            Alert &lt; 75%
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-cyan-400">
                        {std.admissionNo}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono tabular-nums font-bold">
                        <span className={std.attendanceRate < 75 ? 'text-rose-400' : 'text-emerald-400'}>
                          {std.attendanceRate}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
                          <button
                            onClick={() => markAttendance(std.id, 'present', selectedDate)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                              status === 'present'
                                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Present
                          </button>
                          <button
                            onClick={() => markAttendance(std.id, 'absent', selectedDate)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                              status === 'absent'
                                ? 'bg-rose-500 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Absent
                          </button>
                          <button
                            onClick={() => markAttendance(std.id, 'late', selectedDate)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                              status === 'late'
                                ? 'bg-amber-500 text-slate-950 shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            Late
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: GRADEBOOK */}
      {activeTab === 'gradebook' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Continuous Evaluation Marks Sheet (Class 10-A)
              </h3>
              <p className="text-xs text-slate-400">
                Enter formative assessment scores (Out of 100). Changes save immediately.
              </p>
            </div>
            <button
              onClick={() => showToast('Marks sheet committed to school examination database.')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
            >
              Commit Marks
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-3 px-3">Roll</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3 text-center">Physics (100)</th>
                  <th className="py-3 px-3 text-center">Mathematics (100)</th>
                  <th className="py-3 px-3 text-center">STEM Robotics (100)</th>
                  <th className="py-3 px-3 text-right">Aggregate %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {classStudents.map(std => {
                  const marks = marksState[std.id] || { physics: 80, math: 80, stem: 80 };
                  const avg = ((marks.physics + marks.math + marks.stem) / 3).toFixed(1);
                  return (
                    <tr key={std.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-mono font-bold text-slate-400">#{std.rollNo}</td>
                      <td className="py-3 px-3 font-semibold text-white">{std.name}</td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          value={marks.physics}
                          onChange={e => handleMarkChange(std.id, 'physics', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-center rounded bg-slate-950 border border-slate-700 text-cyan-400 font-mono font-bold focus:border-cyan-400 focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          value={marks.math}
                          onChange={e => handleMarkChange(std.id, 'math', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-center rounded bg-slate-950 border border-slate-700 text-cyan-400 font-mono font-bold focus:border-cyan-400 focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          value={marks.stem}
                          onChange={e => handleMarkChange(std.id, 'stem', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-center rounded bg-slate-950 border border-slate-700 text-cyan-400 font-mono font-bold focus:border-cyan-400 focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400 tabular-nums">
                        {avg}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TIMETABLE */}
      {activeTab === 'timetable' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Today's Faculty Schedule (Teacher XYZ 01)
            </h3>
            <p className="text-xs text-slate-400">
              Bhakatgaon Campus Academic Schedule · Morning Shift
            </p>
          </div>

          <div className="space-y-2.5">
            {STUDENT_TIMETABLE.map(item => (
              <div 
                key={item.period}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-bold">
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

      {/* TAB 4: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-base font-bold text-white font-display">
              Active Assignments & Submissions
            </h3>
            
            <div className="space-y-3">
              {assignments.map(asg => (
                <div 
                  key={asg.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-cyan-400 font-semibold">{asg.subject}</span>
                    <span>Deadline: {asg.deadline}</span>
                  </div>
                  <div className="text-sm font-bold text-white">{asg.title}</div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-400">{asg.grade}</span>
                    <span className="text-emerald-400 font-medium">
                      {asg.submissions} of {asg.total} Submitted
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">
              Assign New Homework / Project
            </h3>
            <form onSubmit={handleCreateAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newAsgTitle}
                  onChange={e => setNewAsgTitle(e.target.value)}
                  placeholder="e.g. Build Solar Tracker Algorithm"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Subject</label>
                <input
                  type="text"
                  value={newAsgSubject}
                  onChange={e => setNewAsgSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Submission Deadline</label>
                <input
                  type="date"
                  value={newAsgDeadline}
                  onChange={e => setNewAsgDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                Publish Assignment
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
};
