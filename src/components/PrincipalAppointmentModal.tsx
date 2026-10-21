import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  Building2, 
  Printer, 
  Sparkles,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const PrincipalAppointmentModal: React.FC = () => {
  const { 
    isPrincipalAppointmentModalOpen, 
    closePrincipalAppointmentModal, 
    showToast 
  } = useSchool();

  const [submitted, setSubmitted] = useState(false);
  const [appointmentToken, setAppointmentToken] = useState('');

  // Default to tomorrow's date formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    email: '',
    studentName: '',
    targetGrade: 'Class 9',
    purpose: 'New Admission Consultation',
    preferredDate: defaultDateStr,
    preferredTime: '11:00 AM - 12:00 PM',
    notes: '',
  });

  if (!isPrincipalAppointmentModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentName.trim() || !formData.phone.trim()) {
      showToast('Please fill in your name and contact phone number.');
      return;
    }

    const token = `UGS-PRIN-${Math.floor(1000 + Math.random() * 9000)}`;
    setAppointmentToken(token);
    setSubmitted(true);
    showToast(`Appointment confirmed! Token: ${token}`);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    closePrincipalAppointmentModal();
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-950/40 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="no-print p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-display text-white">
                  Appointment with Principal
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/15 border border-purple-500/30 text-purple-300 font-semibold uppercase">
                  Official Secretariat
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Office of the Principal · United Global School, Bhakatgaon Campus
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {submitted ? (
            /* Confirmation Token Slip */
            <div className="space-y-6">
              <div className="text-center py-4 space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold font-display text-white">
                  Appointment Slotted Successfully!
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Your appointment with the Principal of United Global School has been recorded.
                </p>
              </div>

              {/* Official Confirmation Card */}
              <div className="p-5 rounded-2xl bg-white text-slate-900 border border-slate-300 shadow-xl max-w-lg mx-auto print:max-w-none print:shadow-none space-y-3 font-sans">
                <div className="border-b border-slate-300 pb-3 flex items-center justify-between">
                  <div>
                    <h5 className="font-extrabold text-sm uppercase tracking-tight text-slate-950">
                      United Global School
                    </h5>
                    <p className="text-[10px] text-slate-600">
                      Bhakatgaon, Rupahi Town · Nagaon, Assam
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 block">Token Number</span>
                    <span className="font-mono font-black text-sm text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {appointmentToken}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Parent / Guardian:</span>
                    <span className="font-bold text-slate-800">{formData.parentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Contact Mobile:</span>
                    <span className="font-mono font-medium text-slate-800">{formData.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Student / Grade:</span>
                    <span className="font-medium text-slate-800">{formData.studentName || 'Prospective Candidate'} ({formData.targetGrade})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Discussion Agenda:</span>
                    <span className="font-medium text-slate-800">{formData.purpose}</span>
                  </div>
                  <div className="col-span-2 p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Confirmed Date:</span>
                      <span className="font-bold text-purple-900">{formData.preferredDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Time Window:</span>
                      <span className="font-bold text-purple-900">{formData.preferredTime}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-2 text-[10px] text-slate-600 space-y-1">
                  <div className="flex items-center gap-1 font-semibold text-slate-800">
                    <Building2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Venue: Office of the Principal, Ground Floor, Academic Wing</span>
                  </div>
                  <p>
                    Please present this token at the reception desk 10 minutes prior to your time slot along with government-issued photo ID.
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handlePrintSlip}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Print Appointment Slip
                </button>
                <button
                  onClick={handleResetAndClose}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/25 transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Appointment Scheduling Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
                <span>
                  Meetings with the Principal are scheduled between <strong>10:00 AM – 2:00 PM (Monday to Friday)</strong> to discuss admissions, academics, or institutional guidance.
                </span>
              </div>

              {/* Parent & Contact Particulars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Parent / Guardian Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={formData.parentName}
                      onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="e.g. Nurul Islam / Pranjal Bora"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    WhatsApp / Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 94350 00000"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="parent@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Child's Name & Current/Target Grade
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={formData.studentName}
                      onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                      placeholder="Candidate Name"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                    <select
                      value={formData.targetGrade}
                      onChange={e => setFormData({ ...formData, targetGrade: e.target.value })}
                      className="w-full px-2 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="Pre-Nursery">Pre-Nursery</option>
                      <option value="Nursery">Nursery</option>
                      <option value="KG / Prep">KG / Prep</option>
                      <option value="Class 1">Class 1</option>
                      <option value="Class 2">Class 2</option>
                      <option value="Class 3">Class 3</option>
                      <option value="Class 4">Class 4</option>
                      <option value="Class 5">Class 5</option>
                      <option value="Class 6">Class 6</option>
                      <option value="Class 7">Class 7</option>
                      <option value="Class 8">Class 8</option>
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Purpose of Appointment */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Purpose of Meeting <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.purpose}
                  onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="New Admission Consultation">New Admission Consultation & Campus Pedagogy</option>
                  <option value="Academic Progress & Guidance">Academic Progress, CBSE Mentorship & Curriculum</option>
                  <option value="Fee Structure & Scholarship">Fee Structure, Concessions & Financial Aid</option>
                  <option value="Special Learning & Extracurriculars">Robotics Lab, Sports & Special Extracurricular Support</option>
                  <option value="General Institutional Inquiry">General Institutional Interaction</option>
                </select>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Preferred Date <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="date"
                      required
                      min={defaultDateStr}
                      value={formData.preferredDate}
                      onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Preferred Time Window <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <select
                      value={formData.preferredTime}
                      onChange={e => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="10:00 AM - 11:00 AM">Morning: 10:00 AM – 11:00 AM</option>
                      <option value="11:00 AM - 12:00 PM">Noon: 11:00 AM – 12:00 PM</option>
                      <option value="12:00 PM - 01:00 PM">Midday: 12:00 PM – 01:00 PM</option>
                      <option value="01:30 PM - 02:30 PM">Afternoon: 01:30 PM – 02:30 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Specific Query or Background Information (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Mention any specific topics or queries you'd like to discuss with the Principal..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-400 resize-none"
                />
              </div>

              {/* Direct Helpline Strip */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                <span>Principal Secretariat Desk: <strong>03672-295001 / +91 94350 12345</strong></span>
                <span className="text-purple-400 font-medium">Campus: Bhakatgaon, Rupahi Town</span>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Confirm & Generate Appointment Token
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
