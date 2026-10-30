import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { 
  X, 
  Printer, 
  FileText, 
  Download, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Clock, 
  Sparkles, 
  AlertCircle,
  Building2,
  FileCheck2,
  Calendar,
  School
} from 'lucide-react';

export const OfflineAdmissionModal: React.FC = () => {
  const { 
    isOfflineAdmissionModalOpen, 
    closeOfflineAdmissionModal, 
    openAdmissionModal,
    showToast 
  } = useSchool();
  const [activeTab, setActiveTab] = useState<'form' | 'checklist'>('form');

  if (!isOfflineAdmissionModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSwitchToOnline = () => {
    closeOfflineAdmissionModal();
    openAdmissionModal();
    showToast('Switched to Instant Online Admission Application.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-950/50 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="no-print p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-display text-white">
                  Offline Admission Form (2026–27)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold uppercase">
                  Official Application
                </span>
              </div>
              <p className="text-xs text-slate-400">
                United Global School · Rupahi Town, Nagaon, Assam
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / Download PDF</span>
              <span className="sm:hidden">Print</span>
            </button>
            <button
              onClick={closeOfflineAdmissionModal}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="no-print px-4 sm:px-6 pt-3 pb-2 bg-slate-900 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'form'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Printable Admission Form
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'checklist'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              Submission Desk & Required Documents
            </button>
          </div>

          <button
            onClick={handleSwitchToOnline}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors underline underline-offset-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Prefer instant online submission? Click here
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/50">
          {activeTab === 'form' ? (
            /* Printable Form Document Canvas */
            <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl max-w-3xl mx-auto print:max-w-none print:p-4 print:shadow-none font-sans text-xs sm:text-sm">
              {/* Institutional Header */}
              <div className="border-b-2 border-slate-900 pb-4 mb-4 text-center relative">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="w-16 h-16 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center shrink-0 border border-slate-800 shadow-md">
                    <School className="w-9 h-9" />
                  </div>
                  <div className="text-center flex-1">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-slate-600 font-bold">
                      CBSE CURRICULUM · RECOGNIZED ACADEMIC INSTITUTION
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950">
                      United Global School
                    </h1>
                    <p className="text-xs text-slate-700 font-medium">
                      Campus: Rupahi Town · Nagaon, Assam – 782125
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Tel: 03672-295001 / +91 94350 12345 · Email: admissions@unitedglobalschool.edu.in
                    </p>
                  </div>
                  {/* Passport Photo Attachment Box */}
                  <div className="w-24 h-28 border-2 border-dashed border-slate-400 rounded-lg flex flex-col items-center justify-center text-center p-1 text-[10px] text-slate-500 shrink-0">
                    <span>Affix Recent Passport Size Photograph</span>
                  </div>
                </div>

                <div className="mt-3 py-1 bg-slate-100 rounded-md border border-slate-300">
                  <h2 className="text-xs sm:text-sm font-extrabold tracking-wider uppercase text-slate-900">
                    Application Form for Student Admission (Session 2026–2027)
                  </h2>
                </div>
              </div>

              {/* Form Metadata Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4 p-2 bg-slate-50 rounded border border-slate-200 text-[11px]">
                <div>
                  <span className="font-semibold text-slate-600">Form Serial No:</span>
                  <span className="ml-1 font-mono font-bold text-slate-900">UGS/2026/OFF-______</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-600">Date of Issue:</span>
                  <span className="ml-1 font-mono text-slate-900">____ / ____ / 2026</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="font-semibold text-slate-600">Class Seeking:</span>
                  <span className="ml-1 font-bold text-slate-900 underline underline-offset-2">________________</span>
                </div>
              </div>

              {/* Section 1: Student Particulars */}
              <div className="mb-4">
                <div className="bg-slate-800 text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2">
                  1. Candidate Particulars (Fill in Capital Letters)
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <span className="text-slate-600 font-medium">Candidate's Full Name:</span>
                      <div className="border-b border-dotted border-slate-400 h-6"></div>
                    </div>
                    <div className="w-full sm:w-48">
                      <span className="text-slate-600 font-medium">Date of Birth (DD/MM/YYYY):</span>
                      <div className="border-b border-dotted border-slate-400 h-6"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <span className="text-slate-600 font-medium">Gender: [ ] M  [ ] F</span>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium">Blood Group: _______</span>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium">Nationality: Indian</span>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium">Mother Tongue: _______</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <span className="text-slate-600 font-medium">Student Aadhaar Number:</span>
                      <div className="border-b border-dotted border-slate-400 h-6"></div>
                    </div>
                    <div className="flex-1">
                      <span className="text-slate-600 font-medium">Social Category (GEN / OBC / MOBC / SC / ST):</span>
                      <div className="border-b border-dotted border-slate-400 h-6"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Parents / Guardian Information */}
              <div className="mb-4">
                <div className="bg-slate-800 text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2">
                  2. Parent / Guardian Particulars
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <span className="text-slate-600 font-medium">Father's Name:</span>
                      <div className="border-b border-dotted border-slate-400 h-6"></div>
                    </div>
                    <div className="w-full sm:w-64">
                      <span className="text-slate-600 font-medium">Occupation / Designation:</span>
                      <div className="border-b border-dotted border-slate-400 h-6"></div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <span className="text-slate-600 font-medium">Mother's Name:</span>
                      <div className="border-b border-dotted border-slate-400 h-6"></div>
                    </div>
                    <div className="w-full sm:w-64">
                      <span className="text-slate-600 font-medium">Occupation / Designation:</span>
                      <div className="border-b border-dotted border-slate-400 h-6"></div>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-600 font-medium">Permanent Residential Address:</span>
                    <div className="border-b border-dotted border-slate-400 h-6"></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <span className="text-slate-600 font-medium">Primary Mobile No (WhatsApp):</span>
                      <div className="border-b border-dotted border-slate-400 h-6"></div>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium">Emergency Alternate No:</span>
                      <div className="border-b border-dotted border-slate-400 h-6"></div>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium">Parent Email ID:</span>
                      <div className="border-b border-dotted border-slate-400 h-6"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Previous Academic History */}
              <div className="mb-4">
                <div className="bg-slate-800 text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2">
                  3. Previous Schooling Record & Transport
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <span className="text-slate-600 font-medium">Last School Attended:</span>
                      <div className="border-b border-dotted border-slate-400 h-6"></div>
                    </div>
                    <div className="w-full sm:w-48">
                      <span className="text-slate-600 font-medium">Class Passed & Percentage:</span>
                      <div className="border-b border-dotted border-slate-400 h-6"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-600 font-medium">Transfer Certificate (TC) Enclosed? [ ] Yes  [ ] In Progress</span>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium">School Bus Transport Needed? [ ] Yes  [ ] Self-Commute</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Declaration & Signature */}
              <div className="border-t-2 border-slate-300 pt-3 text-[11px] text-slate-700 space-y-3">
                <p className="leading-snug">
                  <strong>Declaration by Parent / Guardian:</strong> I hereby declare that all particulars stated above are true and accurate to the best of my knowledge. I promise to abide by the disciplinary rules, code of conduct, and academic fee schedule of United Global School, Rupahi Town.
                </p>

                <div className="pt-6 flex justify-between items-end">
                  <div className="text-center">
                    <div className="border-b border-slate-500 w-36 mb-1"></div>
                    <span className="text-[10px] text-slate-600">Date & Place</span>
                  </div>
                  <div className="text-center">
                    <div className="border-b border-slate-500 w-48 mb-1"></div>
                    <span className="text-[10px] text-slate-600">Signature of Father / Mother / Guardian</span>
                  </div>
                </div>
              </div>

              {/* Section 5: Official Office Use Only */}
              <div className="mt-4 p-2 bg-slate-100 rounded border border-slate-300 text-[10px] text-slate-600">
                <div className="font-bold text-slate-800 uppercase mb-1">For Office & Admission Desk Use Only</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>Admission Status: [ ] Granted  [ ] Pending</div>
                  <div>Assigned Adm No: __________________</div>
                  <div>Class & Section: __________________</div>
                  <div>Authorized Signature & Seal: ________</div>
                </div>
              </div>
            </div>
          ) : (
            /* Submission Checklist & Desk Information */
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Documents Checklist for Offline Submission</h4>
                    <p className="text-xs text-slate-400">Please bring original documents along with 1 set of self-attested photocopies</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">1. Student Birth Certificate</strong>
                      <span className="text-slate-400 text-xs">Issued by Municipal Corporation / Panchayat / Registrar of Births.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">2. Passport Size Color Photographs</strong>
                      <span className="text-slate-400 text-xs">4 recent passport size photographs of the candidate + 1 each of parents/guardians.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">3. Previous School Transfer Certificate (TC) & Marksheet</strong>
                      <span className="text-slate-400 text-xs">Original TC counter-signed by competent educational authority (for Class 1 and above).</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">4. Aadhaar Card & Proof of Residence</strong>
                      <span className="text-slate-400 text-xs">Photocopy of student Aadhaar card and electricity bill / voter ID / passport of parent.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campus Desk Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 text-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <Building2 className="w-4 h-4" />
                  Submission Office & Helpdesk
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Physical Address:</span>
                    </div>
                    <p className="text-white font-medium pl-5">
                      Administrative Office, Ground Floor, United Global School Campus, Rupahi Town, Nagaon, Assam
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Counter Working Hours:</span>
                    </div>
                    <p className="text-white font-medium pl-5">
                      Monday to Saturday · 8:30 AM to 3:30 PM (Closed on Government Holidays)
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Admissions Helpline:</span>
                    </div>
                    <p className="text-cyan-300 font-mono font-bold pl-5">
                      +91 94350 12345 / 03672-295001
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Admission Session:</span>
                    </div>
                    <p className="text-emerald-400 font-medium pl-5">
                      Academic Year 2026–2027 (Pre-Nursery to Class 10)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="no-print p-4 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Parents can also collect physical printed prospectus & form directly from school reception.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Form</span>
            </button>
            <button
              onClick={closeOfflineAdmissionModal}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
