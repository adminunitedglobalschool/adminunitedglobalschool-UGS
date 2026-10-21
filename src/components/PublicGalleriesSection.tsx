import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Teacher, Student, ClassTopper } from '../types/school';
import { 
  Users, 
  Trophy, 
  Award, 
  Sparkles, 
  Search, 
  Star, 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ChevronRight, 
  X,
  ExternalLink,
  Flame,
  Medal,
  Cpu
} from 'lucide-react';

export const PublicGalleriesSection: React.FC = () => {
  const { teachers, toppers, publicGalleryTab, setPublicGalleryTab, showToast } = useSchool();
  const [teacherSearch, setTeacherSearch] = useState('');
  const [topperSearch, setTopperSearch] = useState('');
  const [teacherSubjectFilter, setTeacherSubjectFilter] = useState('All');
  const [topperCategoryFilter, setTopperCategoryFilter] = useState('All');

  // Inspection modal
  const [inspectedTeacher, setInspectedTeacher] = useState<Teacher | null>(null);
  const [inspectedTopper, setInspectedTopper] = useState<ClassTopper | null>(null);

  // Filter teachers
  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
                          t.subject.toLowerCase().includes(teacherSearch.toLowerCase()) ||
                          t.designation.toLowerCase().includes(teacherSearch.toLowerCase());
    const matchesSubject = teacherSubjectFilter === 'All' || 
                           t.subject.toLowerCase().includes(teacherSubjectFilter.toLowerCase());
    return matchesSearch && matchesSubject;
  });

  // Filter toppers
  const filteredToppers = toppers.filter(top => {
    const matchesSearch = top.name.toLowerCase().includes(topperSearch.toLowerCase()) ||
                          top.grade.toLowerCase().includes(topperSearch.toLowerCase()) ||
                          top.rankBadge.toLowerCase().includes(topperSearch.toLowerCase()) ||
                          top.mentor.toLowerCase().includes(topperSearch.toLowerCase());
    const matchesCategory = topperCategoryFilter === 'All' || top.category === topperCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getHouseBadgeColor = (house: string) => {
    switch (house) {
      case 'Emerald': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Ruby': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Sapphire': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Topaz': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default: return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  return (
    <section id="public-galleries" className="py-14 sm:py-20 border-t border-slate-800 bg-slate-950/80 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-4/5 h-96 bg-gradient-to-b from-cyan-600/10 via-emerald-600/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Animated Futuristic Gallery Command Hub - Wide Desktop Layout */}
        <div className="relative group w-full max-w-6xl xl:max-w-7xl mx-auto">
          {/* Ambient Glow Aura */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/25 via-cyan-500/25 to-amber-500/25 blur-xl opacity-40 group-hover:opacity-60 transition-all duration-700 animate-pulse pointer-events-none" />

          {/* Main Cyber Enclosure */}
          <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10 xl:p-12 rounded-3xl bg-slate-950/95 backdrop-blur-xl border border-cyan-500/40 animate-cyber-glow text-center shadow-2xl">
            {/* Cyber Corner HUD Tech Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

            {/* Light Sweep Line */}
            <div className="absolute inset-y-0 w-36 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent pointer-events-none animate-cyber-shine" />

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black font-display tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
              Institutional Galleries of Excellence
            </h2>
            <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-300 max-w-4xl lg:max-w-5xl mx-auto font-normal leading-relaxed">
              Explore our distinguished faculty members mentoring young minds, and the stellar academic titans who led CBSE distinction honors.
            </p>

            {/* Futuristic Segmented Switcher (Wide & Ergonomic) */}
            <div className="mt-8 inline-flex p-1.5 sm:p-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl max-w-full">
              <button
                onClick={() => setPublicGalleryTab('teachers')}
                className={`px-6 sm:px-10 lg:px-12 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm lg:text-base font-bold flex items-center gap-3 transition-all whitespace-nowrap ${
                  publicGalleryTab === 'teachers'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-300'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Users className={`w-4 h-4 sm:w-5 sm:h-5 ${publicGalleryTab === 'teachers' ? 'text-slate-950' : 'text-emerald-400'}`} />
                <span>Teachers Gallery</span>
                <span className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                  publicGalleryTab === 'teachers' 
                    ? 'bg-slate-950/20 text-slate-950' 
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {teachers.length} Faculty
                </span>
              </button>

              <button
                onClick={() => setPublicGalleryTab('toppers')}
                className={`px-6 sm:px-10 lg:px-12 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm lg:text-base font-bold flex items-center gap-3 transition-all whitespace-nowrap ${
                  publicGalleryTab === 'toppers'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/30 ring-1 ring-amber-200'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Trophy className={`w-4 h-4 sm:w-5 sm:h-5 ${publicGalleryTab === 'toppers' ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>Class Toppers Gallery</span>
                <span className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                  publicGalleryTab === 'toppers' 
                    ? 'bg-slate-950/20 text-slate-950' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {toppers.length} Titans
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* VIEW A: TEACHERS GALLERY */}
        {publicGalleryTab === 'teachers' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search faculty by name, designation, or subject..."
                  value={teacherSearch}
                  onChange={e => setTeacherSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                {['All', 'Physics', 'Mathematics', 'Computer', 'Athletics'].map(sub => (
                  <button
                    key={sub}
                    onClick={() => setTeacherSubjectFilter(sub)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      teacherSubjectFilter === sub
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {sub === 'All' ? 'All Subjects' : sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Teachers Cyber Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTeachers.map(teacher => (
                <div 
                  key={teacher.id}
                  className="group relative rounded-3xl p-5 bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-emerald-950/40 hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    {/* Top Identity Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="relative">
                        <img 
                          src={teacher.avatar} 
                          alt={teacher.name} 
                          className="w-16 h-16 rounded-2xl bg-slate-950 p-1 border border-emerald-400/50 object-cover shadow-md"
                        />
                        <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-400/30 font-mono text-[10px] font-bold text-emerald-300 uppercase">
                          {teacher.empId}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono mt-1">
                          {teacher.experience} Experience
                        </div>
                      </div>
                    </div>

                    {/* Name & Subject Details */}
                    <div>
                      <h3 className="text-base font-bold font-display text-white group-hover:text-emerald-300 transition-colors">
                        {teacher.name}
                      </h3>
                      <div className="text-xs text-emerald-400 font-medium mt-0.5 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{teacher.subject}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        {teacher.designation}
                      </div>
                    </div>

                    {/* Academic Qualification & Class Badges */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Qualification:</span>
                        <span className="font-semibold text-slate-200">{teacher.qualification}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Classes:</span>
                        <span className="font-semibold text-cyan-300">{teacher.assignedClasses.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setInspectedTeacher(teacher)}
                      className="flex-1 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <span>View Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(teacher.email);
                        showToast(`Copied ${teacher.name}'s email (${teacher.email})`);
                      }}
                      className="p-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Copy Faculty Email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW B: CLASS TOPPERS GALLERY */}
        {publicGalleryTab === 'toppers' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search topper by name, grade, rank, or mentor..."
                  value={topperSearch}
                  onChange={e => setTopperSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                {['All', 'Class 12 Titans', 'Class 10 Distinction', 'STEM & Robotics', 'Junior Prodigy'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setTopperCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      topperCategoryFilter === cat
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Toppers Cyber Gold Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredToppers.map((topper, idx) => (
                <div 
                  key={topper.id}
                  className="group relative rounded-3xl p-5 bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-amber-950/40 hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    {/* Top Identity & Rank Pill */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="relative">
                        <img 
                          src={topper.avatar} 
                          alt={topper.name} 
                          className="w-16 h-16 rounded-2xl bg-slate-950 p-1 border border-amber-400/50 object-cover shadow-md"
                        />
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border border-slate-950 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
                          #{idx + 1}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 tabular-nums">
                          {topper.scorePercentage}%
                        </div>
                        <div className="text-[10px] text-amber-300 font-mono font-semibold">
                          DISTINCTION
                        </div>
                      </div>
                    </div>

                    {/* Student Name & Academic Class */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold font-display text-white group-hover:text-amber-300 transition-colors">
                          {topper.name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getHouseBadgeColor(topper.house)}`}>
                          {topper.house}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-medium mt-0.5 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{topper.grade} · Section {topper.section}</span>
                      </div>
                      <div className="text-[11px] text-amber-400/90 font-medium mt-1 flex items-center gap-1">
                        <Medal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="line-clamp-1">{topper.rankBadge}</span>
                      </div>
                    </div>

                    {/* Key Highlights */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-[11px]">
                      {topper.highlights.slice(0, 2).map((h, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-1.5 text-slate-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{h}</span>
                        </div>
                      ))}
                      <div className="pt-1 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Mentor:</span>
                        <span className="text-cyan-300 font-medium">{topper.mentor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setInspectedTopper(topper)}
                      className="w-full py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>View Honors & Certificate</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MODAL: TEACHER DOSSIER */}
      {inspectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img 
                  src={inspectedTeacher.avatar} 
                  alt={inspectedTeacher.name} 
                  className="w-14 h-14 rounded-2xl bg-slate-950 p-1 border border-emerald-400/50 object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    {inspectedTeacher.name}
                  </h3>
                  <div className="text-xs text-emerald-400 font-medium">
                    {inspectedTeacher.designation} · {inspectedTeacher.subject}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInspectedTeacher(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                <div className="text-slate-400 text-[10px]">EMPLOYEE ID</div>
                <div className="font-mono font-bold text-white">{inspectedTeacher.empId}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                <div className="text-slate-400 text-[10px]">TOTAL EXPERIENCE</div>
                <div className="font-bold text-white">{inspectedTeacher.experience}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                <div className="text-slate-400 text-[10px]">QUALIFICATION</div>
                <div className="font-bold text-white">{inspectedTeacher.qualification}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                <div className="text-slate-400 text-[10px]">ASSIGNED CLASSES</div>
                <div className="font-bold text-cyan-400">{inspectedTeacher.assignedClasses.join(', ')}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Institutional Mentor Verification
              </div>
              <p className="text-[11px] text-slate-300">
                Authorized CBSE mentor conducting STEM robotics labs, smart board interactive classrooms, and student board exam preparation at United Global School, Bhakatgaon.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(inspectedTeacher.email);
                  showToast(`Copied ${inspectedTeacher.name}'s email!`);
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Copy Official Email
              </button>
              <button
                onClick={() => setInspectedTeacher(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TOPPER HONORS & CERTIFICATE */}
      {inspectedTopper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img 
                  src={inspectedTopper.avatar} 
                  alt={inspectedTopper.name} 
                  className="w-14 h-14 rounded-2xl bg-slate-950 p-1 border border-amber-400/50 object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    {inspectedTopper.name}
                  </h3>
                  <div className="text-xs text-amber-400 font-medium">
                    {inspectedTopper.grade} ({inspectedTopper.section}) · {inspectedTopper.rankBadge}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInspectedTopper(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-500/40 text-center space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                CBSE DISTINCTION SCORECARD
              </div>
              <div className="text-4xl font-black font-display text-white tabular-nums">
                {inspectedTopper.scorePercentage}%
              </div>
              <div className="text-xs text-amber-200 font-medium">
                {inspectedTopper.stream} · {inspectedTopper.boardYear}
              </div>
            </div>

            {/* Accolades List */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                Key Honors & Competitive Laurels
              </div>
              <div className="space-y-1.5">
                {inspectedTopper.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
              <span>Adm No: <strong className="text-white font-mono">{inspectedTopper.admissionNo}</strong></span>
              <span>Mentor: <strong className="text-cyan-300">{inspectedTopper.mentor}</strong></span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                Print Distinction Certificate
              </button>
              <button
                onClick={() => setInspectedTopper(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
