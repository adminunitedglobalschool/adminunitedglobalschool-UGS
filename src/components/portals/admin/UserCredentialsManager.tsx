import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { UserCredential, UserAccessRole, UserPermissionsMap } from '../../../types/school';
import { 
  Key, 
  ShieldCheck, 
  UserPlus, 
  Copy, 
  Check, 
  Trash2, 
  Edit3, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Search, 
  Filter, 
  Sparkles, 
  Users, 
  CreditCard, 
  BookOpen, 
  FileText, 
  Award, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Printer,
  X,
  Share2
} from 'lucide-react';

const DEFAULT_PERMISSIONS: Record<UserAccessRole, UserPermissionsMap> = {
  teacher: {
    canMarkAttendance: true,
    canEditGradebook: true,
    canCollectFees: false,
    canViewDefaulters: false,
    canManageCirculars: true,
    canEditWebsite: false,
    canAccessStudentRecords: true,
    canPrintIdCards: false,
    canDisburseSalaries: false,
  },
  staff: {
    canMarkAttendance: false,
    canEditGradebook: false,
    canCollectFees: true,
    canViewDefaulters: true,
    canManageCirculars: false,
    canEditWebsite: false,
    canAccessStudentRecords: true,
    canPrintIdCards: true,
    canDisburseSalaries: false,
  },
  accountant: {
    canMarkAttendance: false,
    canEditGradebook: false,
    canCollectFees: true,
    canViewDefaulters: true,
    canManageCirculars: false,
    canEditWebsite: false,
    canAccessStudentRecords: true,
    canPrintIdCards: true,
    canDisburseSalaries: true,
  },
  examination_head: {
    canMarkAttendance: true,
    canEditGradebook: true,
    canCollectFees: false,
    canViewDefaulters: false,
    canManageCirculars: true,
    canEditWebsite: false,
    canAccessStudentRecords: true,
    canPrintIdCards: true,
    canDisburseSalaries: false,
  },
  administrator: {
    canMarkAttendance: true,
    canEditGradebook: true,
    canCollectFees: true,
    canViewDefaulters: true,
    canManageCirculars: true,
    canEditWebsite: true,
    canAccessStudentRecords: true,
    canPrintIdCards: true,
    canDisburseSalaries: true,
  },
  student: {
    canMarkAttendance: false,
    canEditGradebook: false,
    canCollectFees: false,
    canViewDefaulters: false,
    canManageCirculars: false,
    canEditWebsite: false,
    canAccessStudentRecords: false,
    canPrintIdCards: false,
    canDisburseSalaries: false,
  }
};

const CLEARANCE_LEVELS: Record<UserAccessRole, string> = {
  teacher: 'Level 2: Academic Faculty',
  staff: 'Level 2: Operational Staff',
  accountant: 'Level 3: Finance & Treasury',
  examination_head: 'Level 3: Controller of Exams',
  administrator: 'Level 4: Directorate Executive',
  student: 'Level 1: Scholastic Access',
};

