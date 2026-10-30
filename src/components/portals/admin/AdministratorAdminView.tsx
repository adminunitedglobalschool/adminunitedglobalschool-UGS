import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { Administrator } from '../../../types/school';
import { IdCardRenderer } from './IdCardRenderer';
import { PvcSheetPrintView } from './PvcSheetPrintView';
import { 
  ShieldCheck, 
  UserPlus, 
  Award, 
  Key, 
  Lock, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Phone, 
  Mail, 
  FileText,
  Building,
  Activity,
  Layers
} from 'lucide-react';

export const AdministratorAdminView: React.FC = () => {
  const { 
    administrators, 
    addAdministrator, 
    showToast 
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<'cabinet' | 'appoint' | 'idcard' | 'governance' | 'pvc-sheet'>('cabinet');
  const [selectedAdminForCard, setSelectedAdminForCard] = useState<Administrator>(administrators[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // New Admin Appoint State
  const [formData, setFormData] = useState({
    name: '',
    empId: '',
    role: 'Vice Principal & Academic Dean',
    accessLevel: 'Super Admin' as 'Super Admin' | 'Academic Admin' | 'Finance Admin',
    phone: '',
    email: '',
    qualification: 'M.A., M.Ed., Ph.D.',
    securityClearance: 'Level-5 (Full Master Access)',
    joiningDate: '2026-10-10',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredAdmins = administrators.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.accessLevel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAppointSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast('Please enter administrator name and contact phone.');
      return;
    }

    setIsSubmitting(true);
    const newAdmin = addAdministrator({
      name: formData.name,
      empId: formData.empId || `UGS-EXEC-00${administrators.length + 5}`,
      role: formData.role,
      accessLevel: formData.accessLevel,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@unitedglobalschool.edu.in`,
      qualification: formData.qualification,
      securityClearance: formData.securityClearance,
      joiningDate: formData.joiningDate,
    });

    setIsSubmitting(false);
    setSelectedAdminForCard(newAdmin);
    setActiveSubTab('idcard');
    showToast(`Administrator appointed: ${newAdmin.name} (${newAdmin.role})! Access badge opened.`);
  };

  const auditEvents = [
    { time: '10 Oct 2026 09:14 AM', actor: 'Principal ABC', action: 'Approved Term 3 Fee Concession Batch', level: 'Level-5' },
    { time: '10 Oct 2026 08:32 AM', actor: 'Teacher XYZ 01', action: 'Biometric Attendance Scanner Synchronized', level: 'Level-4' },
    { time: '09 Oct 2026 04:15 PM', actor: 'Admin XYZ 03', action: 'Campus Fiber Network Security Backup Created', level: 'Level-5' },
    { time: '09 Oct 2026 11:20 AM', actor: 'Admin XYZ 02', action: 'CBSE Pre-Board Assessment Schedule Locked', level: 'Level-4' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Sub-Navigation Switchers */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveSubTab('cabinet')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'cabinet'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Executive Cabinet ({administrators.length})
          </button>

          <button
            onClick={() => setActiveSubTab('appoint')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'appoint'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Appoint Executive
          </button>

          <button
            onClick={() => setActiveSubTab('governance')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'governance'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4" />
            Security & Governance
          </button>

          <button
            onClick={() => setActiveSubTab('idcard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'idcard'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            Access Badges
          </button>

          <button
            onClick={() => setActiveSubTab('pvc-sheet')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'pvc-sheet'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold shadow-md shadow-purple-600/30'
                : 'bg-slate-950 border border-purple-500/40 text-purple-300 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            9-PVC A4 Sheet Print
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: APPOINT EXECUTIVE */}
      {activeSubTab === 'appoint' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-400" />
                Appoint School Executive / Administrator
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Grants high-level administrative governance, cryptographic access badges, and system management privileges
              </p>
            </div>
            <button
              onClick={() => setActiveSubTab('cabinet')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel & View Cabinet
            </button>
          </div>

          <form onSubmit={handleAppointSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Executive Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Principal ABC"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Executive ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. UGS-EXEC-005"
                  value={formData.empId}
                  onChange={e => setFormData({ ...formData, empId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Directorate Role / Portfolio *
                </label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="Principal & Executive Director">Principal & Executive Director</option>
                  <option value="Vice Principal & Academic Dean">Vice Principal & Academic Dean</option>
                  <option value="Controller of Examinations">Controller of Examinations & CBSE Liaison</option>
                  <option value="Chief Technology Officer">Chief Technology Officer & Digital Campus Head</option>
                  <option value="Director of Physical Education & Athletics">Director of Physical Education & Athletics</option>
                  <option value="Chief Financial Officer & Bursar">Chief Financial Officer & Bursar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Access Level Clearance *
                </label>
                <select
                  value={formData.accessLevel}
                  onChange={e => setFormData({ ...formData, accessLevel: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="Super Admin">Super Admin (Master System Control)</option>
                  <option value="Academic Admin">Academic Admin (Admissions & Faculty)</option>
                  <option value="Finance Admin">Finance Admin (Fee Ledgers & Payroll)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 94350 XXXXX"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Executive Email
                </label>
                <input
                  type="email"
                  placeholder="executive@unitedglobalschool.edu.in"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Credentials & Qualifications
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ph.D. in Educational Leadership"
                  value={formData.qualification}
                  onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Security Clearance Level
                </label>
                <input
                  type="text"
                  value={formData.securityClearance}
                  onChange={e => setFormData({ ...formData, securityClearance: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={e => setFormData({ ...formData, joiningDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveSubTab('cabinet')}
                className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Appoint Administrator & Issue Badge
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-VIEW 2: EXECUTIVE ID ACCESS BADGE */}
      {activeSubTab === 'idcard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-5 space-y-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Select Administrator for Badge
              </span>
              <span className="text-[10px] text-purple-400 font-mono">
                EXECUTIVE PASS
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Select from Executive Officers:
              </label>
              <select
                value={selectedAdminForCard.id}
                onChange={e => {
                  const found = administrators.find(a => a.id === e.target.value);
                  if (found) setSelectedAdminForCard(found);
                }}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
              >
                {administrators.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.empId} · {a.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Admin Telemetry */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Executive Name:</span>
                <span className="text-white font-bold">{selectedAdminForCard.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Employee ID:</span>
                <span className="font-mono text-purple-400 font-bold">{selectedAdminForCard.empId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Portfolio:</span>
                <span className="text-slate-200">{selectedAdminForCard.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Access Privilege:</span>
                <span className="font-bold text-amber-400">{selectedAdminForCard.accessLevel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Clearance:</span>
                <span className="text-slate-300 font-mono text-[11px]">{selectedAdminForCard.securityClearance}</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Gold holographic crest for executive cabinet identification</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Authorizes central database lock/unlock protocol</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col items-center p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="text-xs font-mono text-slate-400 mb-4 tracking-wider uppercase">
              Official Executive Directorate Access Pass Preview
            </div>

            <IdCardRenderer
              data={{
                type: 'administrator',
                id: selectedAdminForCard.id,
                code: selectedAdminForCard.empId,
                name: selectedAdminForCard.name,
                roleOrGrade: selectedAdminForCard.role,
                departmentOrHouse: `${selectedAdminForCard.accessLevel} · ${selectedAdminForCard.securityClearance}`,
                phone: selectedAdminForCard.phone,
                email: selectedAdminForCard.email,
                avatar: selectedAdminForCard.avatar,
                validThrough: 'Permanent Directorate Clearance',
                zoneOrRoll: `ACCESS: ${selectedAdminForCard.accessLevel.toUpperCase()}`,
              }}
              onPrint={() => {
                showToast(`Printing Executive Access Badge for ${selectedAdminForCard.name}...`);
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

      {/* SUB-VIEW 3: SECURITY & GOVERNANCE */}
      {activeSubTab === 'governance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 space-y-6">
            {/* RBAC Matrix */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-400" />
                Role-Based Access Control (RBAC) Governance
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-3">System Domain</th>
                      <th className="py-2.5 px-3 text-center">Super Admin</th>
                      <th className="py-2.5 px-3 text-center">Academic Admin</th>
                      <th className="py-2.5 px-3 text-center">Finance Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">Student Enrollment & ID Card Generation</td>
                      <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">FULL</td>
                      <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">FULL</td>
                      <td className="py-2.5 px-3 text-center text-slate-500">VIEW ONLY</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">Faculty Onboarding & Teacher Payroll</td>
                      <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">FULL</td>
                      <td className="py-2.5 px-3 text-center text-slate-500">ATTENDANCE ONLY</td>
                      <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">FULL</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">Digital Fee Ledger & Instant Receipts</td>
                      <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">FULL</td>
                      <td className="py-2.5 px-3 text-center text-slate-500">READ ONLY</td>
                      <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">FULL</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">Administrator Appointments & Security Clearances</td>
                      <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">FULL</td>
                      <td className="py-2.5 px-3 text-center text-rose-400">NO ACCESS</td>
                      <td className="py-2.5 px-3 text-center text-rose-400">NO ACCESS</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Audit Trail Log */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Live System Audit & Security Trail
              </h3>

              <div className="space-y-3">
                {auditEvents.map((evt, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-white font-medium">{evt.action}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">By <strong>{evt.actor}</strong> · {evt.time}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      {evt.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Institutional Affiliations */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-400" />
                Official CBSE Affiliation Metadata
              </h3>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">CBSE Affiliation Code:</span>
                  <span className="font-mono text-white font-bold">UGS-AS-2026-89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">School U-DISE Code:</span>
                  <span className="font-mono text-cyan-400 font-bold">18100508901</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Campus Location:</span>
                  <span className="text-white">Rupahi Town, Assam</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Academic Session:</span>
                  <span className="text-emerald-400 font-semibold">2026–2027</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => showToast('Institution certificate exported successfully.')}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Export Affiliation Verification Dossier
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUB-VIEW 4: EXECUTIVE CABINET CARDS */}
      {activeSubTab === 'cabinet' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search executive by name or portfolio..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setActiveSubTab('appoint')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Appoint Executive
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAdmins.map(admin => (
              <div
                key={admin.id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all space-y-4 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 p-0.5 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                        <img 
                          src={admin.avatar} 
                          alt={admin.name} 
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                          {admin.name}
                        </h4>
                        <div className="text-xs font-mono text-purple-400">
                          {admin.empId}
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      {admin.accessLevel}
                    </span>
                  </div>

                  <div className="mt-4 text-xs font-bold text-slate-200">
                    {admin.role}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Clearance Level:</span>
                      <span className="text-white font-mono font-semibold">{admin.securityClearance}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Status:</span>
                      <span className="text-emerald-400 font-bold uppercase">{admin.status}</span>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-slate-400 space-y-1">
                    <div className="truncate">Credentials: <strong className="text-slate-300">{admin.qualification}</strong></div>
                    <div className="truncate">Contact: <strong className="text-slate-300">{admin.phone}</strong></div>
                    <div className="truncate">Official Email: <strong className="text-slate-300">{admin.email}</strong></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedAdminForCard(admin);
                      setActiveSubTab('idcard');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Access Badge
                  </button>

                  <span className="text-[11px] text-slate-500">
                    Joined: {admin.joiningDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
