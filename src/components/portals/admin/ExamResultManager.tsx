import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { Student, StudentResult, SubjectMark } from '../../../types/school';
import { 
  Award, 
  Search, 
  Printer, 
  Download, 
  Sparkles, 
  Edit3, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  BookOpen, 
  ShieldCheck, 
  Star, 
  Layers, 
  SlidersHorizontal,
  ChevronRight,
  GraduationCap,
  X
} from 'lucide-react';

interface ExamResultManagerProps {
  initialStudentId?: string;
}

export const ExamResultManager: React.FC<ExamResultManagerProps> = ({ initialStudentId }) => {
  const { students, showToast } = useSchool();

  const [activeView, setActiveView] = useState<'marksheet' | 'ledger'>('marksheet');
  const [selectedExam, setSelectedExam] = useState('CBSE Annual Evaluation 2026');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Default marks generator based on student roll & attendance
  const generateInitialResults = (): Record<string, StudentResult> => {
    const resultsMap: Record<string, StudentResult> = {};
    
    students.forEach((s, idx) => {
      // Deterministic baseline marks scaled by attendance and seed
      const basePerformance = Math.min(96, Math.max(72, Math.round(s.attendanceRate * 0.95) - (idx % 4) * 3));
      
      const subjects: SubjectMark[] = [
        { subject: 'English Language & Lit', subjectCode: '184', theoryMarks: Math.min(80, Math.round(basePerformance * 0.78)), practicalMarks: 19, maxMarks: 100, grade: 'A1', gradePoint: 10 },
        { subject: 'Mathematics (Standard)', subjectCode: '041', theoryMarks: Math.min(80, Math.round(basePerformance * 0.82) - 2), practicalMarks: 20, maxMarks: 100, grade: 'A1', gradePoint: 10 },
        { subject: 'Science & Robotics', subjectCode: '086', theoryMarks: Math.min(80, Math.round(basePerformance * 0.79)), practicalMarks: 19, maxMarks: 100, grade: 'A1', gradePoint: 10 },
        { subject: 'Social Science & Heritage', subjectCode: '087', theoryMarks: Math.min(80, Math.round(basePerformance * 0.76)), practicalMarks: 18, maxMarks: 100, grade: 'A2', gradePoint: 9 },
        { subject: 'Hindi Course-A / Assamese', subjectCode: '002', theoryMarks: Math.min(80, Math.round(basePerformance * 0.77)), practicalMarks: 19, maxMarks: 100, grade: 'A1', gradePoint: 10 },
        { subject: 'Information Tech & AI', subjectCode: '402', theoryMarks: 48, practicalMarks: 49, maxMarks: 100, grade: 'A1', gradePoint: 10 },
      ];

      const totalObtained = subjects.slice(0, 5).reduce((acc, sub) => acc + (sub.theoryMarks + sub.practicalMarks), 0);
      const totalMax = 500;
      const percentage = +(totalObtained / 5).toFixed(1);
      const overallGrade = percentage >= 90 ? 'A1' : percentage >= 80 ? 'A2' : percentage >= 70 ? 'B1' : 'B2';
      const cgpa = +(percentage / 9.5).toFixed(1);

      resultsMap[s.id] = {
        id: `res-${s.id}-2026`,
        studentId: s.id,
        studentName: s.name,
        admissionNo: s.admissionNo,
        grade: s.grade,
        section: s.section,
        rollNo: s.rollNo,
        examTitle: 'CBSE Annual Evaluation 2026',
        academicYear: '2026-27',
        term: 'Final Board Term',
        subjects,
        totalObtained,
        totalMax,
        percentage,
        overallGrade,
        cgpa,
        rank: idx + 1,
        resultStatus: percentage >= 85 ? 'Passed with Distinction' : 'Passed',
        teacherRemarks: 'Exemplary intellectual acumen and active dedication to STEM and holistic school activities.',
        attendancePct: s.attendanceRate,
        issueDate: '2026-10-10',
      };
    });

    return resultsMap;
  };

  const [studentResults, setStudentResults] = useState<Record<string, StudentResult>>(() => {
    const saved = localStorage.getItem('ugs_student_results');
    return saved ? JSON.parse(saved) : generateInitialResults();
  });

  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    if (initialStudentId && students.some(s => s.id === initialStudentId)) {
      return initialStudentId;
    }
    return students[0]?.id || '';
  });

  // Edit Marks Modal State
  const [editingResult, setEditingResult] = useState<StudentResult | null>(null);

  const selectedResult = studentResults[selectedStudentId] || studentResults[students[0]?.id];
  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.rollNo.toString().includes(searchQuery);
    const matchesGrade = selectedGrade === 'All' || s.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSaveMarks = (updatedResult: StudentResult) => {
    const totalObtained = updatedResult.subjects.slice(0, 5).reduce((acc, sub) => acc + (sub.theoryMarks + sub.practicalMarks), 0);
    const percentage = +(totalObtained / 5).toFixed(1);
    const overallGrade = percentage >= 90 ? 'A1' : percentage >= 80 ? 'A2' : percentage >= 70 ? 'B1' : 'B2';
    const cgpa = +(percentage / 9.5).toFixed(1);

    const finalized: StudentResult = {
      ...updatedResult,
      totalObtained,
      percentage,
      overallGrade,
      cgpa,
      resultStatus: percentage >= 85 ? 'Passed with Distinction' : 'Passed',
    };

    const newMap = { ...studentResults, [finalized.studentId]: finalized };
    setStudentResults(newMap);
    localStorage.setItem('ugs_student_results', JSON.stringify(newMap));
    setEditingResult(null);
    showToast(`Examination marks updated successfully for ${finalized.studentName}!`);
  };

  // Class KPI Metrics
  const resultList = Object.values(studentResults);
  const avgPercentage = resultList.length ? +(resultList.reduce((acc, r) => acc + r.percentage, 0) / resultList.length).toFixed(1) : 0;
  const distinctionsCount = resultList.filter(r => r.resultStatus === 'Passed with Distinction').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Directorate Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveView('marksheet')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeView === 'marksheet'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              CBSE Official Marksheet
            </button>

            <button
              onClick={() => setActiveView('ledger')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeView === 'ledger'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Class Results Roster & Edit Marks
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-transform"
            >
              <Printer className="w-4 h-4" />
              Print Marksheet (PDF)
            </button>
          </div>
        </div>

        {/* Filters Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Examination Evaluation
            </label>
            <select
              value={selectedExam}
              onChange={e => setSelectedExam(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
            >
              <option value="CBSE Annual Evaluation 2026">CBSE Annual Evaluation 2026</option>
              <option value="Half-Yearly Summative 2026">Half-Yearly Summative 2026</option>
              <option value="Quarterly STEM & Academic Review">Quarterly STEM & Academic Review</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Filter Grade
            </label>
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
            >
              {['All', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Search Student
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Pass Percentage</span>
              <span className="text-sm font-bold font-mono text-emerald-400">100% Passed</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase block">Distinctions</span>
              <span className="text-sm font-bold font-mono text-amber-300">{distinctionsCount} Students</span>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: OFFICIAL HOLOGRAPHIC MARKSHEET */}
      {activeView === 'marksheet' && selectedResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Student Selector Sidebar (4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Select Candidate
              </span>
              <span className="text-xs text-slate-400">
                {filteredStudents.length} Students
              </span>
            </div>

            <div className="max-h-[580px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredStudents.map(student => {
                const res = studentResults[student.id];
                const isSelected = selectedStudentId === student.id;
                return (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`p-3 rounded-2xl cursor-pointer border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500 shadow-md shadow-amber-500/10'
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
                        <div className="text-xs font-bold text-white truncate">
                          {student.name}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-amber-300">Roll #{student.rollNo}</span>
                          <span>·</span>
                          <span>{student.grade}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-emerald-400 block">
                        {res ? `${res.percentage}%` : 'N/A'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Grade {res?.overallGrade || 'A1'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Official CBSE Marksheet Container (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* The Printable Official CBSE Marksheet */}
            <div className="bg-white text-slate-950 rounded-3xl p-6 sm:p-9 shadow-2xl border-4 border-double border-slate-400 relative overflow-hidden print:p-0 print:border-none print:shadow-none print:rounded-none">
              
              {/* Holographic Border Header Accent */}
              <div className="h-2 w-full bg-gradient-to-r from-blue-700 via-amber-500 to-indigo-700 rounded-t-sm -mt-6 sm:-mt-9 -mx-6 sm:-mx-9 mb-6" />

              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none text-[75px] font-black uppercase text-slate-950 tracking-widest rotate-[-30deg]">
                UNITED GLOBAL SCHOOL
              </div>

              {/* School Header */}
              <div className="border-b-2 border-slate-900 pb-5 text-center relative z-10">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <div className="w-12 h-12 rounded-xl bg-blue-900 text-white font-black text-xl flex items-center justify-center shadow-md">
                    UGS
                  </div>
                  <div className="text-left">
                    <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-950 uppercase tracking-tight leading-none">
                      United Global School
                    </h1>
                    <p className="text-xs text-slate-600 font-semibold mt-1">
                      Bhakatgaon, Rupahi Town, Nagaon District, Assam – 782125
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold text-slate-700 border-t border-slate-200 pt-2 mt-2">
                  <span>CBSE Affiliation Code: <strong>UGS-AS-2026-89</strong></span>
                  <span>·</span>
                  <span>School U-DISE Code: <strong>18100508901</strong></span>
                  <span>·</span>
                  <span>Academic Session: <strong>2026-2027</strong></span>
                </div>

                {/* Document Type Badge */}
                <div className="mt-3 inline-block px-4 py-1 bg-amber-500/10 border-2 border-amber-600 text-slate-900 rounded-lg text-xs font-black uppercase tracking-wider">
                  CBSE Academic Performance Marksheet & Continuous Evaluation Record
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">
                  {selectedExam}
                </div>
              </div>

              {/* Student Identification Dossier */}
              <div className="py-4 border-b border-slate-300 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center text-xs relative z-10">
                <div className="sm:col-span-3 flex flex-col items-center text-center">
                  <div className="w-24 h-28 border-2 border-slate-900 p-0.5 bg-slate-100 rounded shadow-sm overflow-hidden flex items-center justify-center">
                    <img
                      src={selectedStudent.avatar}
                      alt={selectedStudent.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1 font-bold">
                    OFFICIAL STUDENT RECORD
                  </span>
                </div>

                <div className="sm:col-span-9 grid grid-cols-2 gap-y-2 gap-x-4">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Student Name</span>
                    <span className="text-sm font-black text-slate-950 uppercase">{selectedStudent.name}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Board Roll Number</span>
                    <span className="text-sm font-mono font-black text-blue-900">
                      {selectedStudent.rollNo.toString().padStart(6, '26000')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Admission No</span>
                    <span className="text-xs font-mono font-bold text-slate-800">{selectedStudent.admissionNo}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Class & Section</span>
                    <span className="text-xs font-bold text-slate-900">{selectedStudent.grade} - Section {selectedStudent.section}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Father's / Guardian's Name</span>
                    <span className="text-xs font-bold text-slate-900">{selectedStudent.guardianName}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Academic Attendance</span>
                    <span className="text-xs font-bold text-emerald-800">{selectedStudent.attendanceRate}% Present</span>
                  </div>
                </div>
              </div>

              {/* Scholastic Assessment Marks Table */}
              <div className="py-4 space-y-2 relative z-10">
                <div className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center justify-between">
                  <span>Part 1: Scholastic Academic Assessment</span>
                  <span className="text-[10px] font-normal text-slate-500">Max Marks per subject: 100</span>
                </div>

                <div className="border-2 border-slate-900 rounded overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold text-[11px]">
                        <th className="py-2 px-3">Sub Code</th>
                        <th className="py-2 px-3">Subject Name</th>
                        <th className="py-2 px-3 text-center">Theory (80)</th>
                        <th className="py-2 px-3 text-center">IA / Practical (20)</th>
                        <th className="py-2 px-3 text-center">Total (100)</th>
                        <th className="py-2 px-3 text-center">CBSE Grade</th>
                        <th className="py-2 px-3 text-center">Grade Point</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300">
                      {selectedResult.subjects.map(item => {
                        const total = item.theoryMarks + item.practicalMarks;
                        return (
                          <tr key={item.subjectCode} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-mono font-bold text-slate-900">{item.subjectCode}</td>
                            <td className="py-2 px-3 font-bold text-slate-950">{item.subject}</td>
                            <td className="py-2 px-3 text-center font-mono font-semibold">{item.theoryMarks}</td>
                            <td className="py-2 px-3 text-center font-mono font-semibold">{item.practicalMarks}</td>
                            <td className="py-2 px-3 text-center font-mono font-bold text-blue-900">{total}</td>
                            <td className="py-2 px-3 text-center font-bold text-slate-900">{item.grade}</td>
                            <td className="py-2 px-3 text-center font-mono text-slate-800">{item.gradePoint}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100 font-bold border-t-2 border-slate-900 text-slate-950">
                        <td colSpan={4} className="py-2.5 px-3 uppercase text-right">
                          Grand Aggregate Total (Main 5 Subjects):
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-sm text-blue-900">
                          {selectedResult.totalObtained} / {selectedResult.totalMax}
                        </td>
                        <td className="py-2.5 px-3 text-center text-emerald-800 font-black">
                          {selectedResult.percentage}%
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-purple-900 font-black">
                          CGPA: {selectedResult.cgpa}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Result Summary Bar & Co-Scholastic Assessment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 border-y border-slate-300 relative z-10 text-xs">
                
                {/* Result Verdict Box */}
                <div className="p-3 bg-slate-50 rounded border border-slate-300 space-y-1.5">
                  <div className="font-bold text-slate-800 uppercase text-[10px]">
                    Final Academic Standing:
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-emerald-800 uppercase">
                      {selectedResult.resultStatus}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono font-black text-xs">
                      {selectedResult.overallGrade}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Division: <strong>First Division (Distinction)</strong> · Class Rank: <strong>#{selectedResult.rank}</strong>
                  </div>
                </div>

                {/* Co-Scholastic Holistic Rating */}
                <div className="p-3 bg-slate-50 rounded border border-slate-300 space-y-1">
                  <div className="font-bold text-slate-800 uppercase text-[10px]">
                    Part 2: Holistic & Co-Scholastic Evaluation:
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-700">
                      <span>STEM & Robotics:</span>
                      <strong className="text-blue-900">A+</strong>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Physical Athletics:</span>
                      <strong className="text-blue-900">A+</strong>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Civic & Discipline:</span>
                      <strong className="text-blue-900">A</strong>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Arts & Culture:</span>
                      <strong className="text-blue-900">A</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Teacher Remarks & Official Signatures */}
              <div className="pt-4 space-y-4 relative z-10">
                <div className="text-xs text-slate-800">
                  <span className="font-bold uppercase text-[10px] text-slate-600 block">Class Mentor Evaluation:</span>
                  <p className="italic mt-0.5 text-slate-800">
                    "{selectedResult.teacherRemarks}"
                  </p>
                </div>

                <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-3 gap-4 text-center items-end text-xs">
                  <div>
                    <div className="h-10 border-b border-slate-800 flex items-end justify-center pb-1">
                      <span className="font-serif italic text-slate-700 font-bold text-sm">
                        {selectedStudent.mentorTeacher}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-600 uppercase font-bold block mt-1">
                      Class Teacher
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-blue-900 flex items-center justify-center p-1 text-[8px] font-bold text-blue-900 uppercase text-center leading-tight">
                      UGS CENTRAL SEAL
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 mt-1">
                      DATE: {selectedResult.issueDate}
                    </span>
                  </div>

                  <div>
                    <div className="h-10 border-b border-slate-800 flex items-end justify-center pb-1">
                      <span className="font-serif text-blue-900 font-bold text-sm tracking-wide">
                        Director of Academics
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-600 uppercase font-bold block mt-1">
                      Principal / Examination Head
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* Quick Actions Control Strip */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">
                Official marksheet ready for candidate: <strong className="text-white">{selectedStudent.name}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingResult(selectedResult)}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  Edit Marks
                </button>

                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print Marksheet
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: CLASS RESULTS ROSTER & MARKS MANAGEMENT */}
      {activeView === 'ledger' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-400" />
                Comprehensive Class Results Roster & Score Ledger
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect subject-wise theory & practical performance across students and modify marks directly
              </p>
            </div>

            <div className="text-xs font-semibold text-slate-400">
              {filteredStudents.length} Students Listed
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] bg-slate-950/60">
                  <th className="py-3 px-4 font-semibold">Roll</th>
                  <th className="py-3 px-4 font-semibold">Candidate</th>
                  <th className="py-3 px-4 font-semibold">Adm No</th>
                  <th className="py-3 px-4 font-semibold">Class</th>
                  <th className="py-3 px-4 font-semibold text-center">English</th>
                  <th className="py-3 px-4 font-semibold text-center">Maths</th>
                  <th className="py-3 px-4 font-semibold text-center">Science</th>
                  <th className="py-3 px-4 font-semibold text-center">Social</th>
                  <th className="py-3 px-4 font-semibold text-center">MIL</th>
                  <th className="py-3 px-4 font-semibold text-center">Total / 500</th>
                  <th className="py-3 px-4 font-semibold text-center">Percentage</th>
                  <th className="py-3 px-4 font-semibold text-center">Grade</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.map(student => {
                  const res = studentResults[student.id];
                  if (!res) return null;

                  return (
                    <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-300">
                        #{student.rollNo}
                      </td>
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <img src={student.avatar} alt={student.name} className="w-7 h-7 rounded-lg object-cover" />
                        <span>{student.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {student.admissionNo}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {student.grade} ({student.section})
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        {res.subjects[0]?.theoryMarks + res.subjects[0]?.practicalMarks}
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        {res.subjects[1]?.theoryMarks + res.subjects[1]?.practicalMarks}
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        {res.subjects[2]?.theoryMarks + res.subjects[2]?.practicalMarks}
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        {res.subjects[3]?.theoryMarks + res.subjects[3]?.practicalMarks}
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        {res.subjects[4]?.theoryMarks + res.subjects[4]?.practicalMarks}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-blue-400">
                        {res.totalObtained}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">
                        {res.percentage}%
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-white">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                          {res.overallGrade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedStudentId(student.id);
                            setActiveView('marksheet');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition-colors"
                        >
                          Marksheet
                        </button>
                        <button
                          onClick={() => setEditingResult(res)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT MARKS MODAL */}
      {editingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-display text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-400" />
                  Modify Examination Marks
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Candidate: <strong className="text-white">{editingResult.studentName}</strong> ({editingResult.admissionNo}) · Roll #{editingResult.rollNo}
                </p>
              </div>
              <button
                onClick={() => setEditingResult(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Subject-wise Theory & Practical Marks
              </div>

              {editingResult.subjects.map((sub, idx) => (
                <div key={sub.subjectCode} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-bold text-white text-xs block truncate">{sub.subject}</span>
                    <span className="text-[10px] font-mono text-slate-500">Code: {sub.subjectCode}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div>
                      <label className="text-[10px] text-slate-400 block">Theory (Max 80)</label>
                      <input
                        type="number"
                        min="0"
                        max="80"
                        value={sub.theoryMarks}
                        onChange={e => {
                          const val = Math.min(80, Math.max(0, parseInt(e.target.value) || 0));
                          const newSubjects = [...editingResult.subjects];
                          newSubjects[idx] = { ...sub, theoryMarks: val };
                          setEditingResult({ ...editingResult, subjects: newSubjects });
                        }}
                        className="w-20 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block">IA / Prac (Max 20)</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={sub.practicalMarks}
                        onChange={e => {
                          const val = Math.min(20, Math.max(0, parseInt(e.target.value) || 0));
                          const newSubjects = [...editingResult.subjects];
                          newSubjects[idx] = { ...sub, practicalMarks: val };
                          setEditingResult({ ...editingResult, subjects: newSubjects });
                        }}
                        className="w-20 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                      />
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Total</span>
                      <span className="text-xs font-mono font-bold text-amber-300">
                        {sub.theoryMarks + sub.practicalMarks} / 100
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-300">
                  Mentor Assessment Remarks
                </label>
                <textarea
                  rows={2}
                  value={editingResult.teacherRemarks}
                  onChange={e => setEditingResult({ ...editingResult, teacherRemarks: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingResult(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveMarks(editingResult)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20"
              >
                Save Marks & Update Marksheet
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