export const UserCredentialsManager: React.FC = () => {
  const { 
    userCredentials, 
    addUserCredential, 
    updateUserCredential, 
    deleteUserCredential,
    showToast 
  } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserAccessRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [slipModalUser, setSlipModalUser] = useState<UserCredential | null>(null);

  // Form Data
  const [formData, setFormData] = useState<{
    name: string;
    username: string;
    password: string;
    role: UserAccessRole;
    department: string;
    email: string;
    phone: string;
    status: 'active' | 'suspended';
    clearanceLevel: string;
    notes: string;
    permissions: UserPermissionsMap;
  }>({
    name: '',
    username: '',
    password: '',
    role: 'teacher',
    department: 'Science & Academic Faculty',
    email: '',
    phone: '',
    status: 'active',
    clearanceLevel: 'Level 2: Academic Faculty',
    notes: '',
    permissions: DEFAULT_PERMISSIONS.teacher,
  });

  // Generate strong random password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pass = 'UGS@';
    for (let i = 0; i < 4; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    pass += '#' + Math.floor(100 + Math.random() * 900);
    return pass;
  };

  // Open Create Form
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      username: '',
      password: generateRandomPassword(),
      role: 'teacher',
      department: 'Academic Faculty',
      email: '',
      phone: '',
      status: 'active',
      clearanceLevel: CLEARANCE_LEVELS.teacher,
      notes: '',
      permissions: { ...DEFAULT_PERMISSIONS.teacher },
    });
    setIsModalOpen(true);
  };

  // Open Edit Form
  const handleOpenEdit = (user: UserCredential) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      username: user.username,
      password: user.password,
      role: user.role,
      department: user.department,
      email: user.email,
      phone: user.phone,
      status: user.status,
      clearanceLevel: user.clearanceLevel,
      notes: user.notes || '',
      permissions: { ...user.permissions },
    });
    setIsModalOpen(true);
  };

  // Auto-generate username from name
  const handleGenerateUsername = () => {
    if (!formData.name.trim()) {
      showToast('Please enter full name first to generate username.');
      return;
    }
    const cleanName = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const prefix = formData.role === 'teacher' ? 'faculty' : formData.role === 'administrator' ? 'admin' : 'staff';
    const suggested = `ugs.${prefix}.${cleanName.slice(0, 10)}`;
    setFormData(prev => ({ ...prev, username: suggested }));
  };

  // Handle Role Change -> auto adjust permissions preset
  const handleRoleChange = (newRole: UserAccessRole) => {
    setFormData(prev => ({
      ...prev,
      role: newRole,
      clearanceLevel: CLEARANCE_LEVELS[newRole],
      permissions: { ...DEFAULT_PERMISSIONS[newRole] },
      department: newRole === 'teacher' ? 'Academic Department' :
                  newRole === 'accountant' ? 'Accounts & Treasury' :
                  newRole === 'examination_head' ? 'Examination & Assessment Cell' :
                  newRole === 'administrator' ? 'Executive Administration' : 'Campus Operations'
    }));
  };

  // Save User Credential
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.username.trim() || !formData.password.trim()) {
      showToast('Please provide Name, Username, and Password.');
      return;
    }

    if (editingId) {
      updateUserCredential(editingId, formData);
      showToast(`User credentials updated for ${formData.name}`);
    } else {
      addUserCredential(formData);
      showToast(`New credentials issued for ${formData.name}`);
    }
    setIsModalOpen(false);
  };

  // Copy full credentials card text to clipboard
  const handleCopyCredentials = (user: UserCredential) => {
    const text = `======================================
UNITED GLOBAL SCHOOL - CREDENTIAL CLEARANCE
======================================
User Name: ${user.name}
Assigned Role: ${user.role.toUpperCase()} (${user.clearanceLevel})
Department: ${user.department}
Login Username: ${user.username}
Password / Key: ${user.password}
Portal URL: ${window.location.origin}
Status: ${user.status.toUpperCase()}
Issued By: Directorate Executive Console
======================================`;

    navigator.clipboard.writeText(text);
    setCopiedId(user.id);
    showToast(`Credentials copied to clipboard for ${user.name}!`);
    setTimeout(() => {
      setCopiedId(prev => (prev === user.id ? null : prev));
    }, 2500);
  };

  // Filter users
  const filteredUsers = userCredentials.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeCount = userCredentials.filter(u => u.status === 'active').length;
  const suspendedCount = userCredentials.filter(u => u.status === 'suspended').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & Control Strip */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl space-y-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 via-cyan-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600/30 to-blue-600/20 border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.3)] shrink-0">
              <Key className="w-7 h-7 text-purple-400" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-400"></span>
                </span>
                <span className="text-[11px] font-mono tracking-widest uppercase text-purple-300 font-bold">
                  ADMINISTRATIVE CREDENTIAL & ACCESS ISSUANCE
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 font-mono text-[10px] font-bold">
                  FIREBASE CLOUD SYNC
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                User Access & Credential Provisioning Hub
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl font-normal">
                Direct administrator control to issue login usernames, secure passwords, and granular operational permissions for faculty, accounts, exam officers, and staff members.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Issue New User Credential</span>
            </button>
          </div>
        </div>

        {/* Aggregate Stats Strip */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono font-medium">
              Total Issued: <strong className="text-white">{userCredentials.length} Accounts</strong>
            </span>
            <span className="px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Active: {activeCount}
            </span>
            {suspendedCount > 0 && (
              <span className="px-3 py-1 rounded-lg bg-rose-950/80 border border-rose-500/30 text-rose-300 font-mono font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                Suspended: {suspendedCount}
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Admin Master Control: Only authorized root administrator can generate and revoke credentials</span>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user name, username, department, or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-purple-400" />
            <span>Role:</span>
          </div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Roles ({userCredentials.length})</option>
            <option value="teacher">Teachers</option>
            <option value="staff">Staff</option>
            <option value="accountant">Accountants</option>
            <option value="examination_head">Exam Controllers</option>
            <option value="administrator">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.map(user => {
          const isPassVisible = visiblePasswords[user.id];
          const isCopied = copiedId === user.id;
          const grantedCount = Object.values(user.permissions).filter(Boolean).length;

          return (
            <div 
              key={user.id}
              className={`p-5 rounded-3xl bg-slate-900 border transition-all duration-200 shadow-xl space-y-4 hover:border-purple-500/40 relative overflow-hidden ${
                user.status === 'suspended' ? 'border-rose-900/50 opacity-80' : 'border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 p-1 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{user.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                        user.status === 'active' 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' 
                          : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      @{user.username}
                    </div>
                    <div className="text-[11px] text-cyan-400 mt-0.5 font-medium">
                      {user.department}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setSlipModalUser(user)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-400 text-cyan-300 hover:text-white transition-colors"
                    title="View Clearance Slip"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(user)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-400 text-purple-300 hover:text-white transition-colors"
                    title="Edit Permissions"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Revoke and delete credentials for "${user.name}" (@${user.username})?`)) {
                        deleteUserCredential(user.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-400 text-rose-400 hover:text-white transition-colors"
                    title="Revoke Credential"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Credential Lockbox Strip */}
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">LOGIN CREDENTIALS:</span>
                  <button
                    onClick={() => setVisiblePasswords(prev => ({ ...prev, [user.id]: !prev[user.id] }))}
                    className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    {isPassVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{isPassVisible ? 'Hide Password' : 'Show Password'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Username</div>
                    <div className="text-slate-200 font-bold truncate">{user.username}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Access Passkey</div>
                    <div className="text-amber-300 font-bold truncate">
                      {isPassVisible ? user.password : '••••••••••••'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Clearance: <span className="text-slate-200 font-bold">{user.clearanceLevel}</span>
                  </span>
                  <button
                    onClick={() => handleCopyCredentials(user)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isCopied 
                        ? 'bg-emerald-500 text-slate-950 font-bold' 
                        : 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied Details!' : 'Copy Credentials'}</span>
                  </button>
                </div>
              </div>

              {/* Granular Permissions Tag Strip */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Active Clearance Rights:</span>
                  <span className="text-cyan-400 font-mono font-bold">{grantedCount}/9 Rights</span>
                </div>
                
                <div className="flex flex-wrap gap-1.5">
                  {user.permissions.canMarkAttendance && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-medium">
                      Attendance
                    </span>
                  )}
                  {user.permissions.canEditGradebook && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-medium">
                      Gradebook
                    </span>
                  )}
                  {user.permissions.canCollectFees && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-medium">
                      Collect Fees
                    </span>
                  )}
                  {user.permissions.canViewDefaulters && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-medium">
                      Defaulters
                    </span>
                  )}
                  {user.permissions.canManageCirculars && (
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-medium">
                      Circulars
                    </span>
                  )}
                  {user.permissions.canEditWebsite && (
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-medium">
                      Website CMS
                    </span>
                  )}
                  {user.permissions.canAccessStudentRecords && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] font-medium">
                      Student Roster
                    </span>
                  )}
                  {user.permissions.canPrintIdCards && (
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-medium">
                      Smart ID Cards
                    </span>
                  )}
                  {user.permissions.canDisburseSalaries && (
                    <span className="px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 text-[10px] font-medium">
                      Wages & Payroll
                    </span>
                  )}
                </div>
              </div>

              {/* Status Toggle Bar */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  Issued: {user.issuedDate}
                </span>

                <button
                  onClick={() => {
                    const newStatus = user.status === 'active' ? 'suspended' : 'active';
                    updateUserCredential(user.id, { status: newStatus });
                    showToast(`User status toggled to ${newStatus.toUpperCase()} for ${user.name}`);
                  }}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                    user.status === 'active'
                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {user.status === 'active' ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  <span>{user.status === 'active' ? 'Suspend Access' : 'Activate Access'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* MODAL: ISSUE / EDIT USER CREDENTIALS                      */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative my-8 animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    {editingId ? 'Modify User Credential & Permissions' : 'Issue New User Credential & Passkey'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Set login username, password, clearance tier, and specific operational rights.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              
              {/* Row 1: Name and Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Full Name of User *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Mukut Sharma or Sujata Roy"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    System Role Designation *
                  </label>
                  <select
                    value={formData.role}
                    onChange={e => handleRoleChange(e.target.value as UserAccessRole)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="teacher">Teacher / Academic Faculty</option>
                    <option value="staff">Operational & Campus Staff</option>
                    <option value="accountant">Fee Accountant & Cashier</option>
                    <option value="examination_head">Controller of Examinations</option>
                    <option value="administrator">Assistant Administrator / Vice Principal</option>
                    <option value="student">Student Representative / Head Prefect</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Username and Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-300">
                      Login Username *
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateUsername}
                      className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold"
                    >
                      Suggest Username
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ugs.faculty.mukut"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-300">
                      Password / Access Passkey *
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, password: generateRandomPassword() }))}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Randomize</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UGS@Pass2026"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Department, Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    placeholder="user@school.edu.in"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Contact Mobile
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 94350 00000"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Clearance Tier & Account Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Institutional Clearance Badge
                  </label>
                  <input
                    type="text"
                    value={formData.clearanceLevel}
                    onChange={e => setFormData({ ...formData, clearanceLevel: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-purple-300 font-medium focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Account Clearance Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="active">Active (Granted Access)</option>
                    <option value="suspended">Suspended (Access Revoked)</option>
                  </select>
                </div>
              </div>

              {/* Granular Permission Toggles Matrix */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    Granular Access Permissions Matrix
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const allOn: UserPermissionsMap = {
                          canMarkAttendance: true,
                          canEditGradebook: true,
                          canCollectFees: true,
                          canViewDefaulters: true,
                          canManageCirculars: true,
                          canEditWebsite: true,
                          canAccessStudentRecords: true,
                          canPrintIdCards: true,
                          canDisburseSalaries: true,
                        };
                        setFormData({ ...formData, permissions: allOn });
                      }}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      Check All
                    </button>
                    <span className="text-slate-600">·</span>
                    <button
                      type="button"
                      onClick={() => {
                        const allOff: UserPermissionsMap = {
                          canMarkAttendance: false,
                          canEditGradebook: false,
                          canCollectFees: false,
                          canViewDefaulters: false,
                          canManageCirculars: false,
                          canEditWebsite: false,
                          canAccessStudentRecords: false,
                          canPrintIdCards: false,
                          canDisburseSalaries: false,
                        };
                        setFormData({ ...formData, permissions: allOff });
                      }}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold"
                    >
                      Uncheck All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  
                  <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.permissions.canMarkAttendance}
                      onChange={e => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, canMarkAttendance: e.target.checked }
                      })}
                      className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span className="text-slate-200 font-medium">Daily Student Roll-Call Attendance</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.permissions.canEditGradebook}
                      onChange={e => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, canEditGradebook: e.target.checked }
                      })}
                      className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span className="text-slate-200 font-medium">Scholastic Gradebook & Marks</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.permissions.canCollectFees}
                      onChange={e => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, canCollectFees: e.target.checked }
                      })}
                      className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span className="text-slate-200 font-medium">Digital Fee Collection & Receipts</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.permissions.canViewDefaulters}
                      onChange={e => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, canViewDefaulters: e.target.checked }
                      })}
                      className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span className="text-slate-200 font-medium">Fee Defaulters & Ledger Audit</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.permissions.canAccessStudentRecords}
                      onChange={e => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, canAccessStudentRecords: e.target.checked }
                      })}
                      className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span className="text-slate-200 font-medium">Full Student Demographic Records</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.permissions.canManageCirculars}
                      onChange={e => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, canManageCirculars: e.target.checked }
                      })}
                      className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span className="text-slate-200 font-medium">Publish Notices & Circulars</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.permissions.canPrintIdCards}
                      onChange={e => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, canPrintIdCards: e.target.checked }
                      })}
                      className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span className="text-slate-200 font-medium">Issue Smart PVC Identity Cards</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.permissions.canEditWebsite}
                      onChange={e => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, canEditWebsite: e.target.checked }
                      })}
                      className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span className="text-slate-200 font-medium">Website Customization CMS</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 col-span-1 sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={formData.permissions.canDisburseSalaries}
                      onChange={e => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, canDisburseSalaries: e.target.checked }
                      })}
                      className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span className="text-slate-200 font-medium">Faculty & Staff Payroll / Salary Clearance</span>
                  </label>

                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Administrator Notes & Designation Brief
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Authorized to conduct quarter exams and manage lab attendance..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md"
                >
                  {editingId ? 'Update Credentials & Permissions' : 'Save & Issue Credentials'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: PRINTABLE CLEARANCE SLIP & CARD                    */}
      {/* ========================================================= */}
      {slipModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-cyan-400 font-mono tracking-widest uppercase">
                OFFICIAL CLEARANCE PASS SLIP
              </span>
              <button
                onClick={() => setSlipModalUser(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Futuristic Physical Slip Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-cyan-500/40 shadow-xl space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="text-white font-bold tracking-wider text-sm font-display">
                    UNITED GLOBAL SCHOOL
                  </div>
                  <div className="text-[10px] text-cyan-300">
                    Institutional Access Clearance Pass
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-bold">
                  UGS
                </div>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${slipModalUser.name}`}
                  alt={slipModalUser.name}
                  className="w-16 h-16 rounded-xl bg-slate-900 border border-cyan-500/30 p-1"
                />
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white">{slipModalUser.name}</div>
                  <div className="text-[11px] text-purple-400 font-semibold">{slipModalUser.clearanceLevel}</div>
                  <div className="text-[10px] text-slate-400">Dept: {slipModalUser.department}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">LOGIN ID:</span>
                  <span className="text-cyan-300 font-bold">{slipModalUser.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PASSKEY / PIN:</span>
                  <span className="text-amber-300 font-bold">{slipModalUser.password}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">STATUS:</span>
                  <span className="text-emerald-400 font-bold">{slipModalUser.status.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ISSUED DATE:</span>
                  <span className="text-slate-300">{slipModalUser.issuedDate}</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 text-center pt-1">
                Authorized by Root Administration Directorate · United Global School
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => handleCopyCredentials(slipModalUser)}
                className="flex-1 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Full Credentials</span>
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Clearance Slip</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
