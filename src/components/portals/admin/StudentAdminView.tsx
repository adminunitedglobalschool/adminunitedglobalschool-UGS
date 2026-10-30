import React, { useState, useRef, useEffect } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { Student } from '../../../types/school';
import { IdCardRenderer } from './IdCardRenderer';
import { PvcSheetPrintView } from './PvcSheetPrintView';
import { StudentPhotoUpload } from './StudentPhotoUpload';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  UserPlus, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Printer, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Filter,
  X,
  FileText,
  Layers,
  LayoutGrid,
  List,
  Edit3,
  Pencil,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  Receipt,
  FileCheck,
  Award
} from 'lucide-react';
import { StudentFeeCollector } from './StudentFeeCollector';
import { AdmitCardManager } from './AdmitCardManager';
import { ExamResultManager } from './ExamResultManager';

interface StudentAdminViewProps {
  initialSubTab?: 'directory' | 'collect-fee' | 'admit-card' | 'results' | 'add' | 'idcard' | 'pvc-sheet';
}

export const StudentAdminView: React.FC<StudentAdminViewProps> = ({ initialSubTab = 'directory' }) => {
  const { 
    students, 
    registerNewStudent, 
    updateStudent, 
    markAttendance, 
    recordPayment, 
    openReceiptModal, 
    showToast 
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'collect-fee' | 'admit-card' | 'results' | 'add' | 'idcard' | 'pvc-sheet'>(initialSubTab);
  const [targetStudentId, setTargetStudentId] = useState<string | undefined>(undefined);
  const [selectedStudentForCard, setSelectedStudentForCard] = useState<Student>(students[0]);

  // Sync if initialSubTab changes from parent
  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [feeFilter, setFeeFilter] = useState('All');
  const [directoryViewMode, setDirectoryViewMode] = useState<'list' | 'grid'>('list');

  // New Student Form State (with Adm No support)
  const [formData, setFormData] = useState({
    admissionNo: '',
    name: '',
    guardianName: '',
    phone: '',
    email: '',
    grade: 'Class 10',
    section: 'A',
    rollNo: '',
    dob: '2010-05-15',
    address: 'Bhakatgaon, Rupahi Town, Nagaon, Assam',
    bloodGroup: 'B+',
    house: 'Emerald' as 'Emerald' | 'Ruby' | 'Sapphire' | 'Topaz',
    mentorTeacher: 'Teacher XYZ 01',
    totalFee: 42000,
  });

  const [studentPhoto, setStudentPhoto] = useState<string | null>(null);
  const [photoSizeKb, setPhotoSizeKb] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Student State
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Student>>({});

  // Top Horizontal Scroll Synchronization
  const topScrollRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const [tableScrollWidth, setTableScrollWidth] = useState(1400);

  const handleTopScroll = () => {
    if (topScrollRef.current && tableScrollRef.current) {
      tableScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    }
  };

  const handleTableScroll = () => {
    if (topScrollRef.current && tableScrollRef.current) {
      topScrollRef.current.scrollLeft = tableScrollRef.current.scrollLeft;
    }
  };

  const scrollHorizontally = (delta: number) => {
    if (tableScrollRef.current) {
      tableScrollRef.current.scrollBy({ left: delta, behavior: 'smooth' });
    }
    if (topScrollRef.current) {
      topScrollRef.current.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const updateWidth = () => {
      if (tableScrollRef.current) {
        setTableScrollWidth(tableScrollRef.current.scrollWidth);
      }
    };
    updateWidth();
    const t = setTimeout(updateWidth, 120);
    window.addEventListener('resize', updateWidth);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', updateWidth);
    };
  }, [students, directoryViewMode]);

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setEditFormData({
      name: student.name,
      admissionNo: student.admissionNo,
      guardianName: student.guardianName,
      phone: student.phone,
      email: student.email,
      grade: student.grade,
      section: student.section,
      rollNo: student.rollNo,
      house: student.house,
      bloodGroup: student.bloodGroup,
      dob: student.dob,
      address: student.address,
      mentorTeacher: student.mentorTeacher,
      totalFee: student.totalFee,
      paidFee: student.paidFee,
      attendanceRate: student.attendanceRate,
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateStudent(editingStudent.id, editFormData);
    if (selectedStudentForCard?.id === editingStudent.id) {
      setSelectedStudentForCard({
        ...selectedStudentForCard,
        ...editFormData,
      } as Student);
    }
    setEditingStudent(null);
  };

  // Quick Fee Payment in Student View
  const [payingStudent, setPayingStudent] = useState<Student | null>(null);
  const [payAmount, setPayAmount] = useState<number>(10000);
  const [payMethod, setPayMethod] = useState<'UPI' | 'Credit/Debit Card' | 'Net Banking' | 'Cash'>('UPI');

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.guardianName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter === 'All' || s.grade === gradeFilter;
    const matchesFee = feeFilter === 'All' || s.feeStatus === feeFilter;
    return matchesSearch && matchesGrade && matchesFee;
  });

  const gradesList = ['All', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.guardianName.trim() || !formData.phone.trim()) {
      showToast('Please fill in required student name, guardian and contact phone.');
      return;
    }

    setIsSubmitting(true);
    const newStudent = registerNewStudent({
      admissionNo: formData.admissionNo.trim() || undefined,
      name: formData.name,
      guardianName: formData.guardianName,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@unitedglobalschool.edu.in`,
      grade: formData.grade,
      section: formData.section,
      rollNo: formData.rollNo ? parseInt(formData.rollNo) : students.length + 1,
      dob: formData.dob,
      address: formData.address,
      bloodGroup: formData.bloodGroup,
      house: formData.house,
      mentorTeacher: formData.mentorTeacher,
      totalFee: Number(formData.totalFee) || 42000,
      paidFee: 0,
      pendingFee: Number(formData.totalFee) || 42000,
      feeStatus: 'pending',
      attendanceRate: 100,
      avatar: studentPhoto || undefined,
    });

    setIsSubmitting(false);
    setSelectedStudentForCard(newStudent);
    setStudentPhoto(null);
    setPhotoSizeKb(null);
    setFormData({
      admissionNo: '',
      name: '',
      guardianName: '',
      phone: '',
      email: '',
      grade: 'Class 10',
      section: 'A',
      rollNo: '',
      dob: '2010-05-15',
      address: 'Bhakatgaon, Rupahi Town, Nagaon, Assam',
      bloodGroup: 'B+',
      house: 'Emerald',
      mentorTeacher: 'Teacher XYZ 01',
      totalFee: 42000,
    });
    setActiveSubTab('idcard');
    showToast(`Student ${newStudent.name} enrolled (Adm No: ${newStudent.admissionNo})! ID Card opened.`);
  };

  const handleQuickPaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingStudent) return;

    const txn = recordPayment({
      studentId: payingStudent.id,
      studentName: payingStudent.name,
      admissionNo: payingStudent.admissionNo,
      grade: payingStudent.grade,
      section: payingStudent.section,
      amount: Number(payAmount),
      date: '2026-10-10',
      paymentMethod: payMethod,
      transactionRef: `ADM/FEE/${Date.now().toString().slice(-6)}`,
      term: 'Quarter 3',
      breakdown: {
        tuitionFee: Math.round(payAmount * 0.65),
        stemLabFee: Math.round(payAmount * 0.15),
        sportsActivityFee: Math.round(payAmount * 0.1),
        developmentFee: Math.round(payAmount * 0.1),
        transportFee: 0,
      },
      status: 'completed',
      collectedBy: 'Admin Directorate',
    });

    setPayingStudent(null);
    openReceiptModal(txn);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Sub-Navigation Switchers */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* 1. Students Directory */}
          <button
            onClick={() => {
              setActiveSubTab('directory');
              setTargetStudentId(undefined);
            }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'directory'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          Students Directory ({students.length})
        </button>

        {/* 2. UNIQUE COLLECT FEES BUTTON */}
        <button
          onClick={() => setActiveSubTab('collect-fee')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeSubTab === 'collect-fee'
              ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white font-bold shadow-md shadow-indigo-600/30 ring-1 ring-indigo-300'
              : 'bg-slate-950 border border-indigo-500/40 text-indigo-300 hover:text-white hover:border-indigo-400'
          }`}
        >
          <Receipt className="w-4 h-4 text-indigo-400" />
          <span>Collect Fees</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-mono">
            Counter
          </span>
        </button>

        {/* 3. UNIQUE ADMIT CARD BUTTON */}
        <button
          onClick={() => setActiveSubTab('admit-card')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeSubTab === 'admit-card'
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30 ring-1 ring-cyan-200'
              : 'bg-slate-950 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400'
          }`}
        >
          <FileCheck className="w-4 h-4 text-cyan-400" />
          <span>Admit Card</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-mono">
            Hall Ticket
          </span>
        </button>

        {/* 4. UNIQUE EXAM RESULT BUTTON */}
        <button
          onClick={() => setActiveSubTab('results')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeSubTab === 'results'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold shadow-md shadow-amber-500/30 ring-1 ring-amber-200'
              : 'bg-slate-950 border border-amber-500/40 text-amber-300 hover:text-white hover:border-amber-400'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Result</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono">
            CBSE Marksheet
          </span>
        </button>

        {/* 5. Add New Student */}
        <button
          onClick={() => setActiveSubTab('add')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeSubTab === 'add'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Add Student
        </button>

        {/* 6. Smart ID Cards */}
        <button
          onClick={() => setActiveSubTab('idcard')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeSubTab === 'idcard'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Smart ID Cards
        </button>

        {/* 7. 9-PVC Sheet Print */}
        <button
          onClick={() => setActiveSubTab('pvc-sheet')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeSubTab === 'pvc-sheet'
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'bg-slate-950 border border-cyan-500/40 text-cyan-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          9-PVC Print
        </button>
      </div>
    </div>

      {/* SUB-VIEW 1: ADD NEW STUDENT */}
      {activeSubTab === 'add' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-cyan-400" />
                Enroll & Register New Student
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Onboards student into Central UGS Database, provisions roll record, and generates biometric identity card
              </p>
            </div>
            <button
              onClick={() => setActiveSubTab('directory')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel & View Directory
            </button>
          </div>

          <form onSubmit={handleEnrollSubmit} className="space-y-6">
            
            {/* 1. Student Passport Photo Upload & Live Camera Capture (< 20 KB) */}
            <StudentPhotoUpload
              photo={studentPhoto}
              onPhotoChange={(newPhoto, sizeKb) => {
                setStudentPhoto(newPhoto);
                setPhotoSizeKb(sizeKb);
              }}
              maxSizeKb={20}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Admission No (Adm No)</span>
                  <span className="text-[10px] text-cyan-400 font-mono font-normal">Auto-generated if blank</span>
                </label>
                <input
                  type="text"
                  placeholder={`e.g. UGS/2026/${101 + students.length}`}
                  value={formData.admissionNo}
                  onChange={e => setFormData({ ...formData, admissionNo: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Full Student Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Student ABC 01"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Guardian / Father's Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Guardian ABC 01"
                  value={formData.guardianName}
                  onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Primary Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 94350 XXXXX"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Student / Guardian Email
                </label>
                <input
                  type="email"
                  placeholder="student@unitedglobalschool.edu.in"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Grade Wing *
                </label>
                <select
                  value={formData.grade}
                  onChange={e => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  {gradesList.filter(g => g !== 'All').map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Section & Roll No
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={formData.section}
                    onChange={e => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="A">Sec A</option>
                    <option value="B">Sec B</option>
                    <option value="C">Sec C</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Roll No"
                    value={formData.rollNo}
                    onChange={e => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Blood Group & House
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={formData.bloodGroup}
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <select
                    value={formData.house}
                    onChange={e => setFormData({ ...formData, house: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Emerald">Emerald (Green)</option>
                    <option value="Ruby">Ruby (Red)</option>
                    <option value="Sapphire">Sapphire (Blue)</option>
                    <option value="Topaz">Topaz (Gold)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Assigned Mentor Faculty
                </label>
                <input
                  type="text"
                  value={formData.mentorTeacher}
                  onChange={e => setFormData({ ...formData, mentorTeacher: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Residential Address (Bhakatgaon / Rupahi Vicinity)
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Annual Tuition & Lab Fee (₹)
                </label>
                <input
                  type="number"
                  value={formData.totalFee}
                  onChange={e => setFormData({ ...formData, totalFee: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>

            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveSubTab('directory')}
                className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Register Student & Generate Smart ID
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-VIEW 2: ID CARD GENERATOR */}
      {activeSubTab === 'idcard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Student Selector & Data Highlights */}
          <div className="lg:col-span-5 space-y-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Select Student for ID Card
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">
                CR80 HOLOGRAPHIC
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Select from Enrolled Students:
              </label>
              <select
                value={selectedStudentForCard.id}
                onChange={e => {
                  const found = students.find(s => s.id === e.target.value);
                  if (found) setSelectedStudentForCard(found);
                }}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.admissionNo} · {s.grade} - {s.section})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Student Telemetry Brief */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Student Name:</span>
                <span className="text-white font-bold">{selectedStudentForCard.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Admission No:</span>
                <span className="font-mono text-cyan-400 font-bold">{selectedStudentForCard.admissionNo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Class & Section:</span>
                <span className="text-slate-200">{selectedStudentForCard.grade} ({selectedStudentForCard.section}) · Roll {selectedStudentForCard.rollNo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">House Assigned:</span>
                <span className="font-semibold text-emerald-400">House {selectedStudentForCard.house}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Attendance Telemetry:</span>
                <span className="font-mono text-white font-bold">{selectedStudentForCard.attendanceRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Fee Status:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  selectedStudentForCard.feeStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {selectedStudentForCard.feeStatus}
                </span>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Compatible with school biometric gate scanners</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Barcoded for automated central library checkouts</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>GPS fleet boarding tap-in verified</span>
              </div>
            </div>
          </div>

          {/* Right Column: Holographic ID Card Preview */}
          <div className="lg:col-span-7 flex flex-col items-center p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="text-xs font-mono text-slate-400 mb-4 tracking-wider uppercase">
              Official United Global School Identity Badge
            </div>
            
            <IdCardRenderer
              data={{
                type: 'student',
                id: selectedStudentForCard.id,
                code: selectedStudentForCard.admissionNo,
                name: selectedStudentForCard.name,
                roleOrGrade: `${selectedStudentForCard.grade} (Sec ${selectedStudentForCard.section})`,
                departmentOrHouse: `House ${selectedStudentForCard.house} · Mentor: ${selectedStudentForCard.mentorTeacher}`,
                phone: selectedStudentForCard.phone,
                email: selectedStudentForCard.email,
                avatar: selectedStudentForCard.avatar,
                bloodGroup: selectedStudentForCard.bloodGroup,
                validThrough: 'Session 2026–2027',
                zoneOrRoll: `Roll No: ${selectedStudentForCard.rollNo}`,
              }}
              onPrint={() => {
                showToast(`Printing Smart ID Card for ${selectedStudentForCard.name}...`);
                window.print();
              }}
              onOpenBatchA4={() => setActiveSubTab('pvc-sheet')}
            />
          </div>

        </div>
      )}

      {/* SUB-VIEW 4: 9-PVC CARD A4 SHEET PRINT STUDIO */}
      {activeSubTab === 'pvc-sheet' && (
        <PvcSheetPrintView />
      )}

      {/* SUB-VIEW 5: COLLECT FEES & DIGITAL PAYMENT COUNTER */}
      {activeSubTab === 'collect-fee' && (
        <StudentFeeCollector initialStudentId={targetStudentId} />
      )}

      {/* SUB-VIEW 6: ADMIT CARD & HALL TICKET GENERATOR */}
      {activeSubTab === 'admit-card' && (
        <AdmitCardManager initialStudentId={targetStudentId} />
      )}

      {/* SUB-VIEW 7: EXAMINATION RESULT & MARKSHEET DIRECTORATE */}
      {activeSubTab === 'results' && (
        <ExamResultManager initialStudentId={targetStudentId} />
      )}

      {/* SUB-VIEW 3: DIRECTORY OF ALL STUDENTS */}
      {activeSubTab === 'directory' && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student name, admission no, or guardian..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <span>Grade:</span>
              </div>
              <select
                value={gradeFilter}
                onChange={e => setGradeFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
              >
                {gradesList.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 ml-2">
                <span>Fee:</span>
              </div>
              <select
                value={feeFilter}
                onChange={e => setFeeFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="overdue">Overdue</option>
              </select>

              {/* View Switcher: Table View (Single Line) vs Cards Grid */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 ml-auto sm:ml-2">
                <button
                  type="button"
                  onClick={() => setDirectoryViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    directoryViewMode === 'list'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Futuristic Multicolor Table (Single Line Per Student)"
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Table View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDirectoryViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    directoryViewMode === 'grid'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Cards Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid View</span>
                </button>
              </div>
            </div>
          </div>

          {/* Conditional Rendering: Empty State, Futuristic Multicolor Table, or Cards Grid */}
          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">No Students Found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No enrolled student matches the current search query or grade/fee filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setGradeFilter('All');
                  setFeeFilter('All');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 font-semibold transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : directoryViewMode === 'list' ? (
            /* FUTURISTIC MULTICOLOR TABLE VIEW (Details in 1 single line with full header) */
            <div className="rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 shadow-2xl overflow-hidden animate-in fade-in duration-200">
              
              {/* Table Top Telemetry Strip */}
              <div className="px-5 py-3.5 bg-slate-950/90 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                    Central Student Telemetry Matrix
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {filteredStudents.length} Active Records
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-emerald-400">Green</span>: Emerald / Paid
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span className="text-rose-400">Red</span>: Ruby / Overdue
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-blue-400">Blue</span>: Sapphire
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-amber-400">Gold</span>: Topaz / Pending
                  </span>
                </div>
              </div>

              {/* Top Horizontal Scrollbar & Left-Right Move Controls */}
              <div className="bg-slate-950/95 px-5 py-2.5 border-b border-cyan-500/20 flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 font-bold shrink-0">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Top Scroll:</span>
                </div>
                
                {/* Synchronized Top Horizontal Scrollbar */}
                <div 
                  ref={topScrollRef}
                  onScroll={handleTopScroll}
                  className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-cyan-500/60 scrollbar-track-slate-900 py-1"
                >
                  <div style={{ width: `${tableScrollWidth}px`, height: '6px' }} />
                </div>

                {/* Left-Right Quick Move Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button 
                    type="button"
                    onClick={() => scrollHorizontally(-280)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/60 text-[11px] font-mono text-cyan-300 font-semibold transition-all flex items-center gap-1"
                    title="Scroll Table Left"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Move Left</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => scrollHorizontally(280)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/60 text-[11px] font-mono text-cyan-300 font-semibold transition-all flex items-center gap-1"
                    title="Scroll Table Right"
                  >
                    <span>Move Right</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Responsive Horizontal Scroll Container */}
              <div 
                ref={tableScrollRef}
                onScroll={handleTableScroll}
                className="overflow-x-auto scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-slate-950"
              >
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-cyan-500/20 text-[11px] font-mono uppercase tracking-wider text-slate-300">
                      <th className="py-3.5 px-4 font-bold text-slate-400">#</th>
                      <th className="py-3.5 px-4 font-bold text-cyan-400">Student & Adm No</th>
                      <th className="py-3.5 px-3 font-bold text-emerald-400">Class & Sec</th>
                      <th className="py-3.5 px-3 font-bold text-amber-400">Roll No</th>
                      <th className="py-3.5 px-3 font-bold text-purple-400">House</th>
                      <th className="py-3.5 px-3 font-bold text-sky-400">Attendance</th>
                      <th className="py-3.5 px-4 font-bold text-slate-300">Guardian & Contact</th>
                      <th className="py-3.5 px-3 font-bold text-fuchsia-400">Fee Status</th>
                      <th className="py-3.5 px-4 font-bold text-amber-300 text-right">Pending Due</th>
                      <th className="py-3.5 px-4 font-bold text-cyan-400 text-center">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {filteredStudents.map((student, idx) => {
                      const houseColor = 
                        student.house === 'Emerald' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                        student.house === 'Ruby' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                        student.house === 'Sapphire' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                        'bg-amber-500/20 text-amber-300 border-amber-500/40';

                      const attColor = 
                        student.attendanceRate >= 90 ? 'text-emerald-400' :
                        student.attendanceRate >= 75 ? 'text-cyan-400' :
                        'text-rose-400';

                      const attBarColor = 
                        student.attendanceRate >= 90 ? 'bg-emerald-400' :
                        student.attendanceRate >= 75 ? 'bg-cyan-400' :
                        'bg-rose-400';

                      return (
                        <tr 
                          key={student.id} 
                          className="hover:bg-gradient-to-r hover:from-cyan-950/30 hover:via-slate-800/40 hover:to-indigo-950/30 transition-colors group"
                        >
                          {/* 1. Index */}
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                            {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                          </td>

                          {/* 2. Photo + Name + Adm No */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-cyan-500/40 p-0.5 overflow-hidden shrink-0 shadow-md group-hover:border-cyan-400 transition-colors">
                                <img 
                                  src={student.avatar} 
                                  alt={student.name} 
                                  className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-200"
                                />
                              </div>
                              <div>
                                <div className="font-bold text-white text-xs group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                                  <span>{student.name}</span>
                                  {student.bloodGroup && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                                      {student.bloodGroup}
                                    </span>
                                  )}
                                </div>
                                <div className="mt-0.5 flex items-center gap-1.5">
                                  <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-1.5 py-0.5 rounded">
                                    {student.admissionNo}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 3. Class & Section */}
                          <td className="py-3.5 px-3">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold font-mono text-[11px] shadow-sm">
                              {student.grade} ({student.section})
                            </span>
                          </td>

                          {/* 4. Roll No */}
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono font-bold text-[11px] shadow-sm">
                              #{student.rollNo}
                            </span>
                          </td>

                          {/* 5. House (Multicolor) */}
                          <td className="py-3.5 px-3">
                            <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 w-fit ${houseColor} shadow-sm`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              House {student.house}
                            </span>
                          </td>

                          {/* 6. Attendance with Micro Meter */}
                          <td className="py-3.5 px-3">
                            <div className="space-y-1">
                              <span className={`font-mono font-bold text-xs ${attColor}`}>
                                {student.attendanceRate}%
                              </span>
                              <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${attBarColor} transition-all duration-300`} 
                                  style={{ width: `${Math.min(100, student.attendanceRate)}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* 7. Guardian & Contact Phone */}
                          <td className="py-3.5 px-4">
                            <div>
                              <div className="font-medium text-slate-200 text-xs">
                                {student.guardianName}
                              </div>
                              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3 text-cyan-400" />
                                <span>{student.phone}</span>
                              </div>
                            </div>
                          </td>

                          {/* 8. Fee Status (Neon Badge) */}
                          <td className="py-3.5 px-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 w-fit ${
                              student.feeStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
                              student.feeStatus === 'partial' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.2)]' :
                              student.feeStatus === 'overdue' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]' :
                              'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                student.feeStatus === 'paid' ? 'bg-emerald-400' :
                                student.feeStatus === 'partial' ? 'bg-blue-400' :
                                student.feeStatus === 'overdue' ? 'bg-rose-400 animate-ping' :
                                'bg-amber-400'
                              }`} />
                              {student.feeStatus}
                            </span>
                          </td>

                          {/* 9. Pending Due */}
                          <td className="py-3.5 px-4 text-right">
                            {student.pendingFee === 0 ? (
                              <span className="font-mono text-emerald-400 font-bold text-xs">
                                ₹0 (Cleared)
                              </span>
                            ) : (
                              <span className="font-mono text-amber-300 font-bold text-xs">
                                ₹{student.pendingFee.toLocaleString('en-IN')}
                              </span>
                            )}
                          </td>

                          {/* 10. Quick Actions */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Edit Student Profile */}
                              <button
                                onClick={() => handleOpenEdit(student)}
                                className="px-2.5 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-600 border border-purple-500/40 text-purple-300 hover:text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-sm"
                                title="Edit Student Details"
                              >
                                <Edit3 className="w-3 h-3 text-purple-400 group-hover:text-white" />
                                <span>Edit</span>
                              </button>

                              {/* Collect Fee */}
                              <button
                                onClick={() => {
                                  setTargetStudentId(student.id);
                                  setActiveSubTab('collect-fee');
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-300 hover:text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-sm"
                                title="Collect Student Fee & Issue Receipt"
                              >
                                <Receipt className="w-3 h-3 text-indigo-400 group-hover:text-white" />
                                <span>Collect Fee</span>
                              </button>

                              {/* Admit Card */}
                              <button
                                onClick={() => {
                                  setTargetStudentId(student.id);
                                  setActiveSubTab('admit-card');
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500 border border-cyan-500/40 text-cyan-300 hover:text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-all shadow-sm"
                                title="Generate Examination Hall Ticket / Admit Card"
                              >
                                <FileCheck className="w-3 h-3 text-cyan-400 group-hover:text-slate-950" />
                                <span>Admit Card</span>
                              </button>

                              {/* Result & Marksheet */}
                              <button
                                onClick={() => {
                                  setTargetStudentId(student.id);
                                  setActiveSubTab('results');
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-400 border border-amber-500/40 text-amber-300 hover:text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-all shadow-sm"
                                title="View & Edit CBSE Examination Result / Marksheet"
                              >
                                <Award className="w-3 h-3 text-amber-400 group-hover:text-slate-950" />
                                <span>Result</span>
                              </button>

                              {/* Smart ID Card */}
                              <button
                                onClick={() => {
                                  setSelectedStudentForCard(student);
                                  setActiveSubTab('idcard');
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-sm"
                                title="View & Print Smart ID Card"
                              >
                                <Sparkles className="w-3 h-3 text-cyan-400" />
                                <span>ID Card</span>
                              </button>

                              {/* Present / Absent */}
                              <button
                                onClick={() => markAttendance(student.id, 'present')}
                                className="px-2 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/30 text-[10px] font-bold transition-all"
                                title="Mark Present Today"
                              >
                                Present
                              </button>
                              <button
                                onClick={() => markAttendance(student.id, 'absent')}
                                className="px-2 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 text-[10px] font-bold transition-all"
                                title="Mark Absent Today"
                              >
                                Absent
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Summary */}
              <div className="px-5 py-3 bg-slate-950/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400">
                <div className="font-mono text-[11px]">
                  Displaying {filteredStudents.length} of {students.length} Total Enrolled Students
                </div>
                <div className="flex items-center gap-4 font-mono text-[11px]">
                  <span>Paid: <strong className="text-emerald-400">{filteredStudents.filter(s => s.feeStatus === 'paid').length}</strong></span>
                  <span>Pending: <strong className="text-amber-400">{filteredStudents.filter(s => s.feeStatus === 'pending' || s.feeStatus === 'partial').length}</strong></span>
                  <span>Avg Attendance: <strong className="text-cyan-400">{(filteredStudents.reduce((acc, s) => acc + s.attendanceRate, 0) / (filteredStudents.length || 1)).toFixed(1)}%</strong></span>
                </div>
              </div>

            </div>
          ) : (
            /* Students Registry Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredStudents.map(student => (
                <div
                  key={student.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4 shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    {/* Top card banner */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 p-0.5 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                          <img 
                            src={student.avatar} 
                            alt={student.name} 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {student.name}
                          </h4>
                          <div className="text-[11px] font-mono text-cyan-400">
                            {student.admissionNo}
                          </div>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        student.feeStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        student.feeStatus === 'partial' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        student.feeStatus === 'overdue' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {student.feeStatus}
                      </span>
                    </div>

                    {/* Student Details Grid */}
                    <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Grade & Sec:</span>
                        <span className="text-slate-200 font-semibold">{student.grade} - {student.section} (Roll #{student.rollNo})</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">House:</span>
                        <span className="text-emerald-400 font-semibold">{student.house}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Attendance:</span>
                        <span className="font-mono font-bold text-white">{student.attendanceRate}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Pending Due:</span>
                        <span className="font-mono font-bold text-amber-400">₹{student.pendingFee.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="mt-3 text-[11px] text-slate-400 space-y-1">
                      <div className="truncate">Guardian: <strong className="text-slate-300">{student.guardianName}</strong></div>
                      <div className="truncate">Contact: <strong className="text-slate-300">{student.phone}</strong></div>
                    </div>
                  </div>

                  {/* Bottom Card Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(student)}
                        className="px-2.5 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        title="Edit Student Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setTargetStudentId(student.id);
                          setActiveSubTab('collect-fee');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        title="Digital Fee Counter"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        Fee
                      </button>

                      <button
                        onClick={() => {
                          setTargetStudentId(student.id);
                          setActiveSubTab('admit-card');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        title="Admit Card & Hall Ticket"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        Admit
                      </button>

                      <button
                        onClick={() => {
                          setTargetStudentId(student.id);
                          setActiveSubTab('results');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        title="CBSE Result & Marksheet"
                      >
                        <Award className="w-3.5 h-3.5" />
                        Result
                      </button>

                      <button
                        onClick={() => {
                          setSelectedStudentForCard(student);
                          setActiveSubTab('idcard');
                        }}
                        className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        title="ID Card"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        ID
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => markAttendance(student.id, 'present')}
                        className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold transition-colors"
                        title="Quick mark present"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => markAttendance(student.id, 'absent')}
                        className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold transition-colors"
                        title="Quick mark absent"
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Quick Collect Fee Modal */}
      {payingStudent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  Collect Student Fee
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {payingStudent.name} ({payingStudent.admissionNo} · {payingStudent.grade})
                </p>
              </div>
              <button
                onClick={() => setPayingStudent(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickPaySubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  max={payingStudent.pendingFee}
                  min={100}
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:border-cyan-400 focus:outline-none"
                />
                <div className="text-[11px] text-slate-400 mt-1">
                  Remaining dues before payment: ₹{payingStudent.pendingFee.toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">
                  Payment Method
                </label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="UPI">UPI / QR Code</option>
                  <option value="Credit/Debit Card">Credit/Debit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cash">Cash at Admin Counter</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPayingStudent(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 text-slate-400 text-xs hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                >
                  Record Payment & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STUDENT DETAILS MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-purple-500/40 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/30">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    Edit Student Profile: {editingStudent.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    Admission No: {editingStudent.admissionNo} · {editingStudent.grade} ({editingStudent.section})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name || ''}
                    onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>

                {/* Admission No */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Admission No (Adm No) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.admissionNo || ''}
                    onChange={e => setEditFormData({ ...editFormData, admissionNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-purple-400 focus:outline-none"
                  />
                </div>

                {/* Guardian Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Guardian / Father's Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.guardianName || ''}
                    onChange={e => setEditFormData({ ...editFormData, guardianName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editFormData.phone || ''}
                    onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>

                {/* Grade Wing */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Class / Grade Wing
                  </label>
                  <select
                    value={editFormData.grade || 'Class 10'}
                    onChange={e => setEditFormData({ ...editFormData, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
                  >
                    {gradesList.filter(g => g !== 'All').map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                {/* Section & Roll No */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Section
                    </label>
                    <select
                      value={editFormData.section || 'A'}
                      onChange={e => setEditFormData({ ...editFormData, section: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
                    >
                      <option value="A">Sec A</option>
                      <option value="B">Sec B</option>
                      <option value="C">Sec C</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Roll No
                    </label>
                    <input
                      type="number"
                      value={editFormData.rollNo ?? ''}
                      onChange={e => setEditFormData({ ...editFormData, rollNo: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* House */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Assigned House
                  </label>
                  <select
                    value={editFormData.house || 'Emerald'}
                    onChange={e => setEditFormData({ ...editFormData, house: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value="Emerald">House Emerald (Green)</option>
                    <option value="Ruby">House Ruby (Red)</option>
                    <option value="Sapphire">House Sapphire (Blue)</option>
                    <option value="Topaz">House Topaz (Gold)</option>
                  </select>
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={editFormData.bloodGroup || 'B+'}
                    onChange={e => setEditFormData({ ...editFormData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                {/* Total Fee & Paid Fee */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Total Annual Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={editFormData.totalFee ?? 0}
                    onChange={e => setEditFormData({ ...editFormData, totalFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Paid Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={editFormData.paidFee ?? 0}
                    onChange={e => setEditFormData({ ...editFormData, paidFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none font-mono"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">
                    Pending Dues: ₹{Math.max(0, (editFormData.totalFee ?? 0) - (editFormData.paidFee ?? 0)).toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Attendance Rate */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Attendance Rate (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={editFormData.attendanceRate ?? 100}
                    onChange={e => setEditFormData({ ...editFormData, attendanceRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none font-mono"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editFormData.email || ''}
                    onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={editFormData.address || ''}
                  onChange={e => setEditFormData({ ...editFormData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-950 text-slate-400 text-xs hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Updated Details</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
