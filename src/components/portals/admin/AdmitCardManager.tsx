import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { Student, ExamSession, ExamScheduleItem } from '../../../types/school';
import { 
  FileCheck, 
  Search, 
  Printer, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  MapPin, 
  QrCode, 
  UserCheck, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  Building2, 
  FileText,
  BadgeAlert
} from 'lucide-react';

interface AdmitCardManagerProps {
  initialStudentId?: string;
}

export const AdmitCardManager: React.FC<AdmitCardManagerProps> = ({ initialStudentId }) => {
  const { students, showToast } = useSchool();

  const [selectedStudent, setSelectedStudent] = useState<Student>(() => {
    if (initialStudentId) {
      const match = students.find(s => s.id === initialStudentId);
      if (match) return match;
    }
    return students[0];
  });

  const [selectedExamTitle, setSelectedExamTitle] = useState('CBSE Annual Board Examination 2026-27');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'single' | 'batch'>('single');

  // Standard Examination Schedule for the admit card
  const examSchedule: ExamScheduleItem[] = [
    { id: '1', subject: 'English Language & Literature', subjectCode: '184', date: '2026-11-02', day: 'Monday', timing: '09:00 AM - 12:00 PM', hallNumber: 'Aryabhata Hall - 201', maxMarks: 80 },
    { id: '2', subject: 'Mathematics (Standard / Basic)', subjectCode: '041', date: '2026-11-05', day: 'Thursday', timing: '09:00 AM - 12:00 PM', hallNumber: 'Ramanujan Tech Wing - 104', maxMarks: 80 },
    { id: '3', subject: 'Science & Technological Innovations', subjectCode: '086', date: '2026-11-09', day: 'Monday', timing: '09:00 AM - 12:00 PM', hallNumber: 'APJ Abdul Kalam Lab - 302', maxMarks: 80 },
    { id: '4', subject: 'Social Science & Heritage Studies', subjectCode: '087', date: '2026-11-13', day: 'Friday', timing: '09:00 AM - 12:00 PM', hallNumber: 'Aryabhata Hall - 202', maxMarks: 80 },
    { id: '5', subject: 'Hindi Course-A / Assamese MIL', subjectCode: '002', date: '2026-11-17', day: 'Tuesday', timing: '09:00 AM - 12:00 PM', hallNumber: 'Tagore Humanities Centre - 110', maxMarks: 80 },
    { id: '6', subject: 'Information Technology & Artificial Intelligence', subjectCode: '402', date: '2026-11-20', day: 'Friday', timing: '09:00 AM - 11:00 AM', hallNumber: 'Turing Computer Lab - 401', maxMarks: 50 },
  ];

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

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
                Admit Card & Hall Ticket Management Portal
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  CBSE Validated
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate official holographic examination hall tickets, timetables, and candidate verification passes
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'single' ? 'batch' : 'single')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                viewMode === 'batch'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              {viewMode === 'batch' ? 'Switch to Single View' : 'Batch / All Hall Tickets Print'}
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-transform"
            >
              <Printer className="w-4 h-4" />
              Print Admit Card(s)
            </button>
          </div>
        </div>

        {/* Filter & Exam Selector Controls Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Examination Session
            </label>
            <select
              value={selectedExamTitle}
              onChange={e => setSelectedExamTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
            >
              <option value="CBSE Annual Board Examination 2026-27">CBSE Annual Board Examination 2026-27</option>
              <option value="Half-Yearly Summative Assessment 2026">Half-Yearly Summative Assessment 2026</option>
              <option value="Pre-Board Evaluation 2026">Pre-Board Evaluation 2026</option>
              <option value="Periodic Test - Term III">Periodic Test - Term III</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Filter by Class / Grade
            </label>
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
            >
              {['All', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Search Student (Name / Adm No / Roll)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SINGLE ADMIT CARD VIEW */}
      {viewMode === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Student Selector List (4 cols) */}
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
                const isSelected = selectedStudent.id === student.id;
                return (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`p-3 rounded-2xl cursor-pointer border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-500/10'
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
                          <span className="font-mono text-cyan-300">Roll #{student.rollNo}</span>
                          <span>·</span>
                          <span>{student.grade} ({student.section})</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-slate-400">
                        {student.admissionNo}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Futuristic Admit Card Preview (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* The Printable Official Card */}
            <div className="bg-white text-slate-950 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-slate-300 relative overflow-hidden print:p-0 print:border-none print:shadow-none print:rounded-none">
              
              {/* Security Watermark Backdrop */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none text-[80px] font-black uppercase text-slate-950 tracking-widest rotate-[-25deg]">
                UNITED GLOBAL SCHOOL
              </div>

              {/* Institution Header */}
              <div className="border-b-2 border-slate-900 pb-4 text-center relative z-10">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 text-white font-black text-lg flex items-center justify-center shadow">
                    UGS
                  </div>
                  <div className="text-left">
                    <h1 className="text-xl sm:text-2xl font-black font-display text-slate-950 uppercase tracking-tight leading-none">
                      United Global School
                    </h1>
                    <p className="text-[11px] text-slate-600 font-semibold mt-0.5">
                      Bhakatgaon, Rupahi Town, Nagaon District, Assam – 782125
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-semibold text-slate-600 border-t border-slate-200 pt-1.5 mt-2">
                  <span>CBSE Affiliation: <strong>UGS-AS-2026-89</strong></span>
                  <span>·</span>
                  <span>School Code: <strong>39201</strong></span>
                  <span>·</span>
                  <span>U-DISE: <strong>18100508901</strong></span>
                  <span>·</span>
                  <span>Center Code: <strong>AS-NGN-089</strong></span>
                </div>

                {/* Document Title Badge */}
                <div className="mt-3 inline-block px-4 py-1 bg-slate-900 text-white rounded-md text-xs font-black uppercase tracking-wider">
                  Official Examination Admit Card & Hall Ticket
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">
                  {selectedExamTitle}
                </div>
              </div>

              {/* Candidate Info Grid with Biometric Avatar */}
              <div className="py-4 border-b border-slate-300 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center relative z-10 text-xs">
                
                {/* Candidate Photo */}
                <div className="sm:col-span-3 flex flex-col items-center text-center">
                  <div className="w-24 h-28 border-2 border-slate-900 p-0.5 bg-slate-100 rounded shadow-sm overflow-hidden flex items-center justify-center">
                    <img
                      src={selectedStudent.avatar}
                      alt={selectedStudent.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1 font-bold">
                    BIOMETRIC VERIFIED
                  </span>
                </div>

                {/* Candidate Details Fields */}
                <div className="sm:col-span-9 grid grid-cols-2 gap-y-2 gap-x-4">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Candidate Name</span>
                    <span className="text-sm font-black text-slate-950 uppercase">{selectedStudent.name}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Roll Number</span>
                    <span className="text-base font-mono font-black text-blue-900">
                      {selectedStudent.rollNo.toString().padStart(6, '26000')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Admission Number</span>
                    <span className="text-xs font-mono font-bold text-slate-800">{selectedStudent.admissionNo}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Class & Section</span>
                    <span className="text-xs font-bold text-slate-900">{selectedStudent.grade} - Section {selectedStudent.section}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Father / Guardian Name</span>
                    <span className="text-xs font-bold text-slate-900">{selectedStudent.guardianName}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Date of Birth & Blood Group</span>
                    <span className="text-xs font-semibold text-slate-800">{selectedStudent.dob} ({selectedStudent.bloodGroup})</span>
                  </div>

                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Examination Center</span>
                    <span className="text-xs font-bold text-slate-900">
                      UGS Central High-Tech Examination Block, Bhakatgaon, Rupahi Town
                    </span>
                  </div>
                </div>

              </div>

              {/* Subject Examination Datesheet */}
              <div className="py-4 relative z-10 space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center justify-between">
                  <span>Authorized Examination Timetable</span>
                  <span className="text-[10px] font-normal text-slate-500">Reporting Time: 08:30 AM IST</span>
                </div>

                <div className="border border-slate-300 rounded overflow-hidden">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                        <th className="py-1.5 px-2.5">Sub Code</th>
                        <th className="py-1.5 px-2.5">Subject Name</th>
                        <th className="py-1.5 px-2.5">Date & Day</th>
                        <th className="py-1.5 px-2.5">Timing</th>
                        <th className="py-1.5 px-2.5">Room / Hall</th>
                        <th className="py-1.5 px-2.5 text-center">Invigilator Sign</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {examSchedule.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-1.5 px-2.5 font-mono font-bold text-slate-900">{item.subjectCode}</td>
                          <td className="py-1.5 px-2.5 font-bold text-slate-950">{item.subject}</td>
                          <td className="py-1.5 px-2.5 text-slate-700">{item.date} ({item.day})</td>
                          <td className="py-1.5 px-2.5 text-slate-700 font-mono text-[10px]">{item.timing}</td>
                          <td className="py-1.5 px-2.5 text-slate-800 text-[10px]">{item.hallNumber}</td>
                          <td className="py-1.5 px-2.5 text-center">
                            <div className="w-16 h-4 border-b border-dotted border-slate-400 mx-auto" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Candidate Instructions & Code of Conduct */}
              <div className="py-3 border-t border-slate-200 text-[10px] text-slate-600 space-y-1 relative z-10">
                <div className="font-bold text-slate-800 uppercase tracking-wide">
                  Candidate Examination Protocol & Rules:
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  <li>Candidates must be seated inside the examination room 15 minutes before commencement.</li>
                  <li>Possession of smartphones, smart watches, calculators, or unauthorized study material is strictly prohibited.</li>
                  <li>Proper school uniform and holographic smart ID card are mandatory along with this original hall ticket.</li>
                </ul>
              </div>

              {/* Signatures & Barcode Footer */}
              <div className="pt-4 border-t-2 border-slate-900 grid grid-cols-3 gap-4 items-end text-center relative z-10 text-xs">
                <div>
                  <div className="h-10 border-b border-slate-800 flex items-end justify-center pb-1">
                    <span className="font-serif italic font-bold text-slate-700 text-sm">
                      {selectedStudent.name.split(' ')[0]}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-600 uppercase font-bold block mt-1">
                    Candidate Signature
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-28 h-7 bg-slate-900 text-white font-mono text-[9px] flex items-center justify-center tracking-widest font-black rounded-sm">
                    *{selectedStudent.admissionNo.replace('/', '')}*
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">
                    SECURITY CODE: UGS-2026-HT-998
                  </span>
                </div>

                <div>
                  <div className="h-10 border-b border-slate-800 flex items-end justify-center pb-1">
                    <span className="font-serif font-bold text-blue-900 text-sm tracking-wide">
                      Dr. Mukut Sharma
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-600 uppercase font-bold block mt-1">
                    Controller of Examinations
                  </span>
                </div>
              </div>

            </div>

            {/* Quick Actions Control Strip */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">
                Admit card verified for candidate: <strong className="text-white">{selectedStudent.name}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save PDF
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* BATCH ALL STUDENTS ADMIT CARDS PRINT VIEW */}
      {viewMode === 'batch' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 flex items-center justify-between">
            <span>
              Showing printable admit cards for all <strong>{filteredStudents.length}</strong> students in class <strong>{selectedGrade}</strong>.
            </span>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Print All Hall Tickets (Batch)
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {filteredStudents.map((stu, idx) => (
              <div 
                key={stu.id} 
                className="bg-white text-slate-950 rounded-2xl p-6 shadow-xl border border-slate-300 page-break-after-always"
              >
                {/* Compact Batch Card */}
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded bg-blue-900 text-white font-bold text-xs flex items-center justify-center">UGS</span>
                    <div>
                      <div className="text-sm font-black uppercase text-slate-950 leading-tight">United Global School, Bhakatgaon</div>
                      <div className="text-[9px] text-slate-600">CBSE Affiliation: UGS-AS-2026-89 · Hall Ticket: {selectedExamTitle}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-blue-900">Roll #{stu.rollNo}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{stu.admissionNo}</div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-3 items-center text-xs pb-3 border-b">
                  <div className="col-span-2">
                    <img src={stu.avatar} alt={stu.name} className="w-16 h-20 object-cover border p-0.5 rounded" />
                  </div>
                  <div className="col-span-10 grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Candidate Name</span>
                      <strong className="text-sm text-slate-950">{stu.name}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Class & Sec</span>
                      <strong>{stu.grade} ({stu.section})</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Father / Guardian</span>
                      <span>{stu.guardianName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">DOB</span>
                      <span>{stu.dob}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-500 block">Exam Center</span>
                      <span>UGS Examination Hall, Bhakatgaon, Rupahi Town</span>
                    </div>
                  </div>
                </div>

                {/* Compact Schedule */}
                <div className="pt-2 text-[10px] flex justify-between items-center text-slate-600">
                  <span>English (184): 02 Nov · Math (041): 05 Nov · Science (086): 09 Nov · Social (087): 13 Nov · Hindi/Assam: 17 Nov · IT (402): 20 Nov</span>
                  <div className="text-right">
                    <span className="font-serif italic text-blue-900 font-bold">Mukut Sharma</span> (Exam Controller)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
