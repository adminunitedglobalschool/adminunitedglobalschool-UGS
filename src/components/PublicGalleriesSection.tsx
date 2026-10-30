import React, { useState, useRef } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Teacher, ClassTopper } from '../types/school';
import { 
  Users, 
  Trophy, 
  Award, 
  Sparkles, 
  Search, 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  Mail, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft,
  X,
  Medal,
  Play,
  Pause,
  ArrowRight,
  Flame,
  Zap,
  Sliders
} from 'lucide-react';

export const PublicGalleriesSection: React.FC = () => {
  const { teachers, toppers, publicGalleryTab, setPublicGalleryTab, showToast } = useSchool();
  const [teacherSearch, setTeacherSearch] = useState('');
  const [teacherSubjectFilter, setTeacherSubjectFilter] = useState('All');
  
  // Animation & scrolling controls for Toppers Marquee
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  const [marqueeSpeed, setMarqueeSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [scrollDirection, setScrollDirection] = useState<'ltr' | 'rtl'>('ltr');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Inspection modals
  const [inspectedTeacher, setInspectedTeacher] = useState<Teacher | null>(null);
  const [inspectedTopper, setInspectedTopper] = useState<ClassTopper | null>(null);

  // Filter teachers when in teachers view
  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
                          t.subject.toLowerCase().includes(teacherSearch.toLowerCase()) ||
                          t.designation.toLowerCase().includes(teacherSearch.toLowerCase());
    const matchesSubject = teacherSubjectFilter === 'All' || 
                           t.subject.toLowerCase().includes(teacherSubjectFilter.toLowerCase());
    return matchesSearch && matchesSubject;
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

  // Get marquee animation duration based on speed state
  const getAnimationDuration = () => {
    switch (marqueeSpeed) {
      case 'slow': return '75s';
      case 'fast': return '28s';
      default: return '45s';
    }
  };

  // Manual scroll buttons for desktop fine control
  const manualScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 380;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Duplicate toppers list 3x for seamless infinite marquee wrapping
  const marqueeToppersList = [...toppers, ...toppers, ...toppers];

  return (
    <section id="public-galleries" className="py-6 sm:py-8 lg:py-10 border-t border-slate-800/80 bg-slate-950/90 relative overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-6xl h-64 bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-purple-500/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">

        {/* VIEW: CLASS TOPPERS CONTINUOUS HORIZONTAL STREAM (DEFAULT & PRIMARY) */}
        {publicGalleryTab === 'toppers' ? (
          <div className="space-y-4">
            
            {/* Futuristic Compact Header Control Panel */}
            <div className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 bg-slate-950/90 backdrop-blur-xl border border-amber-500/30 shadow-xl group">
              {/* Corner HUD Tech Accents */}
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
              <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

              {/* Light Sweep Line */}
              <div className="absolute inset-y-0 w-36 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent pointer-events-none animate-cyber-shine" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                {/* Title and HUD Badges */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 font-mono text-[11px] font-bold tracking-wider uppercase shadow-sm">
                      <Trophy className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>Class Toppers Gallery</span>
                    </div>

                    {/* Left-to-Right Stream Indicator */}
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-[10px] font-semibold">
                      <ArrowRight className="w-3 h-3 text-cyan-400 animate-pulse" />
                      <span>Live Stream</span>
                    </div>

                    {/* Live Stream Pulse Badge (Hidden on mobile per instruction: mobile view me live button nahi dikhna chahiye) */}
                    <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-mono text-[10px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>LIVE</span>
                    </div>
                  </div>

                  <h2 className="text-lg sm:text-xl lg:text-2xl font-black font-display tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-400">
                    Academic Titans Hall of Fame
                  </h2>
                </div>

                {/* Interactive Controls & Switcher (Play/Pause button hidden on mobile per instruction) */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {/* Play / Pause Toggle Button (Hidden on Mobile per user instruction: "Mobile View me live button Aur Play pause button nahi dikhna chahiye") */}
                  <div className="hidden sm:flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-inner">
                    <button
                      onClick={() => setIsMarqueePaused(!isMarqueePaused)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isMarqueePaused
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                          : 'bg-slate-800 text-slate-200 hover:text-white'
                      }`}
                      title={isMarqueePaused ? 'Resume Continuous Auto-Scroll' : 'Pause Auto-Scroll'}
                    >
                      {isMarqueePaused ? (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>Resume</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-3 h-3 fill-current" />
                          <span>Pause</span>
                        </>
                      )}
                    </button>

                    {/* Speed Selector (Desktop) */}
                    <div className="hidden md:flex items-center gap-0.5 pl-1 border-l border-slate-800">
                      {(['slow', 'normal', 'fast'] as const).map(speed => (
                        <button
                          key={speed}
                          onClick={() => setMarqueeSpeed(speed)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize transition-all cursor-pointer ${
                            marqueeSpeed === speed
                              ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {speed}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual Arrow Buttons for Desktop */}
                  <div className="hidden sm:flex items-center gap-1">
                    <button
                      onClick={() => manualScroll('left')}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-400/50 transition-colors cursor-pointer"
                      title="Scroll Left"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => manualScroll('right')}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-400/50 transition-colors cursor-pointer"
                      title="Scroll Right"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quick Link to Faculty Directory */}
                  <button
                    onClick={() => setPublicGalleryTab('teachers')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="View Faculty Directory"
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden xs:inline">Faculty Directory ({teachers.length})</span>
                    <span className="xs:hidden">Faculty</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Continuous Horizontal Left-to-Right Scrolling Marquee Container */}
            <div 
              ref={scrollContainerRef}
              className="relative w-full overflow-x-auto scrollbar-none py-1 group/marquee"
              style={{ maskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)' }}
            >
              <div 
                className={`flex gap-4 sm:gap-5 items-stretch ${
                  scrollDirection === 'ltr' ? 'animate-toppers-marquee-ltr' : 'animate-toppers-marquee-rtl'
                } ${isMarqueePaused ? 'marquee-paused' : ''}`}
                style={{
                  animationDuration: getAnimationDuration(),
                  width: 'max-content'
                }}
              >
                {marqueeToppersList.map((topper, idx) => {
                  const displayRank = (idx % toppers.length) + 1;
                  return (
                    <div
                      key={`${topper.id}-${idx}`}
                      className="w-64 sm:w-72 shrink-0 select-none group/card relative rounded-2xl p-2.5 sm:p-3 bg-slate-900/95 backdrop-blur-md border border-amber-500/30 hover:border-amber-400 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_0_24px_rgba(245,158,11,0.25)] hover:-translate-y-1 cursor-pointer"
                      onClick={() => setInspectedTopper(topper)}
                    >
                      {/* Top Cyber Accent Corner */}
                      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-400 pointer-events-none" />

                      {/* Large Photo Area with Floating Elements */}
                      <div className="relative w-full h-48 sm:h-52 rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 group-hover/card:border-amber-400/50 transition-colors">
                        <img 
                          src={topper.avatar} 
                          alt={topper.name} 
                          className="w-full h-full object-cover object-top group-hover/card:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Soft ambient gradient overlay to make floating name pill stand out clearly */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

                        {/* Top-Left Floating Rank Badge */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-amber-500/95 backdrop-blur-sm text-slate-950 font-black text-[11px] font-mono shadow-md flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-slate-950" />
                          <span>#{displayRank}</span>
                        </div>

                        {/* Top-Right Floating Distinction Score */}
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-amber-400/50 text-amber-300 font-black text-xs sm:text-sm font-display tabular-nums shadow-md">
                          {topper.scorePercentage}%
                        </div>

                        {/* Floating Transparent Button for Student Name directly on Photo */}
                        <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900/90 backdrop-blur-md border border-white/20 group-hover/card:border-amber-400/60 shadow-lg flex items-center justify-between gap-1.5 transition-all">
                          <span className="text-sm sm:text-base font-bold font-display text-white group-hover/card:text-amber-300 tracking-wide truncate">
                            {topper.name}
                          </span>
                          <span className="shrink-0 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            {topper.grade}
                          </span>
                        </div>
                      </div>

                      {/* Economical Meta Information & Action Footer below Photo */}
                      <div className="mt-2.5 space-y-2">
                        {/* Compact Single-Line House & Stream Details */}
                        <div className="px-1 flex items-center justify-between text-[11px] text-slate-300">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${
                              topper.house === 'Emerald' ? 'bg-emerald-400' :
                              topper.house === 'Ruby' ? 'bg-rose-400' :
                              topper.house === 'Sapphire' ? 'bg-blue-400' : 'bg-amber-400'
                            }`} />
                            <span className="truncate">{topper.house} House · Sec {topper.section}</span>
                          </div>
                          <span className="text-[10px] font-mono text-amber-400/90 font-semibold truncate ml-1 shrink-0">
                            {topper.rankBadge}
                          </span>
                        </div>

                        {/* Sleek Inspect Certificate Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectedTopper(topper);
                          }}
                          className="w-full py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm group-hover/card:bg-amber-500 group-hover/card:text-slate-950"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Inspect Certificate</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Stream Note */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 px-2 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[11px]">Showing {toppers.length} CBSE distinction achievers in infinite gliding carousel.</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Continuous Left-to-Right Ticker · Click to inspect honors
              </div>
            </div>

          </div>
        ) : (
          /* VIEW: TEACHERS GALLERY (ACCESSIBLE VIA NAVBAR OR SWITCHER) */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header with Switcher to Return to Toppers Marquee */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/90 border border-emerald-500/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold uppercase">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Faculty Directorate</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {teachers.length} Members
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-2">
                  Distinguished Faculty & Mentors
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Experienced educators and certified STEM robotics mentors leading student distinction.
                </p>
              </div>

              <button
                onClick={() => setPublicGalleryTab('toppers')}
                className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Return to Toppers Live Stream</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

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
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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
                      className="flex-1 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>View Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(teacher.email);
                        showToast(`Copied ${teacher.name}'s email (${teacher.email})`);
                      }}
                      className="p-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
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
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
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
                className="flex-1 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                Copy Official Email
              </button>
              <button
                onClick={() => setInspectedTeacher(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
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
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
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
                className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                Print Distinction Certificate
              </button>
              <button
                onClick={() => setInspectedTopper(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
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
