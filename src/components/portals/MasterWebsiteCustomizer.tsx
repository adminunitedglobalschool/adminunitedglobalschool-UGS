import React, { useState, useRef, useEffect } from 'react';
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
  Zap,
  Key,
  LogOut,
  User,
  ShieldAlert,
  Camera,
  RefreshCw,
  Video,
  Image as ImageIcon,
  Radio,
  Gauge,
  Layers
} from 'lucide-react';
import heroCampusImg from '../../assets/images/hero_united_global_school_1791694864291.jpg';
import { RolePermissionsCustomizer } from './admin/RolePermissionsCustomizer';
import { UserCredentialsManager } from './admin/UserCredentialsManager';

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
    setPublicPage,
    showToast,
    userCredentials 
  } = useSchool();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    setRole('public');
    setPublicPage('home');
    showToast('Logged out successfully from Super Admin Portal.');
  };

  const [activeTab, setActiveTab] = useState<'credentials' | 'permissions' | 'ticker' | 'images' | 'address' | 'branding' | 'faculty' | 'toppers' | 'notices' | 'students' | 'backup'>('credentials');

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

  useEffect(() => {
    setBrandingForm({ ...siteConfig });
  }, [siteConfig]);

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

  // Camera capture state for Teacher in Super Admin Faculty CMS
  const [isTeacherCameraOpen, setIsTeacherCameraOpen] = useState(false);
  const [teacherCameraStream, setTeacherCameraStream] = useState<MediaStream | null>(null);
  const [teacherFacingMode, setTeacherFacingMode] = useState<'user' | 'environment'>('user');
  const [teacherCameraError, setTeacherCameraError] = useState<string | null>(null);
  const teacherVideoRef = useRef<HTMLVideoElement | null>(null);

  // Stop camera tracks helper
  const stopTeacherCamera = () => {
    if (teacherCameraStream) {
      teacherCameraStream.getTracks().forEach(track => track.stop());
      setTeacherCameraStream(null);
    }
    setIsTeacherCameraOpen(false);
    setTeacherCameraError(null);
  };

  // Start camera helper
  const startTeacherCamera = async (mode: 'user' | 'environment' = teacherFacingMode) => {
    setTeacherCameraError(null);
    setIsTeacherCameraOpen(true);

    if (teacherCameraStream) {
      teacherCameraStream.getTracks().forEach(track => track.stop());
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: mode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setTeacherCameraStream(stream);

      if (teacherVideoRef.current) {
        teacherVideoRef.current.srcObject = stream;
        teacherVideoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Teacher camera access issue:', err);
      setTeacherCameraError(
        err?.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in browser settings.'
          : 'Unable to connect to camera device. Please upload a photo file instead.'
      );
    }
  };

  const switchTeacherCamera = () => {
    const nextMode = teacherFacingMode === 'user' ? 'environment' : 'user';
    setTeacherFacingMode(nextMode);
    startTeacherCamera(nextMode);
  };

  const captureTeacherPhoto = () => {
    if (!teacherVideoRef.current) return;
    const video = teacherVideoRef.current;
    const canvas = document.createElement('canvas');

    const vWidth = video.videoWidth || 640;
    const vHeight = video.videoHeight || 480;
    const cropSize = Math.min(vWidth, vHeight);
    const startX = (vWidth - cropSize) / 2;
    const startY = (vHeight - cropSize) / 2;

    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, startX, startY, cropSize, cropSize, 0, 0, 400, 400);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setTeacherFormData(prev => ({ ...prev, avatar: dataUrl }));
      showToast('Teacher photo captured successfully!');
      stopTeacherCamera();
    }
  };

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (teacherCameraStream) {
        teacherCameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [teacherCameraStream]);

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
    mentor: 'Teacher XYZ 01',
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
    showToast('School branding & site content saved successfully!');
  };

  const handleSaveImages = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSiteConfig(brandingForm);
    setJsonConfigText(JSON.stringify(brandingForm, null, 2));
    showToast('School logo, hero banner & website media updated successfully!');
  };

  const handleSaveAddress = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSiteConfig(brandingForm);
    setJsonConfigText(JSON.stringify(brandingForm, null, 2));
    showToast('Campus address, location & contact details saved successfully!');
  };

  const handleSaveTicker = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSiteConfig(brandingForm);
    setJsonConfigText(JSON.stringify(brandingForm, null, 2));
    showToast('Futuristic Notification Scroll Bar settings updated and live broadcasted!');
  };

  const updateCampusImage = (index: number, updatedFields: Partial<{ id: string; title: string; category: string; url: string }>) => {
    const list = brandingForm.campusImages && brandingForm.campusImages.length > 0
      ? [...brandingForm.campusImages] 
      : [...(DEFAULT_SITE_CONFIG.campusImages || [])];
    if (list[index]) {
      list[index] = { ...list[index], ...updatedFields };
      setBrandingForm(prev => ({ ...prev, campusImages: list }));
    }
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

    stopTeacherCamera();

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
      mentor: 'Teacher XYZ 01',
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

        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-purple-500/40 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Cyber Corner HUD Tech Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-400 pointer-events-none" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-400 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-400 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-400 pointer-events-none" />

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 border border-purple-400/50 flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.35)] shrink-0">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400"></span>
                </span>
                <h1 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
                  Super Admin Portal
                </h1>
                <span className="text-[10px] text-purple-300 font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30">
                  Master Directorate
                </span>
              </div>
            </div>
          </div>

          {/* Quick Hub Navigation, Profile & Logout */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setRole('admin')}
              className="px-3.5 py-2 rounded-xl bg-purple-600/20 border border-purple-500/40 hover:bg-purple-600/30 text-purple-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Panel (Operations)</span>
            </button>

            <button
              onClick={() => setRole('public')}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Public Website</span>
            </button>

            {/* Profile Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-purple-500/30 hover:border-purple-400 text-slate-200 hover:text-white transition-all shadow-sm cursor-pointer"
                title="Super Admin Profile"
              >
                <div className="w-6 h-6 rounded-lg bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-purple-300">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-white hidden sm:inline">Principal ABC</span>
              </button>

              {isProfileOpen && (
                <div 
                  className="absolute right-0 mt-2 w-80 bg-slate-900 border border-purple-500/40 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        ABC
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Principal ABC</div>
                        <div className="text-xs text-purple-300">Super Admin & Principal</div>
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
                      <span className="text-slate-400">Account:</span>
                      <span className="text-slate-200 font-mono truncate max-w-[170px]">adminunitedglobalschool@gmail.com</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Authority:</span>
                      <span className="text-purple-300 font-semibold">Super Administrator (Root)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Clearance:</span>
                      <span className="text-emerald-400 font-semibold">Level 5 (Unrestricted)</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="w-full py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 hover:text-rose-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out of Super Admin</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dedicated Log Out Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 text-rose-300 hover:text-white text-xs font-semibold transition-all shadow-sm cursor-pointer active:scale-95"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Log Out</span>
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

            {/* Featured Super Admin Module: USER CREDENTIALS */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold px-1">
                SUPER ADMIN MASTER CONTROL
              </div>
              <button
                onClick={() => setActiveTab('credentials')}
                className={`w-full p-3.5 rounded-2xl text-left transition-all relative overflow-hidden group border cursor-pointer ${
                  activeTab === 'credentials'
                    ? 'bg-gradient-to-r from-purple-600/30 via-indigo-600/25 to-cyan-500/20 border-purple-400 text-white shadow-[0_0_25px_rgba(168,85,247,0.3)] ring-1 ring-purple-300'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/40 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    activeTab === 'credentials'
                      ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold shadow-md shadow-purple-500/30'
                      : 'bg-slate-800/80 text-purple-400 border border-slate-700'
                  }`}>
                    <Key className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>User Credentials</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30">
                        {userCredentials.length} ISSUED
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                      Issue logins for Admin, Teachers, Students & Staff
                    </p>
                  </div>
                </div>
              </button>
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
                      <span>Roles & Permission Matrix</span>
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
                {/* Futuristic Notification Scroll Bar CMS */}
                <button
                  onClick={() => setActiveTab('ticker')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all text-left cursor-pointer ${
                    activeTab === 'ticker'
                      ? 'bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border border-amber-400 text-amber-200 font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Radio className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                    <span className="truncate">Futuristic Notification Scroll Bar</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0">
                    HUD
                  </span>
                </button>

                {/* 1. Logo & Any Website Images CMS */}
                <button
                  onClick={() => setActiveTab('images')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                    activeTab === 'images'
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400 text-cyan-200 font-bold shadow-md shadow-cyan-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">Logo & Website Images CMS</span>
                </button>

                {/* 2. Campus Address & Location Registry */}
                <button
                  onClick={() => setActiveTab('address')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                    activeTab === 'address'
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-600/20 border border-emerald-400 text-emerald-200 font-bold shadow-md shadow-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">Campus Address & Location</span>
                </button>

                <button
                  onClick={() => setActiveTab('branding')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                    activeTab === 'branding'
                      ? 'bg-purple-500/15 border border-purple-400/40 text-purple-300 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <School className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="truncate">School Identity & Content</span>
                </button>

                <button
                  onClick={() => setActiveTab('faculty')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                    activeTab === 'faculty'
                      ? 'bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">Faculty & Teachers CMS ({teachers.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('toppers')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left cursor-pointer ${
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
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                    activeTab === 'notices'
                      ? 'bg-purple-600/15 border border-purple-400/40 text-purple-300 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Bell className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="truncate">Notices & Circulars CMS ({announcements.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('students')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                    activeTab === 'students'
                      ? 'bg-blue-600/15 border border-blue-400/40 text-blue-300 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="truncate">Students Roster CMS ({students.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('backup')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                    activeTab === 'backup'
                      ? 'bg-amber-500/15 border border-amber-400/40 text-amber-300 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <FileCode className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">Backup, JSON & Raw Sync</span>
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

          {/* TAB 0: SUPER ADMIN USER CREDENTIALS HUB */}
          {activeTab === 'credentials' && (
            <UserCredentialsManager />
          )}

          {/* TAB 1: ROLES & PERMISSIONS MATRIX */}
          {activeTab === 'permissions' && (
            <RolePermissionsCustomizer />
          )}

          {/* TAB: FUTURISTIC NOTIFICATION SCROLL BAR CMS */}
          {activeTab === 'ticker' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                      <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
                      Futuristic Notification Scroll Bar (Live HUD Stream)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Navbar ke neeche scroll hone wale futuristic ticker ko configure karein — speed, custom live broadcast text, aur display toggle karein.
                    </p>
                  </div>

                  <button
                    onClick={() => handleSaveTicker()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Broadcast Live</span>
                  </button>
                </div>

                {/* 1. Live Interactive HUD Preview */}
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                      Live HUD Marquee Preview
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      {brandingForm.tickerEnabled !== false ? '● ACTIVE STREAM' : '○ MUTED / HIDDEN'}
                    </span>
                  </div>

                  {/* Visual Preview Box */}
                  <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 overflow-hidden relative">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 px-2 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-bold flex items-center gap-1.5">
                        <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
                        <span>{brandingForm.tickerBadgeText || 'UGS LIVE DISPATCH'}</span>
                      </div>
                      <div className="overflow-hidden flex-1 text-xs text-slate-300 font-mono truncate">
                        <span className="text-amber-300 font-bold mr-2">⚡ [LIVE BROADCAST]</span>
                        {brandingForm.tickerCustomBroadcast || 'ADMISSIONS OPEN 2026–27 · CBSE AFFILIATED · STATE-OF-THE-ART DIGITAL CAMPUS'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Controls Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Master Power Toggle */}
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <Zap className="w-4 h-4 text-cyan-400" />
                          Master Ticker Visibility
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Website ke top par navbar ke neeche scroll bar show ya hide karein.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setBrandingForm(prev => ({ ...prev, tickerEnabled: true }))}
                        className={`flex-1 p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          brandingForm.tickerEnabled !== false
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/10'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Visible (ON)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBrandingForm(prev => ({ ...prev, tickerEnabled: false }))}
                        className={`flex-1 p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          brandingForm.tickerEnabled === false
                            ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-lg shadow-rose-500/10'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <X className="w-4 h-4" />
                        <span>Hidden (OFF)</span>
                      </button>
                    </div>
                  </div>

                  {/* Stream Layout Mode (1-Line vs 2-Line) */}
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        Stream Layout Mode
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Ek hi line (1-Line) ya dual-tier (2-Line) layout chunein (text upar/neeche cut nahi hoga).
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setBrandingForm(prev => ({ ...prev, tickerLayoutMode: 'single-line' }))}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                          (brandingForm.tickerLayoutMode || 'single-line') === 'single-line'
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div>1-Line View</div>
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">Ek Hi Line (Clear)</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBrandingForm(prev => ({ ...prev, tickerLayoutMode: 'two-line' }))}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                          brandingForm.tickerLayoutMode === 'two-line'
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div>2-Line View</div>
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">Do Line (Dual Tier)</div>
                      </button>
                    </div>
                  </div>

                  {/* Scroll Speed Configuration */}
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-amber-400" />
                      Marquee Scroll Speed
                    </div>
                    <p className="text-xs text-slate-400">
                      Notifications kis speed me scroll hongi select karein.
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-2">
                      {(['slow', 'normal', 'fast'] as const).map(speed => (
                        <button
                          key={speed}
                          type="button"
                          onClick={() => setBrandingForm(prev => ({ ...prev, tickerSpeed: speed }))}
                          className={`p-2.5 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer text-center ${
                            (brandingForm.tickerSpeed || 'normal') === speed
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {speed === 'slow' && '🐢 Slow (45s)'}
                          {speed === 'normal' && '⚡ Normal (28s)'}
                          {speed === 'fast' && '🚀 Fast (18s)'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Holographic Badge Title & Custom Broadcast */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    HUD Badge Title & Breaking Telemetry Broadcast
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold mb-1.5">
                        HUD Badge Title (Left Tag)
                      </label>
                      <input
                        type="text"
                        value={brandingForm.tickerBadgeText ?? 'UGS LIVE DISPATCH'}
                        onChange={(e) => setBrandingForm(prev => ({ ...prev, tickerBadgeText: e.target.value }))}
                        placeholder="e.g. UGS LIVE DISPATCH or NOTICE RADAR"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">Left side me glowing chip ki heading</span>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold mb-1.5">
                        Breaking Broadcast Headline (Always Scrolls First)
                      </label>
                      <input
                        type="text"
                        value={brandingForm.tickerCustomBroadcast ?? ''}
                        onChange={(e) => setBrandingForm(prev => ({ ...prev, tickerCustomBroadcast: e.target.value }))}
                        placeholder="e.g. ADMISSIONS OPEN 2026–27 · ENTRANCE TEST SCHEDULED FOR NOVEMBER · MERIT SCHOLARSHIPS AVAILABLE"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">Super Admin ka direct custom message jo ticker me sabse aage scroll hota hai</span>
                    </div>
                  </div>
                </div>

                {/* 4. Active Announcements Included in Marquee */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-400" />
                        Active Notices Streaming in Ticker ({announcements.length})
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Circulars/Notices section ke sabhi circulars automatically is futuristic ticker me scroll hote hain.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('notices')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-cyan-400" />
                      Manage / Add Notice
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                    {announcements.slice(0, 6).map(notice => (
                      <div
                        key={notice.id}
                        className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                              notice.isUrgent ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-cyan-500/10 text-cyan-300'
                            }`}>
                              {notice.category}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">{notice.date}</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-200 line-clamp-1">{notice.title}</p>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{notice.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setBrandingForm(prev => ({
                        ...prev,
                        tickerEnabled: true,
                        tickerSpeed: 'normal',
                        tickerBadgeText: 'UGS LIVE DISPATCH',
                        tickerCustomBroadcast: 'ADMISSIONS OPEN 2026–27 · CBSE AFFILIATED · STATE-OF-THE-ART DIGITAL CAMPUS · SCHOLARSHIP TESTS LIVE'
                      }));
                      showToast('Ticker settings reset to futuristic defaults');
                    }}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset to Default Values
                  </button>

                  <button
                    onClick={() => handleSaveTicker()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Broadcast Live</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LOGO & WEBSITE IMAGES CMS */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                      <ImageIcon className="w-5 h-5 text-cyan-400" />
                      Logo, Hero Banner & Website Media CMS
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Super Admin exclusive portal to change the School Logo, Hero Image, and any campus facility images across the website.
                    </p>
                  </div>

                  <button
                    onClick={() => handleSaveImages()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Media Changes</span>
                  </button>
                </div>

                {/* 1. School Logo & Institutional Crest */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        1. Official School Logo & Crest Emblem
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Appears in the header navigation bar, glowing hero crest, document watermarks, and footer credentials.
                      </p>
                    </div>
                    {brandingForm.logoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setBrandingForm(prev => ({ ...prev, logoUrl: '' }));
                          showToast('Logo reset to default UGS emblem');
                        }}
                        className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset to Default
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                    {/* Live Preview Box */}
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                        Live Logo Preview
                      </div>
                      <div className="w-24 h-24 rounded-2xl bg-slate-950 border border-cyan-400/40 p-2 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.25)] relative overflow-hidden group">
                        {brandingForm.logoUrl ? (
                          <img
                            src={brandingForm.logoUrl}
                            alt="School Logo"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-cyan-400">
                            <School className="w-10 h-10" />
                            <span className="text-[9px] font-mono font-bold mt-1 tracking-wider">UGS EMBLEM</span>
                          </div>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-300 font-bold">
                        {brandingForm.schoolName || 'United Global School'}
                      </div>
                    </div>

                    {/* Controls & Inputs */}
                    <div className="md:col-span-2 space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Direct Logo Image URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://... (PNG, SVG, or JPG image link)"
                          value={brandingForm.logoUrl || ''}
                          onChange={(e) => setBrandingForm(prev => ({ ...prev, logoUrl: e.target.value }))}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 text-xs font-bold inline-flex items-center gap-2 transition-all shadow-sm">
                          <Upload className="w-4 h-4" />
                          <span>Upload Logo File (PNG/SVG/JPG)</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageFileUpload(e, (url) => setBrandingForm(prev => ({ ...prev, logoUrl: url })))}
                          />
                        </label>

                        {/* Quick Presets */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400">Sample Badges:</span>
                          <button
                            type="button"
                            onClick={() => setBrandingForm(prev => ({ ...prev, logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=UGSGlobalEmblem' }))}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-mono cursor-pointer"
                          >
                            Shield Crest
                          </button>
                          <button
                            type="button"
                            onClick={() => setBrandingForm(prev => ({ ...prev, logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=UnitedGlobalSchool' }))}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-mono cursor-pointer"
                          >
                            Academic Laurel
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400">
                        Recommendation: A high-contrast transparent PNG or SVG crest (min 200x200px) displays optimally on both dark and cyber gradient headers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Hero Section Main Campus Banner */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        2. Hero Section Main Campus Banner
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        The primary cinematic visual background that appears in the top Hero Section of the school website.
                      </p>
                    </div>
                    {brandingForm.heroImageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setBrandingForm(prev => ({ ...prev, heroImageUrl: '' }));
                          showToast('Hero image reset to default campus photography');
                        }}
                        className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset to Default Hero
                      </button>
                    )}
                  </div>

                  {/* Wide Cinematic Banner Live Preview */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-xl aspect-[21/9] sm:aspect-[24/9] max-h-56 bg-slate-900 group">
                    <img
                      src={brandingForm.heroImageUrl || heroCampusImg}
                      alt="Hero Section Campus"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent flex flex-col justify-end p-4">
                      <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                        ACTIVE HERO SECTION PREVIEW
                      </div>
                      <div className="text-sm sm:text-base font-bold text-white font-display">
                        {brandingForm.schoolName || 'United Global School'}
                      </div>
                      <div className="text-xs text-slate-300">
                        {brandingForm.tagline || 'Bhakatgaon, Rupahi Town · Nagaon, Assam'}
                      </div>
                    </div>
                  </div>

                  {/* Banner Controls & URL Input */}
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Hero Campus Image URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://... (Direct image link for hero background)"
                        value={brandingForm.heroImageUrl || ''}
                        onChange={(e) => setBrandingForm(prev => ({ ...prev, heroImageUrl: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-400 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/50 text-blue-300 text-xs font-bold inline-flex items-center gap-2 transition-all shadow-sm">
                        <Upload className="w-4 h-4" />
                        <span>Upload Hero Banner File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageFileUpload(e, (url) => setBrandingForm(prev => ({ ...prev, heroImageUrl: url })))}
                        />
                      </label>

                      <div className="text-xs text-slate-400">or choose from Curated Campus Presets:</div>
                    </div>

                    {/* Curated Presets */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                      {[
                        {
                          label: 'Campus Quadrangle',
                          url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80'
                        },
                        {
                          label: 'AI & Robotics Lab',
                          url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80'
                        },
                        {
                          label: 'Academic Complex',
                          url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80'
                        },
                        {
                          label: 'Sports Stadium & Turf',
                          url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80'
                        }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setBrandingForm(prev => ({ ...prev, heroImageUrl: preset.url }));
                            showToast(`Applied "${preset.label}" hero banner preset!`);
                          }}
                          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400/60 text-left transition-all group cursor-pointer"
                        >
                          <div className="h-16 rounded-lg overflow-hidden bg-slate-950 mb-1.5 border border-slate-850">
                            <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-300 group-hover:text-cyan-300 block truncate">
                            {preset.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Campus Facilities & Website Media Gallery */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-400" />
                        3. Campus Facilities & Website Media Gallery (Any Image)
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Customize photography and media across the Campus Tour, STEM Labs, Sports Arena, and Performing Arts pavilion.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {((brandingForm.campusImages && brandingForm.campusImages.length > 0)
                      ? brandingForm.campusImages
                      : (DEFAULT_SITE_CONFIG.campusImages || [])
                    ).map((media, index) => (
                      <div key={media.id || index} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
                            <img
                              src={media.url}
                              alt={media.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0 space-y-2">
                            <div>
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 uppercase font-bold">
                                {media.category || 'Facility'}
                              </span>
                              <input
                                type="text"
                                value={media.title}
                                onChange={(e) => updateCampusImage(index, { title: e.target.value })}
                                placeholder="Image Title"
                                className="w-full mt-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
                              />
                            </div>

                            <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-[11px] font-bold text-slate-200 border border-slate-700 inline-flex items-center gap-1.5 transition-all">
                              <Upload className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Replace Image File</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageFileUpload(e, (url) => updateCampusImage(index, { url }))}
                              />
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                            Direct Image URL
                          </label>
                          <input
                            type="url"
                            value={media.url}
                            onChange={(e) => updateCampusImage(index, { url: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleSaveImages()}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Website Images & Logo Changes</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CAMPUS ADDRESS & LOCATION REGISTRY */}
          {activeTab === 'address' && (
            <form onSubmit={handleSaveAddress} className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 font-display">
                      <MapPin className="w-5 h-5 text-emerald-400" />
                      Campus Address, Geo Telemetry & Contact Directorate
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Super Admin control to configure school location, postal address, town designation, phone helplines, emails, and operating hours.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Address & Contacts</span>
                  </button>
                </div>

                {/* Live Campus Location Preview Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-teal-950/40 border border-emerald-500/30 space-y-3">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Live Website Address Badge Preview
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-base font-bold text-white font-display flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{brandingForm.campusLocation || 'Bhakatgaon, Rupahi Town · Nagaon, Assam'}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Official Campus: {brandingForm.tagline || 'Bhakatgaon, Rupahi Town · Nagaon, Assam'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                        <Phone className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-mono">{brandingForm.phone1}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                        <Mail className="w-3.5 h-3.5 text-purple-400" />
                        <span>{brandingForm.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                        <span className="text-emerald-400 font-bold font-mono">CBSE:</span>
                        <span className="font-mono">{brandingForm.affiliationCode}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields: Campus Physical Location */}
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800 pb-2">
                    PHYSICAL CAMPUS ADDRESS & TOWN DESIGNATION
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Full Campus Postal Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={brandingForm.campusLocation}
                        onChange={e => setBrandingForm({ ...brandingForm, campusLocation: e.target.value })}
                        placeholder="Bhakatgaon, Rupahi Town, Nagaon, Assam 782125, India"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Displays in the website footer, contact deck, and official admissions prospectus.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Town, District & State Subtitle *
                      </label>
                      <input
                        type="text"
                        required
                        value={brandingForm.tagline}
                        onChange={e => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                        placeholder="Bhakatgaon, Rupahi Town · Nagaon, Assam"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Displays in the header wordmark, hero cyber badge, and social metadata.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Fields: Direct Communication Lines */}
                <div className="space-y-4 pt-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800 pb-2">
                    DIRECT COMMUNICATION LINES & TELEMETRY
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Primary Campus Phone *
                      </label>
                      <input
                        type="text"
                        required
                        value={brandingForm.phone1}
                        onChange={e => setBrandingForm({ ...brandingForm, phone1: e.target.value })}
                        placeholder="+91 94350 12345"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Secondary / Admission Helpline Phone
                      </label>
                      <input
                        type="text"
                        value={brandingForm.phone2}
                        onChange={e => setBrandingForm({ ...brandingForm, phone2: e.target.value })}
                        placeholder="+91 98640 67890"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Official Directorate Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={brandingForm.email}
                        onChange={e => setBrandingForm({ ...brandingForm, email: e.target.value })}
                        placeholder="admissions@unitedglobalschool.edu.in"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Campus Operating & Visiting Hours
                      </label>
                      <input
                        type="text"
                        value={brandingForm.operatingHours}
                        onChange={e => setBrandingForm({ ...brandingForm, operatingHours: e.target.value })}
                        placeholder="Monday – Saturday: 08:00 AM – 04:30 PM IST"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
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
                        placeholder="CBSE/AFF/230198/2026"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none font-mono"
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
                        placeholder="18100304512"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Campus Address & Location Details</span>
                  </button>
                </div>
              </div>
            </form>
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
                      stopTeacherCamera();
                      setIsAddingTeacher(false);
                      setEditingTeacher(null);
                    }}
                    className="text-slate-400 hover:text-white cursor-pointer"
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
                      placeholder="e.g. Teacher XYZ 01"
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

                  <div className="sm:col-span-2 lg:col-span-3 pt-4 border-t border-slate-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-white">
                          Teacher Profile Photo / Biometric Avatar
                        </label>
                        <p className="text-[11px] text-slate-400">
                          Captured or uploaded solely by Super Admin. Teachers cannot alter or upload their own photo.
                        </p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold">
                        Super Admin Authorization
                      </span>
                    </div>

                    {/* Live Camera Viewfinder Modal/Box */}
                    {isTeacherCameraOpen && (
                      <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-2xl space-y-3 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <span className="text-xs font-bold text-white flex items-center gap-2">
                            <Camera className="w-4 h-4 text-emerald-400" />
                            Live Teacher Photo Capture Viewfinder
                          </span>
                          <button
                            type="button"
                            onClick={stopTeacherCamera}
                            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {teacherCameraError ? (
                          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>{teacherCameraError}</span>
                          </div>
                        ) : (
                          <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-w-md mx-auto border border-emerald-500/30 flex items-center justify-center">
                            <video
                              ref={teacherVideoRef}
                              autoPlay
                              playsInline
                              muted
                              className="w-full h-full object-cover transform -scale-x-100"
                            />
                            {/* Framing Overlay */}
                            <div className="absolute inset-0 pointer-events-none border-2 border-emerald-400/50 rounded-xl m-4 flex items-center justify-center">
                              <div className="w-32 h-40 border border-dashed border-cyan-400/80 rounded-2xl flex items-center justify-center text-[10px] font-mono text-cyan-300/80">
                                Position Face
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-center gap-3 pt-1">
                          <button
                            type="button"
                            onClick={captureTeacherPhoto}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all cursor-pointer"
                          >
                            <Camera className="w-4 h-4" />
                            <span>Snap & Use Photo</span>
                          </button>
                          <button
                            type="button"
                            onClick={switchTeacherCamera}
                            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Flip camera"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Flip Camera</span>
                          </button>
                          <button
                            type="button"
                            onClick={stopTeacherCamera}
                            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Standard Photo Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="relative w-14 h-14 rounded-2xl bg-slate-900 border-2 border-emerald-500/40 overflow-hidden flex items-center justify-center shrink-0 shadow-md">
                        {teacherFormData.avatar ? (
                          <img src={teacherFormData.avatar} alt="Teacher Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-7 h-7 text-slate-500" />
                        )}
                      </div>

                      {/* Capture Live Photo Button */}
                      <button
                        type="button"
                        onClick={() => startTeacherCamera('user')}
                        className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
                      >
                        <Camera className="w-4 h-4 text-emerald-400" />
                        <span>Capture Live Photo (Webcam)</span>
                      </button>

                      {/* File Upload Button */}
                      <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-400 text-slate-300 hover:text-white cursor-pointer text-xs font-medium transition-colors">
                        <Upload className="w-4 h-4 text-emerald-400" />
                        <span>Upload Photo File</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleImageFileUpload(e, (url) => setTeacherFormData(prev => ({ ...prev, avatar: url })))}
                        />
                      </label>

                      {teacherFormData.avatar && (
                        <button
                          type="button"
                          onClick={() => setTeacherFormData(prev => ({ ...prev, avatar: '' }))}
                          className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs transition-colors cursor-pointer"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="text-[11px] text-slate-500 shrink-0">Direct Image URL:</span>
                      <input
                        type="url"
                        placeholder="https://... or data:image/..."
                        value={teacherFormData.avatar}
                        onChange={e => setTeacherFormData({ ...teacherFormData, avatar: e.target.value })}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      stopTeacherCamera();
                      setIsAddingTeacher(false);
                      setEditingTeacher(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
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
                    mentor: 'Teacher XYZ 01',
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
                      placeholder="e.g. Student ABC 01"
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
                      placeholder="e.g. Teacher XYZ 01"
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
                <span>Publish New Notice</span>
              </button>
            </div>

            {/* Notice Form Modal */}
            {isAddingNotice && (
              <form onSubmit={handleSaveNotice} className="p-5 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-white">
                    {editingNotice ? `Edit Notice: ${editingNotice.title}` : 'Draft & Publish New Notice'}
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
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Notice Title *</label>
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
                      {editingNotice ? 'Update Notice' : 'Publish Notice'}
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
