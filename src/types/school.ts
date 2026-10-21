export type UserRole = 'public' | 'admin' | 'teacher' | 'student' | 'staff' | 'settings';

export type PublicPage = 'home' | 'campus' | 'success' | 'fees' | 'circulars';

export interface SchoolWebsiteConfig {
  schoolName: string;
  tagline: string;
  affiliationCode: string;
  udiseCode: string;
  campusLocation: string;
  address: string;
  pinCode: string;
  phone1: string;
  phone2: string;
  email: string;
  operatingHours: string;
  heroHeading: string;
  heroSubheading: string;
  admissionOpenText: string;
  bannerNotice: string;
}

export interface Student {
  id: string;
  admissionNo: string;
  name: string;
  guardianName: string;
  phone: string;
  email: string;
  grade: string; // e.g. "Class 10"
  section: string; // e.g. "A"
  rollNo: number;
  dob: string;
  address: string;
  bloodGroup: string;
  avatar: string;
  attendanceRate: number; // percentage e.g. 92.4
  feeStatus: 'paid' | 'pending' | 'overdue' | 'partial';
  totalFee: number;
  paidFee: number;
  pendingFee: number;
  house: 'Emerald' | 'Ruby' | 'Sapphire' | 'Topaz';
  mentorTeacher: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  rollNo: number;
  status: 'present' | 'absent' | 'late' | 'excused';
  remark?: string;
}

export interface FeeTransaction {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  grade: string;
  section: string;
  amount: number;
  date: string;
  paymentMethod: 'UPI' | 'Credit/Debit Card' | 'Net Banking' | 'Cash' | 'Cheque';
  transactionRef: string;
  term: 'Quarter 1' | 'Quarter 2' | 'Quarter 3' | 'Quarter 4' | 'Annual Package';
  breakdown: {
    tuitionFee: number;
    stemLabFee: number;
    sportsActivityFee: number;
    developmentFee: number;
    transportFee: number;
  };
  status: 'completed' | 'pending' | 'failed';
  collectedBy: string;
}

export interface Teacher {
  id: string;
  empId: string;
  name: string;
  designation: string;
  subject: string;
  assignedClasses: string[]; // e.g. ["10-A", "10-B", "9-A"]
  phone: string;
  email: string;
  qualification: string;
  experience: string;
  salary: number;
  salaryStatus: 'paid' | 'pending';
  lastSalaryDate?: string;
  attendanceRate: number;
  attendanceStatus: 'present' | 'absent' | 'on_duty' | 'leave';
  joiningDate: string;
  avatar: string;
  bloodGroup: string;
}

export interface Staff {
  id: string;
  empId: string;
  name: string;
  role: string;
  department: 'Accounts & Finance' | 'Administration' | 'Admissions' | 'Transport' | 'IT Support' | 'Campus Security' | 'Laboratories';
  phone: string;
  email: string;
  salary: number;
  salaryStatus: 'paid' | 'pending';
  lastSalaryDate?: string;
  shift: 'Morning Shift' | 'General Day Shift' | 'Transport Fleet Shift';
  attendanceStatus: 'present' | 'absent' | 'leave';
  joiningDate: string;
  avatar: string;
  zone: string;
}

export interface Administrator {
  id: string;
  empId: string;
  name: string;
  role: string;
  accessLevel: 'Super Admin' | 'Academic Admin' | 'Finance Admin';
  phone: string;
  email: string;
  qualification: string;
  status: 'active' | 'on_leave';
  avatar: string;
  joiningDate: string;
  securityClearance: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Academic' | 'Notice' | 'Sports' | 'Event' | 'Examination';
  date: string;
  content: string;
  targetRole: 'All' | 'Students' | 'Teachers' | 'Parents';
  isUrgent?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  studentName: string;
  grade: string;
  category: 'STEM & Robotics' | 'Academic' | 'Athletics & Sports' | 'Arts & Culture' | 'Leadership';
  description: string;
  year: string;
  badge: string;
}

export interface HolisticPillar {
  id: string;
  title: string;
  shortDesc: string;
  extendedDesc: string;
  metrics: { label: string; value: string }[];
  keyInitiatives: string[];
  color: string;
  iconName: string;
}

export interface TimetableEntry {
  period: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

export interface ExamScheduleItem {
  id: string;
  subject: string;
  subjectCode: string;
  date: string;
  day: string;
  timing: string;
  hallNumber: string;
  maxMarks: number;
}

export interface ExamSession {
  id: string;
  title: string;
  academicYear: string;
  term: string;
  examCenter: string;
  reportingTime: string;
  schedule: ExamScheduleItem[];
}

export interface SubjectMark {
  subject: string;
  subjectCode: string;
  theoryMarks: number;
  practicalMarks: number;
  maxMarks: number;
  grade: string;
  gradePoint: number;
}

export interface StudentResult {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  grade: string;
  section: string;
  rollNo: number;
  examTitle: string;
  academicYear: string;
  term: string;
  subjects: SubjectMark[];
  totalObtained: number;
  totalMax: number;
  percentage: number;
  overallGrade: string;
  cgpa: number;
  rank: number;
  resultStatus: 'Passed' | 'Passed with Distinction' | 'Compartment' | 'Failed';
  teacherRemarks: string;
  attendancePct: number;
  issueDate: string;
}

export interface ClassTopper {
  id: string;
  name: string;
  admissionNo: string;
  grade: string;
  section: string;
  scorePercentage: number;
  rankBadge: string;
  stream: string;
  house: 'Sapphire' | 'Emerald' | 'Ruby' | 'Topaz';
  avatar: string;
  mentor: string;
  highlights: string[];
  boardYear: string;
  category: 'Class 12 Titans' | 'Class 10 Distinction' | 'STEM & Robotics' | 'Junior Prodigy';
}

export interface TeacherPermissions {
  canMarkAttendance: boolean;
  canEditGradebook: boolean;
  canManageAssignments: boolean;
  canViewTimetable: boolean;
}

export interface StaffPermissions {
  canCollectFees: boolean;
  canViewDefaulters: boolean;
  canViewLedger: boolean;
}

export interface RolePermissions {
  teacher: TeacherPermissions;
  staff: StaffPermissions;
}

export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  teacher: {
    canMarkAttendance: true,
    canEditGradebook: true,
    canManageAssignments: true,
    canViewTimetable: true,
  },
  staff: {
    canCollectFees: true,
    canViewDefaulters: true,
    canViewLedger: true,
  },
};

export type UserAccessRole = 'teacher' | 'staff' | 'administrator' | 'accountant' | 'examination_head' | 'student';

export interface UserPermissionsMap {
  canMarkAttendance: boolean;
  canEditGradebook: boolean;
  canCollectFees: boolean;
  canViewDefaulters: boolean;
  canManageCirculars: boolean;
  canEditWebsite: boolean;
  canAccessStudentRecords: boolean;
  canPrintIdCards: boolean;
  canDisburseSalaries: boolean;
}

export interface UserCredential {
  id: string;
  name: string;
  username: string;
  password: string;
  role: UserAccessRole;
  department: string;
  email: string;
  phone: string;
  status: 'active' | 'suspended';
  clearanceLevel: string;
  issuedDate: string;
  lastLogin?: string;
  permissions: UserPermissionsMap;
  notes?: string;
}

