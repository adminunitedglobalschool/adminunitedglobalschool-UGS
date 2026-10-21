import React, { useState } from 'react';
import { useSchool, DEFAULT_SITE_CONFIG } from '../../context/SchoolContext';
import { Teacher, Student, Announcement, ClassTopper } from '../../types/school';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  GraduationCap, 
  Trophy, 
  Bell, 
  CreditCard, 
  Building2, 
  SlidersHorizontal, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  School, 
  X,
  FileCode,
  ShieldCheck,
  ChevronRight,
  Eye,
  Star,
  Award,
  Zap
} from 'lucide-react';
import { RolePermissionsCustomizer } from './admin/RolePermissionsCustomizer';

export const MasterWebsiteCustomizer: React.FC = () => {
  const { 
    siteConfig, 
    updateSiteConfig, 
    teachers, 
    addTeacher, 
    updateTeacher, 
    deleteTeacher, 
    toppers,
    addTopper,
    updateTopper,
    deleteTopper,
    students, 
    updateStudent, 
    deleteStudent, 
    announcements, 
    addAnnouncement, 
    updateAnnouncement, 
    deleteAnnouncement, 
    resetToDefaults, 
    setRole, 
    showToast 
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'branding' | 'faculty' | 'toppers' | 'notices' | 'students' | 'backup' | 'permissions'>('permissions');

  // Helper for uploading photos from local files
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, onComplete: (base64Url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2.5 * 1024 * 1024) {
      showToast('Image size exceeds 2.5MB. Please choose a smaller photo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onComplete(result);
        showToast('Photo uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Form State for Branding
  const [brandingForm, setBrandingForm] = useState({ ...siteConfig });

  // Faculty Management State
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [teacherFormData, setTeacherFormData] = useState({
    name: '',
    empId: '',
    designation: 'Senior Faculty & TGT',
    subject: 'Mathematics',
    assignedClasses: 'Class 9-A, Class 10-A',
    phone: '+91 94350 12345',
    email: '',
    qualification: 'M.Sc., B.Ed.',
    experience: '6 Years',
    salary: 52000,
    avatar: '',
  });

  // Topper Management State
  const [editingTopper, setEditingTopper] = useState<ClassTopper | null>(null);
  const [isAddingTopper, setIsAddingTopper] = useState(false);
  const [topperFormData, setTopperFormData] = useState({
    name: '',
    admissionNo: '',
    grade: 'Class 10',
    section: 'A',
    scorePercentage: 99.2,
    rankBadge: 'Assam State Rank 1 · Gold Medal',
    stream: 'Science & Robotics Track',
    house: 'Sapphire' as 'Sapphire' | 'Emerald' | 'Ruby' | 'Topaz',
    avatar: '',
    mentor: 'Dr. Mukut Sharma',
    highlights: '100/100 Mathematics Standard, State STEM Olympiad Gold, All-India Academic Medalist',
    boardYear: '2026 Board Exams',
    category: 'Class 10 Distinction' as 'Class 12 Titans' | 'Class 10 Distinction' | 'STEM & Robotics' | 'Junior Prodigy',
  });

  // Notice Management State
  const [editingNotice, setEditingNotice] = useState<Announcement | null>(null);
  const [isAddingNotice, setIsAddingNotice] = useState(false);
  const [noticeFormData, setNoticeFormData] = useState({
    title: '',
    content: '',
    category: 'Notice' as 'Academic' | 'Notice' | 'Sports' | 'Event' | 'Examination',
    targetRole: 'All' as 'All' | 'Teachers' | 'Students' | 'Parents',
    isUrgent: false,
    date: '2026-10-10',
  });

  // JSON Raw Config state
  const [jsonConfigText, setJsonConfigText] = useState(() => JSON.stringify(siteConfig, null, 2));

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig(brandingForm);
    setJsonConfigText(JSON.stringify(brandingForm, null, 2));
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherFormData.name.trim() || !teacherFormData.subject.trim()) {
      showToast('Please fill in teacher name and subject.');
      return;
    }

    const classesArray = teacherFormData.assignedClasses.split(',').map(c => c.trim()).filter(Boolean);

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, {
        name: teacherFormData.name,
        empId: teacherFormData.empId || editingTeacher.empId,
        designation: teacherFormData.designation,
        subject: teacherFormData.subject,
        assignedClasses: classesArray,
        phone: teacherFormData.phone,
        email: teacherFormData.email || editingTeacher.email,
        qualification: teacherFormData.qualification,
        experience: teacherFormData.experience,
        salary: Number(teacherFormData.salary) || 50000,
        avatar: teacherFormData.avatar || editingTeacher.avatar,
      });
      setEditingTeacher(null);
    } else {
      addTeacher({
        name: teacherFormData.name,
        empId: teacherFormData.empId || `UGS-T-0${teachers.length + 30}`,
        designation: teacherFormData.designation,
        subject: teacherFormData.subject,
        assignedClasses: classesArray,
        phone: teacherFormData.phone,
        email: teacherFormData.email || `${teacherFormData.name.toLowerCase().replace(/\s+/g, '.')}@unitedglobalschool.edu.in`,
        qualification: teacherFormData.qualification,
        experience: teacherFormData.experience,
        salary: Number(teacherFormData.salary) || 50000,
        avatar: teacherFormData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${teacherFormData.name}`,
      });
      setIsAddingTeacher(false);
    }

    setTeacherFormData({
      name: '',
      empId: '',
      designation: 'Senior Faculty & TGT',
      subject: 'Mathematics',
      assignedClasses: 'Class 9-A, Class 10-A',
      phone: '+91 94350 12345',
      email: '',
      qualification: 'M.Sc., B.Ed.',
      experience: '6 Years',
      salary: 52000,
      avatar: '',
    });
  };

  const handleOpenEditTeacher = (t: Teacher) => {
    setEditingTeacher(t);
    setTeacherFormData({
      name: t.name,
      empId: t.empId,
      designation: t.designation,
      subject: t.subject,
      assignedClasses: t.assignedClasses.join(', '),
      phone: t.phone,
      email: t.email,
      qualification: t.qualification,
      experience: t.experience,
      salary: t.salary,
      avatar: t.avatar,
    });
    setIsAddingTeacher(true);
  };

  const handleSaveTopper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topperFormData.name.trim()) {
      showToast('Please provide topper student name.');
      return;
    }

    const highlightsArr = topperFormData.highlights.split(',').map(h => h.trim()).filter(Boolean);

    if (editingTopper) {
      updateTopper(editingTopper.id, {
        name: topperFormData.name,
        admissionNo: topperFormData.admissionNo || editingTopper.admissionNo,
        grade: topperFormData.grade,
        section: topperFormData.section,
        scorePercentage: Number(topperFormData.scorePercentage) || 95,
        rankBadge: topperFormData.rankBadge,
        stream: topperFormData.stream,
        house: topperFormData.house,
        avatar: topperFormData.avatar || editingTopper.avatar,
        mentor: topperFormData.mentor,
        highlights: highlightsArr.length > 0 ? highlightsArr : ['Outstanding Academic Honors'],
        boardYear: topperFormData.boardYear,
        category: topperFormData.category,
      });
      setEditingTopper(null);
    } else {
      addTopper({
        name: topperFormData.name,
        admissionNo: topperFormData.admissionNo || `UGS/2026/${Math.floor(100 + Math.random() * 900)}`,
        grade: topperFormData.grade,
        section: topperFormData.section,
        scorePercentage: Number(topperFormData.scorePercentage) || 98.0,
        rankBadge: topperFormData.rankBadge,
        stream: topperFormData.stream,
        house: topperFormData.house,
        avatar: topperFormData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${topperFormData.name}`,
        mentor: topperFormData.mentor,
        highlights: highlightsArr.length > 0 ? highlightsArr : ['Top Honors & Distinction'],
        boardYear: topperFormData.boardYear,
        category: topperFormData.category,
      });
      setIsAddingTopper(false);
    }

    setTopperFormData({
      name: '',
      admissionNo: '',
      grade: 'Class 10',
      section: 'A',
      scorePercentage: 99.2,
      rankBadge: 'Assam State Rank 1 · Gold Medal',
      stream: 'Science & Robotics Track',
      house: 'Sapphire',
      avatar: '',
      mentor: 'Dr. Mukut Sharma',
      highlights: '100/100 Mathematics Standard, State STEM Olympiad Gold, All-India Academic Medalist',
      boardYear: '2026 Board Exams',
      category: 'Class 10 Distinction',
    });
  };

  const handleOpenEditTopper = (t: ClassTopper) => {
    setEditingTopper(t);
    setTopperFormData({
      name: t.name,
      admissionNo: t.admissionNo,
      grade: t.grade,
      section: t.section,
      scorePercentage: t.scorePercentage,
      rankBadge: t.rankBadge,
      stream: t.stream,
      house: t.house,
      avatar: t.avatar,
      mentor: t.mentor,
      highlights: t.highlights.join(', '),
      boardYear: t.boardYear,
      category: t.category,
    });
    setIsAddingTopper(true);
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeFormData.title.trim() || !noticeFormData.content.trim()) {
      showToast('Please provide notice title and message content.');
      return;
    }

    if (editingNotice) {
      updateAnnouncement(editingNotice.id, {
        title: noticeFormData.title,
        content: noticeFormData.content,
        category: noticeFormData.category,
        targetRole: noticeFormData.targetRole,
        isUrgent: noticeFormData.isUrgent,
        date: noticeFormData.date,
      });
      setEditingNotice(null);
    } else {
      addAnnouncement({
        title: noticeFormData.title,
        content: noticeFormData.content,
        category: noticeFormData.category,
        targetRole: noticeFormData.targetRole,
        isUrgent: noticeFormData.isUrgent,
        date: noticeFormData.date,
      });
      setIsAddingNotice(false);
    }

    setNoticeFormData({
      title: '',
      content: '',
      category: 'Notice',
      targetRole: 'All',
      isUrgent: false,
      date: '2026-10-10',
    });
  };

  const handleOpenEditNotice = (a: Announcement) => {
    setEditingNotice(a);
    setNoticeFormData({
      title: a.title,
      content: a.content,
      category: a.category,
      targetRole: a.targetRole,
      isUrgent: Boolean(a.isUrgent),
      date: a.date,
    });
    setIsAddingNotice(true);
  };

  const handleExportJSON = () => {
    const backupData = {
      siteConfig,
      teachers,
      toppers,
      students,
      announcements,
      exportTimestamp: new Date().toISOString(),
      schoolName: siteConfig.schoolName,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UGS_Master_Config_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Master Website configuration downloaded as JSON backup.');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.siteConfig) {
          updateSiteConfig(parsed.siteConfig);
          setBrandingForm(parsed.siteConfig);
        }
        showToast('Successfully restored configuration from JSON file!');
      } catch (err) {
        showToast('Invalid JSON file format. Please check your backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      
      {/* Top Header & Cyber Command Hub */}
      <div className="relative group">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/30 via-blue-600/30 to-purple-600/30 blur-xl opacity-40 group-hover:opacity-60 transition-all duration-700 animate-pulse pointer-events-none" />

        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 animate-cyber-glow shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Cyber Corner HUD Tech Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0">
              <Settings className="w-7 h-7 animate-[spin_12s_linear_infinite]" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
                </span>
                <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-300 font-bold">
                  MASTER CMS & COMPLETE WEBSITE CUSTOMIZER
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white uppercase">
                Central Site Architecture & Customization Console
              </h1>
              <p className="text-xs text-slate-300 max-w-2xl font-normal">
                Direct manual control to edit, upload, modify, and delete everything across United Global School's live public portal, faculty directories, notices, and institutional metadata.
              </p>
            </div>
          </div>

          {/* Quick Hub Navigation & Factory Reset */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setRole('admin')}
              className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/40 hover:bg-purple-600/30 text-purple-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Back to Admin Panel</span>
            </button>

            <button
              onClick={() => setRole('public')}
              className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Preview Live Site</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
              title="Download Full JSON Config"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Config</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all website information, faculty additions, and notices to factory default?')) {
                  resetToDefaults();
                  setBrandingForm({ ...DEFAULT_SITE_CONFIG });
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition-all flex items-center gap-1.5"
              title="Reset to Original Defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Cyber Matrix Layout: Futuristic Sidebar + Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Futuristic Cyber Sidebar */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-5">
            {/* Corner Tech Accents */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-xl pointer-events-none" />
            
            {/* Cyber HUD Brand Pill */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300">
                  CMS Cyber Hub
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[9px] font-mono font-bold">
                ROOT ADMIN
              </span>
            </div>

            {/* Featured Hero Button: ROLES & PERMISSIONS */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold px-1">
                ACCESS & CLEARANCE CONTROL
              </div>
              <button
                onClick={() => setActiveTab('permissions')}
                className={`w-full p-3.5 rounded-2xl text-left transition-all relative overflow-hidden group border ${
                  activeTab === 'permissions'
                    ? 'bg-gradient-to-r from-cyan-500/25 via-blue-600/20 to-purple-600/25 border-cyan-400 text-white shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-1 ring-cyan-300'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    activeTab === 'permissions'
                      ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                      : 'bg-slate-800/80 text-cyan-400 border border-slate-700'
                  }`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>Roles & Permission</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                        RBAC
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                      Set Teacher & Staff view access & operational rights
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Core CMS Navigation Modules */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold px-1">
                WEBSITE CMS DIRECTORIES
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('branding')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
                    activeTab === 'branding'
                      ? 'bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <School className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">School Identity & Content</span>
                </button>

                <button
                  onClick={() => setActiveTab('faculty')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
                    activeTab === 'faculty'
                      ? 'bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">Faculty CMS ({teachers.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('toppers')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
                    activeTab === 'toppers'
                      ? 'bg-amber-400/15 border border-amber-400/40 text-amber-300 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">Class Toppers CMS ({toppers.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('notices')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
                    activeTab === 'notices'
                      ? 'bg-purple-600/15 border border-purple-400/40 text-purple-300 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Bell className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="truncate">Circulars & Notices ({announcements.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('students')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
                    activeTab === 'students'
                      ? 'bg-blue-600/15 border border-blue-400/40 text-blue-300 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="truncate">Students Roster ({students.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('backup')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
                    activeTab === 'backup'
                      ? 'bg-amber-500/15 border border-amber-400/40 text-amber-300 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <FileCode className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">Backup & JSON Sync</span>
                </button>
              </div>
            </div>

            {/* Quick Portal Switch Jump */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold px-1">
                VERIFY LIVE PORTALS
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setRole('teacher')}
                  className="p-2 rounded-xl bg-slate-950 border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-300 font-medium text-center transition-colors text-[11px]"
                >
                  Teacher Portal
                </button>
                <button
                  onClick={() => setRole('staff')}
                  className="p-2 rounded-xl bg-slate-950 border border-amber-500/30 hover:bg-amber-500/10 text-amber-300 font-medium text-center transition-colors text-[11px]"
                >
                  Staff Portal
                </button>
              </div>
            </div>

            {/* Live Firebase Cloud Database Status */}
            <div className="pt-3 border-t border-slate-800">
              <div className="p-3 rounded-2xl bg-slate-950/90 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <div>
                    <div className="text-[11px] font-bold text-white leading-tight">Firebase Firestore</div>
                    <div className="text-[9px] text-emerald-400 font-medium">Real-time sync active</div>
                  </div>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold uppercase tracking-wider">
                  ONLINE
                </span>
              </div>
            </div>

          </div>
        </aside>

        {/* Right Column: Main Customizer Content Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Main Navigation Tabs with Custom Horizontal Scrollbar */}
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3 overflow-x-auto custom-horizontal-scrollbar scroll-smooth">
            
            {/* 0. Roles & Permission Featured Button */}
            <button
              onClick={() => setActiveTab('permissions')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'permissions'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Roles & Permission Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('branding')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'branding'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <School className="w-4 h-4" />
              <span>School Identity & Content</span>
            </button>

            <button
              onClick={() => setActiveTab('faculty')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'faculty'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Faculty & Teachers CMS ({teachers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('toppers')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'toppers'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Class Toppers CMS ({toppers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('notices')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'notices'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Circulars & Notices CMS ({announcements.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'students'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Students Roster CMS ({students.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'backup'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Backup, JSON & Raw Sync</span>
            </button>
          </div>

          {/* TAB 0: ROLES & PERMISSIONS MATRIX */}
          {activeTab === 'permissions' && (
            <RolePermissionsCustomizer />
          )}

      {/* TAB 1: BRANDING & GENERAL WEBSITE CONTENT */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveBranding} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                  <School className="w-5 h-5 text-cyan-400" />
                  Primary Institutional Identity & Public Header
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Changes save directly and update all public pages, headers, footers, and cyber badges immediately.
                </p>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save All Site Content</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  School Name *
                </label>
                <input
                  type="text"
                  required
                  value={brandingForm.schoolName}
                  onChange={e => setBrandingForm({ ...brandingForm, schoolName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Tagline / Town Subtitle *
                </label>
                <input
                  type="text"
                  required
                  value={brandingForm.tagline}
                  onChange={e => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  CBSE Affiliation Code *
                </label>
                <input
                  type="text"
                  required
                  value={brandingForm.affiliationCode}
                  onChange={e => setBrandingForm({ ...brandingForm, affiliationCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  School U-DISE Code *
                </label>
                <input
                  type="text"
                  required
                  value={brandingForm.udiseCode}
                  onChange={e => setBrandingForm({ ...brandingForm, udiseCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Official Email *
                </label>
                <input
                  type="email"
                  required
                  value={brandingForm.email}
                  onChange={e => setBrandingForm({ ...brandingForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Primary Contact Phone *
                </label>
                <input
                  type="text"
                  required
                  value={brandingForm.phone1}
                  onChange={e => setBrandingForm({ ...brandingForm, phone1: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Secondary Contact Phone
                </label>
                <input
                  type="text"
                  value={brandingForm.phone2}
                  onChange={e => setBrandingForm({ ...brandingForm, phone2: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Campus Operating Hours
                </label>
                <input
                  type="text"
                  value={brandingForm.operatingHours}
                  onChange={e => setBrandingForm({ ...brandingForm, operatingHours: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Admission Tagline
                </label>
                <input
                  type="text"
                  value={brandingForm.admissionOpenText}
                  onChange={e => setBrandingForm({ ...brandingForm, admissionOpenText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Full Campus Location Address
                </label>
                <input
                  type="text"
                  value={brandingForm.campusLocation}
                  onChange={e => setBrandingForm({ ...brandingForm, campusLocation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Hero Section Subheading / Mission Narrative
                </label>
                <textarea
                  rows={3}
                  value={brandingForm.heroSubheading}
                  onChange={e => setBrandingForm({ ...brandingForm, heroSubheading: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save All Modifications</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: FACULTY & TEACHERS CMS */}
      {activeTab === 'faculty' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Teachers & Faculty Directorate CMS
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add new faculty members, modify qualifications, update subjects, or remove records.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingTeacher(null);
                  setTeacherFormData({
                    name: '',
                    empId: `UGS-T-0${teachers.length + 30}`,
                    designation: 'Senior Faculty & TGT',
                    subject: 'Mathematics',
                    assignedClasses: 'Class 9-A, Class 10-A',
                    phone: '+91 94350 12345',
                    email: '',
                    qualification: 'M.Sc., B.Ed.',
                    experience: '6 Years',
                    salary: 52000,
                    avatar: '',
                  });
                  setIsAddingTeacher(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Faculty Member</span>
              </button>
            </div>

            {/* Teacher Form Modal */}
            {isAddingTeacher && (
              <form onSubmit={handleSaveTeacher} className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-white">
                    {editingTeacher ? `Edit Faculty: ${editingTeacher.name}` : 'Onboard New Faculty Member'}
                  </h4>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsAddingTeacher(false);
                      setEditingTeacher(null);
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Teacher Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Mukut Sharma"
                      value={teacherFormData.name}
                      onChange={e => setTeacherFormData({ ...teacherFormData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Employee ID</label>
                    <input
                      type="text"
                      placeholder="e.g. UGS-T-014"
                      value={teacherFormData.empId}
                      onChange={e => setTeacherFormData({ ...teacherFormData, empId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-400 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Teaching Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Physics & Advanced Robotics"
                      value={teacherFormData.subject}
                      onChange={e => setTeacherFormData({ ...teacherFormData, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Designation</label>
                    <input
                      type="text"
                      value={teacherFormData.designation}
                      onChange={e => setTeacherFormData({ ...teacherFormData, designation: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Qualification</label>
                    <input
                      type="text"
                      placeholder="e.g. M.Sc., Ph.D., B.Ed."
                      value={teacherFormData.qualification}
                      onChange={e => setTeacherFormData({ ...teacherFormData, qualification: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Experience</label>
                    <input
                      type="text"
                      placeholder="e.g. 10 Years"
                      value={teacherFormData.experience}
                      onChange={e => setTeacherFormData({ ...teacherFormData, experience: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Classes (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. 10-A, 11-Science, 12-Science"
                      value={teacherFormData.assignedClasses}
                      onChange={e => setTeacherFormData({ ...teacherFormData, assignedClasses: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email</label>
                    <input
                      type="email"
                      placeholder="faculty@unitedglobalschool.edu.in"
                      value={teacherFormData.email}
                      onChange={e => setTeacherFormData({ ...teacherFormData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={teacherFormData.phone}
                      onChange={e => setTeacherFormData({ ...teacherFormData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-400 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 pt-3 border-t border-slate-800">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Teacher Profile Photo / Avatar
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                        {teacherFormData.avatar ? (
                          <img src={teacherFormData.avatar} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-6 h-6 text-slate-500" />
                        )}
                      </div>
                      <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-400 text-slate-300 hover:text-white cursor-pointer text-xs font-medium transition-colors">
                        <Upload className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Upload Photo from Computer</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleImageFileUpload(e, (url) => setTeacherFormData(prev => ({ ...prev, avatar: url })))}
                        />
                      </label>
                      <span className="text-[11px] text-slate-500">or enter image URL:</span>
                      <input
                        type="url"
                        placeholder="https://... or data:image/..."
                        value={teacherFormData.avatar}
                        onChange={e => setTeacherFormData({ ...teacherFormData, avatar: e.target.value })}
                        className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingTeacher(false);
                      setEditingTeacher(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                  >
                    {editingTeacher ? 'Update Faculty Member' : 'Confirm & Save Faculty'}
                  </button>
                </div>
              </form>
            )}

            {/* Teachers Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 font-mono uppercase text-slate-400 text-[11px]">
                    <th className="py-3 px-4">Faculty Member</th>
                    <th className="py-3 px-4">Emp ID</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Designation</th>
                    <th className="py-3 px-4">Experience</th>
                    <th className="py-3 px-4">Classes</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {teachers.map(teacher => (
                    <tr key={teacher.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={teacher.avatar} 
                            alt={teacher.name} 
                            className="w-8 h-8 rounded-lg bg-slate-950 p-0.5 border border-slate-700 object-cover"
                          />
                          <div>
                            <div className="font-bold text-white">{teacher.name}</div>
                            <div className="text-[10px] text-slate-400">{teacher.qualification}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-cyan-300">{teacher.empId}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-400">{teacher.subject}</td>
                      <td className="py-3 px-4 text-slate-300">{teacher.designation}</td>
                      <td className="py-3 px-4 text-slate-300">{teacher.experience}</td>
                      <td className="py-3 px-4 text-slate-400">{teacher.assignedClasses.join(', ')}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditTeacher(teacher)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300"
                            title="Edit Faculty Record"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete teacher ${teacher.name}?`)) {
                                deleteTeacher(teacher.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                            title="Delete Faculty"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2B: CLASS TOPPERS & ACADEMIC TITANS CMS */}
      {activeTab === 'toppers' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Class Toppers & Academic Titans Directorate CMS
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Directly manage students featured in the public Class Toppers Gallery. Add board toppers, Olympiad medalists, upload their pictures, edit scores and badges, or delete entries.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingTopper(null);
                  setTopperFormData({
                    name: '',
                    admissionNo: `UGS/2026/${Math.floor(100 + Math.random() * 900)}`,
                    grade: 'Class 10',
                    section: 'A',
                    scorePercentage: 99.2,
                    rankBadge: 'CBSE District Rank 1 · Distinction',
                    stream: 'Science & Robotics Track',
                    house: 'Sapphire',
                    avatar: '',
                    mentor: 'Dr. Mukut Sharma',
                    highlights: '100/100 Mathematics Standard, State STEM Olympiad Gold',
                    boardYear: '2026 Board Exams',
                    category: 'Class 10 Distinction',
                  });
                  setIsAddingTopper(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Class Topper / Titan</span>
              </button>
            </div>

            {/* Topper Add / Edit Modal Form */}
            {isAddingTopper && (
              <form onSubmit={handleSaveTopper} className="p-6 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-5 animate-in fade-in duration-150 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    {editingTopper ? `Edit Academic Titan: ${editingTopper.name}` : 'Induct New Class Topper to Hall of Fame'}
                  </h4>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsAddingTopper(false);
                      setEditingTopper(null);
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvi Hazarika"
                      value={topperFormData.name}
                      onChange={e => setTopperFormData({ ...topperFormData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Admission Number</label>
                    <input
                      type="text"
                      placeholder="e.g. UGS/2023/102"
                      value={topperFormData.admissionNo}
                      onChange={e => setTopperFormData({ ...topperFormData, admissionNo: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Score Percentage (%) *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="70"
                      max="100"
                      required
                      placeholder="99.4"
                      value={topperFormData.scorePercentage}
                      onChange={e => setTopperFormData({ ...topperFormData, scorePercentage: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 focus:outline-none font-bold text-amber-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Class / Grade *</label>
                    <select
                      value={topperFormData.grade}
                      onChange={e => setTopperFormData({ ...topperFormData, grade: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="Class 12">Class 12</option>
                      <option value="Class 11">Class 11</option>
                      <option value="Class 10">Class 10</option>
                      <option value="Class 9">Class 9</option>
                      <option value="Class 8">Class 8</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category Domain *</label>
                    <select
                      value={topperFormData.category}
                      onChange={e => setTopperFormData({ ...topperFormData, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="Class 12 Titans">Class 12 Titans</option>
                      <option value="Class 10 Distinction">Class 10 Distinction</option>
                      <option value="STEM & Robotics">STEM & Robotics</option>
                      <option value="Junior Prodigy">Junior Prodigy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Stream / Track</label>
                    <input
                      type="text"
                      placeholder="e.g. PCM & Computer Science"
                      value={topperFormData.stream}
                      onChange={e => setTopperFormData({ ...topperFormData, stream: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Rank / Distinction Badge *</label>
                    <input
                      type="text"
                      placeholder="e.g. Assam State Rank 1 · Gold Medal"
                      value={topperFormData.rankBadge}
                      onChange={e => setTopperFormData({ ...topperFormData, rankBadge: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Board Year / Term</label>
                    <input
                      type="text"
                      placeholder="e.g. 2026 Board Exams"
                      value={topperFormData.boardYear}
                      onChange={e => setTopperFormData({ ...topperFormData, boardYear: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">School House</label>
                    <select
                      value={topperFormData.house}
                      onChange={e => setTopperFormData({ ...topperFormData, house: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="Sapphire">Sapphire House (Blue)</option>
                      <option value="Emerald">Emerald House (Green)</option>
                      <option value="Ruby">Ruby House (Red)</option>
                      <option value="Topaz">Topaz House (Gold)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Mentor Teacher</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Mukut Sharma"
                      value={topperFormData.mentor}
                      onChange={e => setTopperFormData({ ...topperFormData, mentor: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Key Highlights (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. 100/100 Physics, JEE Advanced 99.98 Percentile, All-India Medalist"
                      value={topperFormData.highlights}
                      onChange={e => setTopperFormData({ ...topperFormData, highlights: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 pt-3 border-t border-slate-800">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Student Photo / Avatar Uploader
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                        {topperFormData.avatar ? (
                          <img src={topperFormData.avatar} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Trophy className="w-7 h-7 text-amber-500/50" />
                        )}
                      </div>
                      <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 hover:text-white cursor-pointer text-xs font-semibold transition-all shadow-sm">
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>Upload Student Photo File</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleImageFileUpload(e, (url) => setTopperFormData(prev => ({ ...prev, avatar: url })))}
                        />
                      </label>
                      <span className="text-[11px] text-slate-500">or enter image URL:</span>
                      <input
                        type="url"
                        placeholder="https://... or data:image/..."
                        value={topperFormData.avatar}
                        onChange={e => setTopperFormData({ ...topperFormData, avatar: e.target.value })}
                        className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingTopper(false);
                      setEditingTopper(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20"
                  >
                    {editingTopper ? 'Update Titan Record' : 'Confirm & Publish Topper'}
                  </button>
                </div>
              </form>
            )}

            {/* Toppers Live Management Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 font-mono uppercase text-slate-400 text-[11px]">
                    <th className="py-3 px-4">Academic Titan</th>
                    <th className="py-3 px-4">Adm No</th>
                    <th className="py-3 px-4">Grade & Stream</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Rank Distinction</th>
                    <th className="py-3 px-4">House</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {toppers.map(topper => (
                    <tr key={topper.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={topper.avatar} 
                            alt={topper.name} 
                            className="w-9 h-9 rounded-xl bg-slate-950 p-0.5 border border-amber-500/30 object-cover shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              {topper.name}
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            </div>
                            <div className="text-[10px] text-slate-400">{topper.boardYear}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-cyan-300">{topper.admissionNo}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{topper.grade}</div>
                        <div className="text-[10px] text-slate-400">{topper.stream}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold font-mono">
                          {topper.scorePercentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-medium">
                          {topper.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-200 font-medium">{topper.rankBadge}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          topper.house === 'Sapphire' ? 'bg-blue-500/20 text-blue-300' :
                          topper.house === 'Emerald' ? 'bg-emerald-500/20 text-emerald-300' :
                          topper.house === 'Ruby' ? 'bg-rose-500/20 text-rose-300' :
                          'bg-amber-500/20 text-amber-300'
                        }`}>
                          {topper.house}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditTopper(topper)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white transition-colors"
                            title="Edit Topper Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Remove titan ${topper.name} from the Class Toppers Hall of Fame?`)) {
                                deleteTopper(topper.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Delete Topper"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CIRCULARS & NOTICES CMS */}
      {activeTab === 'notices' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                  <Bell className="w-5 h-5 text-purple-400" />
                  Broadcast Notices & Circulars CMS
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Publish official notices, urgent circulars, exam dates, or sports events to the live public site.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingNotice(null);
                  setNoticeFormData({
                    title: '',
                    content: '',
                    category: 'Notice',
                    targetRole: 'All',
                    isUrgent: false,
                    date: '2026-10-10',
                  });
                  setIsAddingNotice(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-purple-600/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Circular</span>
              </button>
            </div>

            {/* Notice Form Modal */}
            {isAddingNotice && (
              <form onSubmit={handleSaveNotice} className="p-5 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-white">
                    {editingNotice ? `Edit Notice: ${editingNotice.title}` : 'Draft & Publish New Circular'}
                  </h4>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsAddingNotice(false);
                      setEditingNotice(null);
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Circular Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Schedule for CBSE Periodic Assessment Term-3"
                      value={noticeFormData.title}
                      onChange={e => setNoticeFormData({ ...noticeFormData, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                    <select
                      value={noticeFormData.category}
                      onChange={e => setNoticeFormData({ ...noticeFormData, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-purple-400 focus:outline-none"
                    >
                      <option value="Notice">General Notice</option>
                      <option value="Academic">Academic</option>
                      <option value="Examination">Examination</option>
                      <option value="Sports">Sports</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Notice Content / Instructions *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter full notice announcement details..."
                    value={noticeFormData.content}
                    onChange={e => setNoticeFormData({ ...noticeFormData, content: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={noticeFormData.isUrgent}
                      onChange={e => setNoticeFormData({ ...noticeFormData, isUrgent: e.target.checked })}
                      className="rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span className="text-xs text-amber-300 font-semibold">Flag as URGENT Announcement</span>
                  </label>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNotice(false);
                        setEditingNotice(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                    >
                      {editingNotice ? 'Update Circular' : 'Publish Circular'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Notices List */}
            <div className="space-y-3">
              {announcements.map(notice => (
                <div 
                  key={notice.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                        {notice.category}
                      </span>
                      {notice.isUrgent && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                          URGENT
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-slate-400">{notice.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{notice.title}</h4>
                    <p className="text-xs text-slate-300 line-clamp-2 max-w-3xl">{notice.content}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenEditNotice(notice)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300"
                      title="Edit Notice"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete notice: "${notice.title}"?`)) {
                          deleteAnnouncement(notice.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STUDENTS DIRECTORY CMS */}
      {activeTab === 'students' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                Student Enrollment & Records CMS
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage all registered student profiles, fees, roll numbers, and house records.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 font-mono uppercase text-slate-400 text-[11px]">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Adm No</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Roll</th>
                  <th className="py-3 px-4">House</th>
                  <th className="py-3 px-4">Fee Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {students.map(student => (
                  <tr key={student.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={student.avatar} 
                          alt={student.name} 
                          className="w-8 h-8 rounded-lg bg-slate-950 p-0.5 border border-slate-700 object-cover"
                        />
                        <div>
                          <div className="font-bold text-white">{student.name}</div>
                          <div className="text-[10px] text-slate-400">Guardian: {student.guardianName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-300">{student.admissionNo}</td>
                    <td className="py-3 px-4 font-semibold text-slate-200">{student.grade} - {student.section}</td>
                    <td className="py-3 px-4 font-mono text-amber-300">#{student.rollNo}</td>
                    <td className="py-3 px-4 text-slate-300">{student.house}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        student.feeStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                        student.feeStatus === 'partial' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {student.feeStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete record for student ${student.name} (${student.admissionNo})?`)) {
                            deleteStudent(student.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        title="Delete Student Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: BACKUP, RESTORE & JSON EDITOR */}
      {activeTab === 'backup' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
              <FileCode className="w-5 h-5 text-amber-400" />
              Raw Configuration, JSON Export & Import Studio
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Export complete school database to file, import custom configurations, or inspect raw state.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                Export Offline Backup
              </h4>
              <p className="text-xs text-slate-400">
                Download all your customized school branding, teachers, enrolled students, and notices into a single JSON file.
              </p>
              <button
                onClick={handleExportJSON}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Backup File</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                Restore from JSON File
              </h4>
              <p className="text-xs text-slate-400">
                Upload a previously saved JSON file to restore all website customizations instantly.
              </p>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs">
                <Upload className="w-4 h-4" />
                <span>Choose Backup File</span>
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleImportJSON} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">
              Raw Site Configuration (JSON Inspector)
            </label>
            <textarea
              rows={12}
              value={jsonConfigText}
              onChange={e => setJsonConfigText(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 focus:border-cyan-400 focus:outline-none leading-relaxed"
            />
            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  try {
                    const parsed = JSON.parse(jsonConfigText);
                    updateSiteConfig(parsed);
                    showToast('Direct JSON modifications applied!');
                  } catch (e) {
                    showToast('Invalid JSON syntax. Please verify commas and braces.');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                Apply Raw JSON
              </button>
            </div>
          </div>
        </div>
      )}

        </div>
      </div>

    </div>
  );
};
