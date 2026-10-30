import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { X, Sparkles, CheckCircle2, User, Phone, Mail, MapPin } from 'lucide-react';

export const AdmissionModal: React.FC = () => {
  const { isAdmissionModalOpen, closeAdmissionModal, registerNewStudent } = useSchool();
  const [submitted, setSubmitted] = useState(false);
  const [createdStudentName, setCreatedStudentName] = useState('');
  const [createdAdmNo, setCreatedAdmNo] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    guardianName: '',
    phone: '',
    email: '',
    grade: 'Class 9',
    dob: '2011-05-15',
    address: 'Rupahi Town, Nagaon',
    bloodGroup: 'B+',
    previousSchool: 'Shankardev Shishu Niketan, Rupahi',
    transportNeeded: 'Yes',
  });

  if (!isAdmissionModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    const newStd = registerNewStudent({
      name: formData.name,
      guardianName: formData.guardianName,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@student.ugs.edu`,
      grade: formData.grade,
      section: 'A',
      dob: formData.dob,
      address: formData.address,
      bloodGroup: formData.bloodGroup,
    });

    setCreatedStudentName(newStd.name);
    setCreatedAdmNo(newStd.admissionNo);
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    closeAdmissionModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white">
              Application Enrolled Successfully!
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Welcome <strong className="text-white">{createdStudentName}</strong> to United Global School, Rupahi Town.
            </p>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-sm mx-auto text-xs space-y-1 text-left">
              <div className="flex justify-between text-slate-400">
                <span>Assigned Admission No:</span>
                <span className="font-mono text-cyan-400 font-bold">{createdAdmNo}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Class Allotment:</span>
                <span className="text-white font-medium">{formData.grade} (Section A)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Desk Verification:</span>
                <span className="text-emerald-400 font-medium">Ready in Admin Portal</span>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-white">
                  Admission Registration 2026–27
                </h3>
                <p className="text-xs text-slate-400">
                  United Global School · Rupahi Town
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Student ABC 01"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Father / Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guardianName}
                    onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                    placeholder="e.g. Guardian ABC 01"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Parent Contact Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 94350 XXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="guardian@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Applying for Grade
                  </label>
                  <select
                    value={formData.grade}
                    onChange={e => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Class 1">Class 1</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 5">Class 5</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11 (Science)</option>
                    <option value="Class 11">Class 11 (Arts)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="O+">O+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Residential Address (Rupahi Town / Nearby)
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, Village, Post Office"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-300 hover:to-emerald-300 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Submit Admission Application
                </button>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
};
