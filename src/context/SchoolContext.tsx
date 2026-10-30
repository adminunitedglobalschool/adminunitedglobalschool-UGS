import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  PublicPage,
  Student, 
  Teacher, 
  Staff, 
  Administrator,
  AttendanceRecord, 
  FeeTransaction, 
  Announcement, 
  Achievement,
  SchoolWebsiteConfig,
  ClassTopper,
  RolePermissions,
  DEFAULT_ROLE_PERMISSIONS,
  UserCredential
} from '../types/school';
import { 
  INITIAL_STUDENTS, 
  INITIAL_TEACHERS, 
  INITIAL_STAFF, 
  INITIAL_ADMINISTRATORS,
  INITIAL_TRANSACTIONS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_ACHIEVEMENTS,
  INITIAL_TOPPERS,
  INITIAL_USER_CREDENTIALS
} from '../data/initialData';
import {
  COLLECTIONS,
  saveDocument,
  removeDocument,
  saveSingletonConfig,
  subscribeToCollection,
  subscribeToDoc,
  seedInitialFirestoreDataIfEmpty
} from '../lib/firestoreService';

export const DEFAULT_SITE_CONFIG: SchoolWebsiteConfig = {
  schoolName: 'United Global School',
  tagline: 'Rupahi Town',
  affiliationCode: 'UGS-AS-2026-89',
  udiseCode: '18100508901',
  campusLocation: 'Rupahi Town, Nagaon District, Assam, PIN - 782125',
  address: 'Rupahi Town, Nagaon, Assam',
  pinCode: '782125',
  phone1: '+91 94350 88210',
  phone2: '+91 98640 12345',
  email: 'adminunitedglobalschool@gmail.com',
  operatingHours: 'Mon – Sat: 08:00 AM – 03:30 PM IST',
  heroHeading: 'United Global School',
  heroSubheading: 'United Global School converges academic rigor with applied robotics, athletic discipline, and ethical leadership to shape visionary global thinkers.',
  admissionOpenText: 'Admissions Open 2026–27',
  bannerNotice: 'Admissions Open for Session 2026-27 | Limited Seats in Science & Robotics Stream',
  logoUrl: '',
  heroImageUrl: '',
  campusImages: [
    { id: 'c1', title: 'Futuristic STEM & Robotics Laboratory', category: 'STEM & Tech', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' },
    { id: 'c2', title: 'Physics & Applied Sciences Studio', category: 'Scientific Labs', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80' },
    { id: 'c3', title: 'Central Knowledge Library & Digital Commons', category: 'Resource Center', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80' },
    { id: 'c4', title: 'Olympic Multipurpose Sports Arena', category: 'Athletics & Fitness', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80' }
  ],
  tickerEnabled: true,
  tickerSpeed: 'normal',
  tickerBadgeText: 'UGS LIVE DISPATCH',
  tickerCustomBroadcast: 'ADMISSIONS OPEN 2026–27 · ONLINE APPLICATIONS & PRINCIPAL COUNSELING ACTIVE · ALL-ASSAM STEM SCHOLARSHIP EXAMINATION REGISTRATIONS OPEN',
};

interface SchoolContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  publicPage: PublicPage;
  setPublicPage: (page: PublicPage) => void;
  students: Student[];
  teachers: Teacher[];
  staff: Staff[];
  administrators: Administrator[];
  attendanceRecords: AttendanceRecord[];
  transactions: FeeTransaction[];
  announcements: Announcement[];
  achievements: Achievement[];
  toppers: ClassTopper[];
  addTopper: (data: Partial<ClassTopper>) => ClassTopper;
  updateTopper: (id: string, data: Partial<ClassTopper>) => void;
  deleteTopper: (id: string) => void;
  
  // Website Customization & CMS
  siteConfig: SchoolWebsiteConfig;
  updateSiteConfig: (config: Partial<SchoolWebsiteConfig>) => void;
  deleteStudent: (id: string) => void;
  updateTeacher: (id: string, data: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  updateAnnouncement: (id: string, data: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  deleteStaff: (id: string) => void;
  updateStaff: (id: string, data: Partial<Staff>) => void;
  resetToDefaults: () => void;
  
  // Active student for student portal
  activeStudent: Student;
  setActiveStudentId: (id: string) => void;
  
  // Attendance actions
  markAttendance: (studentId: string, status: 'present' | 'absent' | 'late' | 'excused', date?: string) => void;
  bulkMarkAttendance: (grade: string, section: string, status: 'present' | 'absent', date?: string) => void;
  
  // Fee actions
  recordPayment: (payment: Omit<FeeTransaction, 'id' | 'receiptNo'>) => FeeTransaction;
  
  // Announcements
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  
  // Receipt Modal
  selectedReceipt: FeeTransaction | null;
  openReceiptModal: (transaction: FeeTransaction) => void;
  closeReceiptModal: () => void;
  
  // Admission Modal
  isAdmissionModalOpen: boolean;
  openAdmissionModal: () => void;
  closeAdmissionModal: () => void;

  // Offline Admission Form Modal
  isOfflineAdmissionModalOpen: boolean;
  openOfflineAdmissionModal: () => void;
  closeOfflineAdmissionModal: () => void;

  // Appointment with Principal Modal
  isPrincipalAppointmentModalOpen: boolean;
  openPrincipalAppointmentModal: () => void;
  closePrincipalAppointmentModal: () => void;

  // Donate to Trust Modal
  isDonateModalOpen: boolean;
  openDonateModal: () => void;
  closeDonateModal: () => void;

  // Student operations
  registerNewStudent: (studentData: Partial<Student>) => Student;
  updateStudent: (studentId: string, studentData: Partial<Student>) => void;
  
  // Teacher operations (Admin only)
  addTeacher: (teacherData: Partial<Teacher>) => Teacher;
  markTeacherAttendance: (teacherId: string, status: 'present' | 'absent' | 'on_duty' | 'leave') => void;
  disburseTeacherSalary: (teacherId: string) => void;
  
  // Staff operations (Admin only)
  addStaff: (staffData: Partial<Staff>) => Staff;
  markStaffAttendance: (staffId: string, status: 'present' | 'absent' | 'leave') => void;
  disburseStaffSalary: (staffId: string) => void;
  
  // Administrator operations (Admin only)
  addAdministrator: (adminData: Partial<Administrator>) => Administrator;
  
  // Public Galleries ('teachers' | 'toppers')
  publicGalleryTab: 'teachers' | 'toppers';
  setPublicGalleryTab: (tab: 'teachers' | 'toppers') => void;
  openPublicGallery: (tab: 'teachers' | 'toppers') => void;

  // Search helper
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Role Permissions Management (Teacher & Staff View/Action Matrix)
  rolePermissions: RolePermissions;
  updateTeacherPermission: <K extends keyof RolePermissions['teacher']>(key: K, value: boolean) => void;
  updateStaffPermission: <K extends keyof RolePermissions['staff']>(key: K, value: boolean) => void;
  resetRolePermissions: () => void;

  // User Credentials & Granular Access Control
  userCredentials: UserCredential[];
  addUserCredential: (data: Partial<UserCredential>) => UserCredential;
  updateUserCredential: (id: string, data: Partial<UserCredential>) => void;
  deleteUserCredential: (id: string) => void;

  // Firebase Real-time Connection State
  firebaseConnected: boolean;

  // Viewport & Fullscreen Display Modes
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isLeaveScreenView: boolean;
  toggleLeaveScreenView: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const TODAY_DATE = '2026-10-10';

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('ugs_user_role') as UserRole) || 'public';
  });

  const [publicPage, setPublicPage] = useState<PublicPage>('home');
  const [publicGalleryTab, setPublicGalleryTab] = useState<'teachers' | 'toppers'>('toppers');

  // Fullscreen & Leave-Screen (Framed Boxed) View State
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    return typeof document !== 'undefined' ? !!document.fullscreenElement : false;
  });

  const [isLeaveScreenView, setIsLeaveScreenView] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ugs_leave_screen_view');
      return saved !== null ? saved === 'true' : false;
    }
    return false;
  });

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Error entering fullscreen:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.warn('Error exiting fullscreen:', err);
        });
      }
    }
  };

  const toggleLeaveScreenView = () => {
    setIsLeaveScreenView(prev => {
      const nextVal = !prev;
      localStorage.setItem('ugs_leave_screen_view', String(nextVal));
      showToast(nextVal ? 'Leave-Screen (Tablet View) Activated' : 'Desktop Full-Width View Activated');
      return nextVal;
    });
  };

  const openPublicGallery = (tab: 'teachers' | 'toppers') => {
    if (role !== 'public') setRole('public');
    if (publicPage !== 'home') setPublicPage('home');
    setPublicGalleryTab(tab);
    setTimeout(() => {
      const el = document.getElementById('public-galleries');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('ugs_v3_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('ugs_v3_teachers');
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('ugs_v3_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [administrators, setAdministrators] = useState<Administrator[]>(() => {
    const saved = localStorage.getItem('ugs_v3_admins');
    return saved ? JSON.parse(saved) : INITIAL_ADMINISTRATORS;
  });

  const [transactions, setTransactions] = useState<FeeTransaction[]>(() => {
    const saved = localStorage.getItem('ugs_v3_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('ugs_v3_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [toppers, setToppers] = useState<ClassTopper[]>(() => {
    const saved = localStorage.getItem('ugs_v3_toppers');
    return saved ? JSON.parse(saved) : INITIAL_TOPPERS;
  });

  const [achievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  // Initialize today's attendance records
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('ugs_v3_attendance');
    if (saved) return JSON.parse(saved);

    // Generate initial records for today
    return INITIAL_STUDENTS.map(s => ({
      id: `att-${s.id}-${TODAY_DATE}`,
      date: TODAY_DATE,
      studentId: s.id,
      studentName: s.name,
      grade: s.grade,
      section: s.section,
      rollNo: s.rollNo,
      status: s.attendanceRate < 75 ? 'absent' : 'present',
    }));
  });

  const [siteConfig, setSiteConfig] = useState<SchoolWebsiteConfig>(() => {
    const saved = localStorage.getItem('ugs_site_config');
    return saved ? { ...DEFAULT_SITE_CONFIG, ...JSON.parse(saved) } : DEFAULT_SITE_CONFIG;
  });

  const [activeStudentId, setActiveStudentId] = useState<string>('std-101'); // Student ABC 01 by default
  const [selectedReceipt, setSelectedReceipt] = useState<FeeTransaction | null>(null);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [isOfflineAdmissionModalOpen, setIsOfflineAdmissionModalOpen] = useState(false);
  const [isPrincipalAppointmentModalOpen, setIsPrincipalAppointmentModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [rolePermissions, setRolePermissions] = useState<RolePermissions>(() => {
    const saved = localStorage.getItem('ugs_role_permissions');
    return saved ? JSON.parse(saved) : DEFAULT_ROLE_PERMISSIONS;
  });

  const [userCredentials, setUserCredentials] = useState<UserCredential[]>(() => {
    const saved = localStorage.getItem('ugs_v3_user_credentials');
    return saved ? JSON.parse(saved) : INITIAL_USER_CREDENTIALS;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('ugs_v3_user_credentials', JSON.stringify(userCredentials));
  }, [userCredentials]);

  useEffect(() => {
    localStorage.setItem('ugs_role_permissions', JSON.stringify(rolePermissions));
  }, [rolePermissions]);

  useEffect(() => {
    localStorage.setItem('ugs_site_config', JSON.stringify(siteConfig));
  }, [siteConfig]);

  useEffect(() => {
    localStorage.setItem('ugs_user_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('ugs_v3_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('ugs_v3_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ugs_v3_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('ugs_v3_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('ugs_v3_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('ugs_v3_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('ugs_v3_admins', JSON.stringify(administrators));
  }, [administrators]);

  useEffect(() => {
    localStorage.setItem('ugs_v3_toppers', JSON.stringify(toppers));
  }, [toppers]);

  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(true);

  // Real-time Firestore initialization & snapshot synchronization
  useEffect(() => {
    seedInitialFirestoreDataIfEmpty({
      siteConfig: DEFAULT_SITE_CONFIG,
      students: INITIAL_STUDENTS,
      teachers: INITIAL_TEACHERS,
      staff: INITIAL_STAFF,
      administrators: INITIAL_ADMINISTRATORS,
      transactions: INITIAL_TRANSACTIONS,
      announcements: INITIAL_ANNOUNCEMENTS,
      toppers: INITIAL_TOPPERS,
      rolePermissions: DEFAULT_ROLE_PERMISSIONS,
      userCredentials: INITIAL_USER_CREDENTIALS
    }).then(() => {
      setFirebaseConnected(true);
    }).catch(() => {
      setFirebaseConnected(false);
    });

    const unsubSiteConfig = subscribeToDoc<SchoolWebsiteConfig>(COLLECTIONS.SITE_CONFIG, 'current', (data) => {
      if (data) {
        setSiteConfig(prev => ({ ...prev, ...data }));
        setFirebaseConnected(true);
      }
    });

    const unsubRolePerms = subscribeToDoc<RolePermissions>(COLLECTIONS.ROLE_PERMISSIONS, 'matrix', (data) => {
      if (data) {
        setRolePermissions(data);
        setFirebaseConnected(true);
      }
    });

    const unsubStudents = subscribeToCollection<Student>(COLLECTIONS.STUDENTS, (items) => {
      if (items && items.length > 0) {
        setStudents(items);
        setFirebaseConnected(true);
      }
    });

    const unsubTeachers = subscribeToCollection<Teacher>(COLLECTIONS.TEACHERS, (items) => {
      if (items && items.length > 0) {
        setTeachers(items);
        setFirebaseConnected(true);
      }
    });

    const unsubStaff = subscribeToCollection<Staff>(COLLECTIONS.STAFF, (items) => {
      if (items && items.length > 0) {
        setStaff(items);
        setFirebaseConnected(true);
      }
    });

    const unsubAdmins = subscribeToCollection<Administrator>(COLLECTIONS.ADMINISTRATORS, (items) => {
      if (items && items.length > 0) {
        setAdministrators(items);
        setFirebaseConnected(true);
      }
    });

    const unsubAnnouncements = subscribeToCollection<Announcement>(COLLECTIONS.ANNOUNCEMENTS, (items) => {
      if (items && items.length > 0) {
        setAnnouncements(items);
        setFirebaseConnected(true);
      }
    });

    const unsubToppers = subscribeToCollection<ClassTopper>(COLLECTIONS.TOPPERS, (items) => {
      if (items && items.length > 0) {
        setToppers(items);
        setFirebaseConnected(true);
      }
    });

    const unsubTransactions = subscribeToCollection<FeeTransaction>(COLLECTIONS.TRANSACTIONS, (items) => {
      if (items && items.length > 0) {
        setTransactions(items);
        setFirebaseConnected(true);
      }
    });

    const unsubAttendance = subscribeToCollection<AttendanceRecord>(COLLECTIONS.ATTENDANCE, (items) => {
      if (items && items.length > 0) {
        setAttendanceRecords(items);
        setFirebaseConnected(true);
      }
    });

    const unsubUserCreds = subscribeToCollection<UserCredential>(COLLECTIONS.USER_CREDENTIALS, (items) => {
      if (items && items.length > 0) {
        setUserCredentials(items);
        setFirebaseConnected(true);
      }
    });

    return () => {
      unsubSiteConfig();
      unsubRolePerms();
      unsubStudents();
      unsubTeachers();
      unsubStaff();
      unsubAdmins();
      unsubAnnouncements();
      unsubToppers();
      unsubTransactions();
      unsubAttendance();
      unsubUserCreds();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3800);
  };

  const updateTeacherPermission = <K extends keyof RolePermissions['teacher']>(key: K, value: boolean) => {
    setRolePermissions(prev => {
      const updated = {
        ...prev,
        teacher: {
          ...prev.teacher,
          [key]: value,
        },
      };
      saveSingletonConfig(COLLECTIONS.ROLE_PERMISSIONS, 'matrix', updated);
      return updated;
    });
  };

  const updateStaffPermission = <K extends keyof RolePermissions['staff']>(key: K, value: boolean) => {
    setRolePermissions(prev => {
      const updated = {
        ...prev,
        staff: {
          ...prev.staff,
          [key]: value,
        },
      };
      saveSingletonConfig(COLLECTIONS.ROLE_PERMISSIONS, 'matrix', updated);
      return updated;
    });
  };

  const resetRolePermissions = () => {
    setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
    saveSingletonConfig(COLLECTIONS.ROLE_PERMISSIONS, 'matrix', DEFAULT_ROLE_PERMISSIONS);
    localStorage.removeItem('ugs_role_permissions');
    showToast('Role permissions reset to default access matrix.');
  };

  const activeStudent = students.find(s => s.id === activeStudentId) || students[0];

  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused', date: string = TODAY_DATE) => {
    let savedRecord: AttendanceRecord | null = null;
    setAttendanceRecords(prev => {
      const existingIdx = prev.findIndex(r => r.studentId === studentId && r.date === date);
      const student = students.find(s => s.id === studentId);
      if (!student) return prev;

      if (existingIdx >= 0) {
        const updated = [...prev];
        const rec = {
          ...updated[existingIdx],
          status,
        };
        updated[existingIdx] = rec;
        savedRecord = rec;
        return updated;
      } else {
        const newRecord: AttendanceRecord = {
          id: `att-${studentId}-${date}-${Date.now()}`,
          date,
          studentId,
          studentName: student.name,
          grade: student.grade,
          section: student.section,
          rollNo: student.rollNo,
          status,
        };
        savedRecord = newRecord;
        return [newRecord, ...prev];
      }
    });

    if (savedRecord) {
      saveDocument(COLLECTIONS.ATTENDANCE, savedRecord);
    }

    // Update student's attendance percentage slightly based on status
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          const delta = status === 'present' ? 0.3 : status === 'late' ? 0.1 : -0.8;
          const newRate = Math.min(100, Math.max(0, +(s.attendanceRate + delta).toFixed(1)));
          const updatedStudent = { ...s, attendanceRate: newRate };
          saveDocument(COLLECTIONS.STUDENTS, updatedStudent);
          return updatedStudent;
        }
        return s;
      })
    );

    const sName = students.find(s => s.id === studentId)?.name || 'Student';
    showToast(`Attendance marked as ${status.toUpperCase()} for ${sName}`);
  };

  const bulkMarkAttendance = (grade: string, section: string, status: 'present' | 'absent', date: string = TODAY_DATE) => {
    const classStudents = students.filter(s => s.grade === grade && s.section === section);
    if (classStudents.length === 0) return;

    setAttendanceRecords(prev => {
      const nonClassRecords = prev.filter(r => !(r.grade === grade && r.section === section && r.date === date));
      const newClassRecords: AttendanceRecord[] = classStudents.map(s => {
        const rec: AttendanceRecord = {
          id: `att-${s.id}-${date}`,
          date,
          studentId: s.id,
          studentName: s.name,
          grade: s.grade,
          section: s.section,
          rollNo: s.rollNo,
          status,
        };
        saveDocument(COLLECTIONS.ATTENDANCE, rec);
        return rec;
      });
      return [...newClassRecords, ...nonClassRecords];
    });

    showToast(`Marked all ${classStudents.length} students in ${grade} (${section}) as ${status.toUpperCase()}`);
  };

  const recordPayment = (paymentData: Omit<FeeTransaction, 'id' | 'receiptNo'>): FeeTransaction => {
    const receiptNum = `UGS-2026-FEE-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTxn: FeeTransaction = {
      ...paymentData,
      id: `txn-${Date.now()}`,
      receiptNo: receiptNum,
    };

    setTransactions(prev => [newTxn, ...prev]);
    saveDocument(COLLECTIONS.TRANSACTIONS, newTxn);

    // Update student pending fee and feeStatus
    setStudents(prev =>
      prev.map(s => {
        if (s.id === paymentData.studentId) {
          const newPaid = s.paidFee + paymentData.amount;
          const newPending = Math.max(0, s.totalFee - newPaid);
          const newStatus = newPending === 0 ? 'paid' : newPaid > 0 ? 'partial' : 'pending';
          const updatedStudent: Student = {
            ...s,
            paidFee: newPaid,
            pendingFee: newPending,
            feeStatus: newStatus,
          };
          saveDocument(COLLECTIONS.STUDENTS, updatedStudent);
          return updatedStudent;
        }
        return s;
      })
    );

    showToast(`Fee payment of ₹${paymentData.amount.toLocaleString('en-IN')} recorded successfully! Receipt: ${receiptNum}`);
    return newTxn;
  };

  const addAnnouncement = (newAnn: Omit<Announcement, 'id'>) => {
    const ann: Announcement = {
      ...newAnn,
      id: `ann-${Date.now()}`,
    };
    setAnnouncements(prev => [ann, ...prev]);
    saveDocument(COLLECTIONS.ANNOUNCEMENTS, ann);
    showToast('School announcement published successfully.');
  };

  const registerNewStudent = (studentData: Partial<Student>): Student => {
    const count = students.length + 1;
    const newStudent: Student = {
      id: `std-${100 + count}`,
      admissionNo: studentData.admissionNo?.trim() || `UGS/2026/${100 + count}`,
      name: studentData.name || 'New Enrolled Student',
      guardianName: studentData.guardianName || 'Guardian',
      phone: studentData.phone || '+91 94350 00000',
      email: studentData.email || 'student@unitedglobalschool.edu.in',
      grade: studentData.grade || 'Class 9',
      section: studentData.section || 'A',
      rollNo: studentData.rollNo || count,
      dob: studentData.dob || '2011-01-01',
      address: studentData.address || 'Rupahi Town, Nagaon, Assam',
      bloodGroup: studentData.bloodGroup || 'B+',
      avatar: studentData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${studentData.name || 'New'}`,
      attendanceRate: 100,
      feeStatus: 'pending',
      totalFee: 38000,
      paidFee: 0,
      pendingFee: 38000,
      house: 'Emerald',
      mentorTeacher: 'Teacher XYZ 01',
      ...studentData,
    };

    setStudents(prev => [newStudent, ...prev]);
    saveDocument(COLLECTIONS.STUDENTS, newStudent);
    showToast(`Admission enrolled: ${newStudent.name} (Adm No: ${newStudent.admissionNo})`);
    return newStudent;
  };

  const updateStudent = (studentId: string, studentData: Partial<Student>) => {
    let updatedStudent: Student | null = null;
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const total = studentData.totalFee !== undefined ? Number(studentData.totalFee) : s.totalFee;
        const paid = studentData.paidFee !== undefined ? Number(studentData.paidFee) : s.paidFee;
        const pending = Math.max(0, total - paid);
        const status = pending === 0 ? 'paid' : (paid > 0 ? 'partial' : 'pending');
        
        const updated: Student = {
          ...s,
          ...studentData,
          totalFee: total,
          paidFee: paid,
          pendingFee: pending,
          feeStatus: status,
        };
        updatedStudent = updated;
        return updated;
      }
      return s;
    }));
    if (updatedStudent) {
      saveDocument(COLLECTIONS.STUDENTS, updatedStudent);
    }
    showToast(`Student record for ${studentData.name || 'student'} updated successfully.`);
  };

  const addTeacher = (teacherData: Partial<Teacher>): Teacher => {
    const count = teachers.length + 1;
    const newTeacher: Teacher = {
      id: `tch-${Date.now()}`,
      empId: teacherData.empId || `UGS-T-0${30 + count}`,
      name: teacherData.name || 'New Faculty Member',
      designation: teacherData.designation || 'Lecturer & Mentor',
      subject: teacherData.subject || 'General Sciences',
      assignedClasses: teacherData.assignedClasses || ['Class 9', 'Class 10'],
      phone: teacherData.phone || '+91 94350 00000',
      email: teacherData.email || 'faculty@unitedglobalschool.edu.in',
      qualification: teacherData.qualification || 'M.Sc., B.Ed.',
      experience: teacherData.experience || '5 Years',
      salary: teacherData.salary || 50000,
      salaryStatus: 'pending',
      lastSalaryDate: undefined,
      attendanceRate: 100,
      attendanceStatus: 'present',
      joiningDate: teacherData.joiningDate || TODAY_DATE,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${teacherData.name || 'Faculty'}`,
      bloodGroup: teacherData.bloodGroup || 'B+',
      ...teacherData,
    };
    setTeachers(prev => [newTeacher, ...prev]);
    saveDocument(COLLECTIONS.TEACHERS, newTeacher);
    showToast(`Faculty onboarded: ${newTeacher.name} (Emp ID: ${newTeacher.empId})`);
    return newTeacher;
  };

  const markTeacherAttendance = (teacherId: string, status: 'present' | 'absent' | 'on_duty' | 'leave') => {
    setTeachers(prev =>
      prev.map(t => {
        if (t.id === teacherId) {
          const delta = status === 'present' ? 0.2 : status === 'on_duty' ? 0.1 : -0.5;
          const newRate = Math.min(100, Math.max(0, +(t.attendanceRate + delta).toFixed(1)));
          const updated = { ...t, attendanceStatus: status, attendanceRate: newRate };
          saveDocument(COLLECTIONS.TEACHERS, updated);
          return updated;
        }
        return t;
      })
    );
    const tName = teachers.find(t => t.id === teacherId)?.name || 'Teacher';
    showToast(`Faculty Attendance: ${status.toUpperCase()} recorded for ${tName}`);
  };

  const disburseTeacherSalary = (teacherId: string) => {
    setTeachers(prev =>
      prev.map(t => {
        if (t.id === teacherId) {
          const updated: Teacher = { ...t, salaryStatus: 'paid', lastSalaryDate: TODAY_DATE };
          saveDocument(COLLECTIONS.TEACHERS, updated);
          return updated;
        }
        return t;
      })
    );
    const teacher = teachers.find(t => t.id === teacherId);
    showToast(`Salary disbursed: ₹${teacher?.salary.toLocaleString('en-IN')} to ${teacher?.name} (Status: PAID)`);
  };

  const addStaff = (staffData: Partial<Staff>): Staff => {
    const count = staff.length + 1;
    const newStaff: Staff = {
      id: `stf-${Date.now()}`,
      empId: staffData.empId || `UGS-ADM-0${20 + count}`,
      name: staffData.name || 'New Staff Member',
      role: staffData.role || 'Campus Support Executive',
      department: staffData.department || 'Administration',
      phone: staffData.phone || '+91 94350 00000',
      email: staffData.email || 'staff@unitedglobalschool.edu.in',
      salary: staffData.salary || 32000,
      salaryStatus: 'pending',
      lastSalaryDate: undefined,
      shift: staffData.shift || 'General Day Shift',
      attendanceStatus: 'present',
      joiningDate: staffData.joiningDate || TODAY_DATE,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${staffData.name || 'Staff'}`,
      zone: staffData.zone || 'Administrative Hub',
      ...staffData,
    };
    setStaff(prev => [newStaff, ...prev]);
    saveDocument(COLLECTIONS.STAFF, newStaff);
    showToast(`Staff registered: ${newStaff.name} (Emp ID: ${newStaff.empId})`);
    return newStaff;
  };

  const markStaffAttendance = (staffId: string, status: 'present' | 'absent' | 'leave') => {
    setStaff(prev =>
      prev.map(s => {
        if (s.id === staffId) {
          const updated = { ...s, attendanceStatus: status };
          saveDocument(COLLECTIONS.STAFF, updated);
          return updated;
        }
        return s;
      })
    );
    const sName = staff.find(s => s.id === staffId)?.name || 'Staff';
    showToast(`Staff Attendance: ${status.toUpperCase()} recorded for ${sName}`);
  };

  const disburseStaffSalary = (staffId: string) => {
    setStaff(prev =>
      prev.map(s => {
        if (s.id === staffId) {
          const updated: Staff = { ...s, salaryStatus: 'paid', lastSalaryDate: TODAY_DATE };
          saveDocument(COLLECTIONS.STAFF, updated);
          return updated;
        }
        return s;
      })
    );
    const member = staff.find(s => s.id === staffId);
    showToast(`Wage disbursed: ₹${member?.salary.toLocaleString('en-IN')} to ${member?.name} (Status: PAID)`);
  };

  const addAdministrator = (adminData: Partial<Administrator>): Administrator => {
    const count = administrators.length + 1;
    const newAdmin: Administrator = {
      id: `adm-${Date.now()}`,
      empId: adminData.empId || `UGS-EXEC-00${count + 4}`,
      name: adminData.name || 'New Administrator',
      role: adminData.role || 'Executive Officer',
      accessLevel: adminData.accessLevel || 'Academic Admin',
      phone: adminData.phone || '+91 94350 00000',
      email: adminData.email || 'admin@unitedglobalschool.edu.in',
      qualification: adminData.qualification || 'Post Graduate in Educational Administration',
      status: 'active',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${adminData.name || 'Admin'}`,
      joiningDate: adminData.joiningDate || TODAY_DATE,
      securityClearance: adminData.securityClearance || 'Level-4 (Administrative Directorate)',
      ...adminData,
    };
    setAdministrators(prev => [newAdmin, ...prev]);
    saveDocument(COLLECTIONS.ADMINISTRATORS, newAdmin);
    showToast(`Administrator appointed: ${newAdmin.name} (${newAdmin.role})`);
    return newAdmin;
  };

  const updateSiteConfig = (config: Partial<SchoolWebsiteConfig>) => {
    setSiteConfig(prev => {
      const updated = { ...prev, ...config };
      saveSingletonConfig(COLLECTIONS.SITE_CONFIG, 'current', updated);
      return updated;
    });
    showToast('Website configurations saved and applied!');
  };

  const deleteStudent = (studentId: string) => {
    const st = students.find(s => s.id === studentId);
    setStudents(prev => prev.filter(s => s.id !== studentId));
    removeDocument(COLLECTIONS.STUDENTS, studentId);
    showToast(`Student record removed: ${st?.name || studentId}`);
  };

  const updateTeacher = (teacherId: string, data: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => {
      if (t.id === teacherId) {
        const updated = { ...t, ...data };
        saveDocument(COLLECTIONS.TEACHERS, updated);
        return updated;
      }
      return t;
    }));
    showToast(`Faculty record updated: ${data.name || 'Teacher'}`);
  };

  const deleteTeacher = (teacherId: string) => {
    const t = teachers.find(item => item.id === teacherId);
    setTeachers(prev => prev.filter(item => item.id !== teacherId));
    removeDocument(COLLECTIONS.TEACHERS, teacherId);
    showToast(`Faculty member removed: ${t?.name || teacherId}`);
  };

  const updateAnnouncement = (announcementId: string, data: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(a => {
      if (a.id === announcementId) {
        const updated = { ...a, ...data };
        saveDocument(COLLECTIONS.ANNOUNCEMENTS, updated);
        return updated;
      }
      return a;
    }));
    showToast('Circular notice updated.');
  };

  const deleteAnnouncement = (announcementId: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== announcementId));
    removeDocument(COLLECTIONS.ANNOUNCEMENTS, announcementId);
    showToast('Circular notice deleted.');
  };

  const updateStaff = (staffId: string, data: Partial<Staff>) => {
    setStaff(prev => prev.map(s => {
      if (s.id === staffId) {
        const updated = { ...s, ...data };
        saveDocument(COLLECTIONS.STAFF, updated);
        return updated;
      }
      return s;
    }));
    showToast(`Staff profile updated: ${data.name || 'Staff'}`);
  };

  const deleteStaff = (staffId: string) => {
    setStaff(prev => prev.filter(s => s.id !== staffId));
    removeDocument(COLLECTIONS.STAFF, staffId);
    showToast('Staff member removed.');
  };

  const addTopper = (data: Partial<ClassTopper>): ClassTopper => {
    const newTopper: ClassTopper = {
      id: `top-${Date.now()}`,
      name: data.name || 'Student Titan',
      admissionNo: data.admissionNo || `UGS/2026/${Math.floor(100 + Math.random() * 900)}`,
      grade: data.grade || 'Class 10',
      section: data.section || 'A',
      scorePercentage: data.scorePercentage ?? 98.5,
      rankBadge: data.rankBadge || 'CBSE Distinction Honors',
      stream: data.stream || 'Science & Tech',
      house: data.house || 'Sapphire',
      avatar: data.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${data.name || 'Topper'}`,
      mentor: data.mentor || 'Teacher XYZ 01',
      highlights: data.highlights && data.highlights.length > 0 ? data.highlights : ['Outstanding Academic Distinction'],
      boardYear: data.boardYear || '2026 Board Exams',
      category: data.category || 'Class 10 Distinction',
    };
    setToppers(prev => [newTopper, ...prev]);
    saveDocument(COLLECTIONS.TOPPERS, newTopper);
    showToast(`Class Topper added: ${newTopper.name}`);
    return newTopper;
  };

  const updateTopper = (id: string, data: Partial<ClassTopper>) => {
    setToppers(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...data };
        saveDocument(COLLECTIONS.TOPPERS, updated);
        return updated;
      }
      return t;
    }));
    showToast('Topper profile updated successfully.');
  };

  const deleteTopper = (id: string) => {
    const t = toppers.find(item => item.id === id);
    setToppers(prev => prev.filter(item => item.id !== id));
    removeDocument(COLLECTIONS.TOPPERS, id);
    showToast(`Topper removed: ${t?.name || id}`);
  };

  const addUserCredential = (data: Partial<UserCredential>): UserCredential => {
    const newCred: UserCredential = {
      id: `cred-${Date.now()}`,
      name: data.name || 'New Staff Member',
      username: data.username || `ugs.user.${Date.now().toString().slice(-4)}`,
      password: data.password || `UGS@Pass${Math.floor(1000 + Math.random() * 9000)}`,
      role: data.role || 'teacher',
      department: data.department || 'Academic Department',
      email: data.email || 'user@unitedglobalschool.edu.in',
      phone: data.phone || '+91 94350 00000',
      status: data.status || 'active',
      clearanceLevel: data.clearanceLevel || 'Level 2: Operational Clearance',
      issuedDate: data.issuedDate || TODAY_DATE,
      lastLogin: undefined,
      permissions: data.permissions || {
        canMarkAttendance: true,
        canEditGradebook: false,
        canCollectFees: false,
        canViewDefaulters: false,
        canManageCirculars: false,
        canEditWebsite: false,
        canAccessStudentRecords: true,
        canPrintIdCards: false,
        canDisburseSalaries: false,
      },
      notes: data.notes || '',
      ...data,
    };
    setUserCredentials(prev => [newCred, ...prev]);
    saveDocument(COLLECTIONS.USER_CREDENTIALS, newCred);
    showToast(`User credential issued: ${newCred.name} (@${newCred.username})`);
    return newCred;
  };

  const updateUserCredential = (id: string, data: Partial<UserCredential>) => {
    setUserCredentials(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, ...data };
        saveDocument(COLLECTIONS.USER_CREDENTIALS, updated);
        return updated;
      }
      return c;
    }));
    showToast('User credentials and access permissions updated.');
  };

  const deleteUserCredential = (id: string) => {
    const cred = userCredentials.find(c => c.id === id);
    setUserCredentials(prev => prev.filter(c => c.id !== id));
    removeDocument(COLLECTIONS.USER_CREDENTIALS, id);
    showToast(`Access clearance revoked for ${cred?.name || id}`);
  };

  const resetToDefaults = () => {
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setStaff(INITIAL_STAFF);
    setAdministrators(INITIAL_ADMINISTRATORS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setToppers(INITIAL_TOPPERS);
    setSiteConfig(DEFAULT_SITE_CONFIG);
    setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
    setUserCredentials(INITIAL_USER_CREDENTIALS);
    localStorage.removeItem('ugs_students');
    localStorage.removeItem('ugs_teachers');
    localStorage.removeItem('ugs_staff');
    localStorage.removeItem('ugs_admins');
    localStorage.removeItem('ugs_announcements');
    localStorage.removeItem('ugs_toppers');
    localStorage.removeItem('ugs_site_config');
    localStorage.removeItem('ugs_role_permissions');
    localStorage.removeItem('ugs_user_credentials');

    // Re-seed Firestore defaults
    saveSingletonConfig(COLLECTIONS.SITE_CONFIG, 'current', DEFAULT_SITE_CONFIG);
    saveSingletonConfig(COLLECTIONS.ROLE_PERMISSIONS, 'matrix', DEFAULT_ROLE_PERMISSIONS);
    showToast('All website customizations and permissions reset to factory defaults.');
  };

  return (
    <SchoolContext.Provider
      value={{
        role,
        setRole,
        publicPage,
        setPublicPage,
        students,
        teachers,
        staff,
        administrators,
        attendanceRecords,
        transactions,
        announcements,
        achievements,
        toppers,
        addTopper,
        updateTopper,
        deleteTopper,
        siteConfig,
        updateSiteConfig,
        deleteStudent,
        updateTeacher,
        deleteTeacher,
        updateAnnouncement,
        deleteAnnouncement,
        deleteStaff,
        updateStaff,
        resetToDefaults,
        activeStudent,
        setActiveStudentId,
        markAttendance,
        bulkMarkAttendance,
        recordPayment,
        addAnnouncement,
        selectedReceipt,
        openReceiptModal: (txn) => setSelectedReceipt(txn),
        closeReceiptModal: () => setSelectedReceipt(null),
        isAdmissionModalOpen,
        openAdmissionModal: () => setIsAdmissionModalOpen(true),
        closeAdmissionModal: () => setIsAdmissionModalOpen(false),
        isOfflineAdmissionModalOpen,
        openOfflineAdmissionModal: () => setIsOfflineAdmissionModalOpen(true),
        closeOfflineAdmissionModal: () => setIsOfflineAdmissionModalOpen(false),
        isPrincipalAppointmentModalOpen,
        openPrincipalAppointmentModal: () => setIsPrincipalAppointmentModalOpen(true),
        closePrincipalAppointmentModal: () => setIsPrincipalAppointmentModalOpen(false),
        isDonateModalOpen,
        openDonateModal: () => setIsDonateModalOpen(true),
        closeDonateModal: () => setIsDonateModalOpen(false),
        registerNewStudent,
        updateStudent,
        addTeacher,
        markTeacherAttendance,
        disburseTeacherSalary,
        addStaff,
        markStaffAttendance,
        disburseStaffSalary,
        addAdministrator,
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast,
        publicGalleryTab,
        setPublicGalleryTab,
        openPublicGallery,
        rolePermissions,
        updateTeacherPermission,
        updateStaffPermission,
        resetRolePermissions,
        userCredentials,
        addUserCredential,
        updateUserCredential,
        deleteUserCredential,
        firebaseConnected,
        isFullscreen,
        toggleFullscreen,
        isLeaveScreenView,
        toggleLeaveScreenView,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
