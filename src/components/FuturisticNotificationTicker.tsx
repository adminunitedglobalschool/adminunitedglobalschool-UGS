import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Announcement } from '../types/school';
import { 
  Radio, 
  Sparkles, 
  Bell, 
  ChevronRight, 
  ChevronDown,
  Pause, 
  Play, 
  Zap, 
  X, 
  Calendar, 
  ExternalLink,
  Gauge,
  Layers,
  FileText,
  UserCheck
} from 'lucide-react';

export const FuturisticNotificationTicker: React.FC = () => {
  const { 
    siteConfig, 
    announcements, 
    setPublicPage, 
    role,
    openAdmissionModal,
    openOfflineAdmissionModal,
    openPrincipalAppointmentModal
  } = useSchool();
  const [isPaused, setIsPaused] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Announcement | null>(null);
  const [manualSpeed, setManualSpeed] = useState<'slow' | 'normal' | 'fast' | null>(null);
  const [layoutMode, setLayoutMode] = useState<'single-line' | 'two-line'>(() => siteConfig?.tickerLayoutMode || 'single-line');
  const [isAdmissionDropdownOpen, setIsAdmissionDropdownOpen] = useState(false);

  // If disabled by Super Admin, don't render on public site
  if (siteConfig?.tickerEnabled === false) {
    return null;
  }

  // Determine active speed class
  const speed = manualSpeed || siteConfig?.tickerSpeed || 'normal';
  const speedClass = speed === 'slow' 
    ? 'marquee-speed-slow' 
    : speed === 'fast' 
      ? 'marquee-speed-fast' 
      : 'marquee-speed-normal';

  // Helper to split any notice title into clean 2-line format so text never cuts off
  const getItemLines = (title: string, subtitle?: string, content?: string) => {
    if (subtitle && subtitle.trim()) {
      return { line1: title, line2: subtitle };
    }

    // Specific clean 2-line format for STEM Olympiad
    if (title.toLowerCase().includes('stem & robotics olympiad')) {
      return {
        line1: 'Inter-School STEM & Robotics Olympiad 2026',
        line2: 'Selection Trials (Class 8–12) · Innovation Lab · Saturday 10:00 AM',
      };
    }

    // Specific clean 2-line format for Quarter 3 fee notice
    if (title.toLowerCase().includes('quarter 3 digital fee')) {
      return {
        line1: 'Quarter 3 Digital Fee Submissions & Clearance',
        line2: 'Clear dues by October 25 via Online Portal or Accounts Counter',
      };
    }

    // Specific clean 2-line format for State Athletic Meet
    if (title.toLowerCase().includes('annual state athletic meet')) {
      return {
        line1: 'Annual State Athletic Meet Selection Trials',
        line2: 'Bhakatgaon Campus Turf · Sprints, Jump & Football Squad Trials',
      };
    }

    // Specific clean 2-line format for Parent-Teacher Consultative Conference
    if (title.toLowerCase().includes('parent-teacher consultative')) {
      return {
        line1: 'Parent-Teacher Consultative Conference',
        line2: 'Class 10 & 12 Board Prep · Evaluative Progress Review',
      };
    }

    // Fallback: If title contains delimiters
    for (const sep of [' · ', ' - ', ' | ', ' : ']) {
      if (title.includes(sep)) {
        const parts = title.split(sep);
        return {
          line1: parts[0].trim(),
          line2: parts.slice(1).join(sep).trim(),
        };
      }
    }

    // Fallback: Split long titles around midpoint
    if (title.length > 38) {
      const mid = Math.floor(title.length / 2);
      const spaceIdx = title.indexOf(' ', mid - 6);
      if (spaceIdx > 0 && spaceIdx < title.length - 8) {
        return {
          line1: title.slice(0, spaceIdx).trim(),
          line2: title.slice(spaceIdx + 1).trim(),
        };
      }
    }

    return {
      line1: title,
      line2: content ? content.slice(0, 55) + (content.length > 55 ? '...' : '') : 'Official Campus Circular',
    };
  };

  // Build items array from announcements + custom broadcast
  const noticeItems: Array<{
    id: string;
    title: string;
    line1: string;
    line2: string;
    category: string;
    date: string;
    isUrgent?: boolean;
    fullItem?: Announcement;
  }> = [];

  // 1. If admin set a custom breaking broadcast message, put it first
  if (siteConfig?.tickerCustomBroadcast && siteConfig.tickerCustomBroadcast.trim()) {
    const lines = getItemLines(
      siteConfig.tickerCustomBroadcast, 
      undefined, 
      'High Priority Real-time Bulletin from Super Admin'
    );
    noticeItems.push({
      id: 'custom-broadcast',
      title: siteConfig.tickerCustomBroadcast,
      line1: lines.line1,
      line2: lines.line2,
      category: 'LIVE DISPATCH',
      date: 'CURRENT SESSION',
      isUrgent: true,
    });
  }

  // 2. Add published announcements from CMS
  if (announcements && announcements.length > 0) {
    announcements.forEach((a) => {
      const lines = getItemLines(a.title, a.subtitle, a.content);
      noticeItems.push({
        id: a.id,
        title: a.title,
        line1: lines.line1,
        line2: lines.line2,
        category: a.category,
        date: a.date,
        isUrgent: a.isUrgent,
        fullItem: a,
      });
    });
  } else if (noticeItems.length === 0) {
    noticeItems.push({
      id: 'default-dispatch',
      title: 'Admissions Open 2026–27 · CBSE Affiliated Curriculum & Applied Robotics Track · Online Application Available',
      line1: 'Admissions Open 2026–27 (CBSE Affiliated)',
      line2: 'Applied Robotics Track · Online Applications & Entrance Tests Available',
      category: 'ADMISSIONS',
      date: '2026-27',
      isUrgent: true,
    });
  }

  // Duplicate items for continuous seamless loop
  const displayItems = [...noticeItems, ...noticeItems];

  const getCategoryBadge = (category: string, isUrgent?: boolean) => {
    if (isUrgent) {
      return 'bg-rose-500/25 text-rose-300 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)] animate-pulse';
    }
    switch (category.toLowerCase()) {
      case 'academic':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_8px_rgba(6,182,212,0.25)]';
      case 'examination':
        return 'bg-amber-500/20 text-amber-300 border-amber-400/40';
      case 'sports':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40';
      case 'event':
        return 'bg-purple-500/20 text-purple-300 border-purple-400/40';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-400/40';
    }
  };

  const cycleSpeed = () => {
    if (speed === 'normal') setManualSpeed('fast');
    else if (speed === 'fast') setManualSpeed('slow');
    else setManualSpeed('normal');
  };

  const toggleLayoutMode = () => {
    setLayoutMode(prev => prev === 'single-line' ? 'two-line' : 'single-line');
  };

  return (
    <>
      {/* FUTURISTIC HUD NOTIFICATION TICKER */}
      <section 
        aria-label="Campus Live Notifications HUD Stream"
        className={`w-full relative z-40 bg-slate-950/95 border-b border-cyan-500/30 backdrop-blur-md overflow-visible select-text selection:bg-cyan-500/30 selection:text-cyan-200 transition-all duration-300 ${
          layoutMode === 'two-line' ? 'min-h-[58px] sm:min-h-[62px]' : 'min-h-[46px] sm:min-h-[48px]'
        }`}
      >
        {/* Subtle Cyber Neon Underline Glow */}
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <div className={`max-w-7xl mx-auto px-2 sm:px-4 flex items-center ${
          layoutMode === 'two-line' ? 'h-15 sm:h-16 py-1.5' : 'h-11 sm:h-12 py-1'
        }`}>
          
          {/* LEFT: Futuristic Holographic HUD Badge - Hidden on mobile view */}
          <div className="hidden sm:flex shrink-0 items-center gap-1.5 sm:gap-2 pr-2.5 sm:pr-4 border-r border-slate-800 bg-slate-950/90 z-10 py-1">
            <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></span>
            </span>

            <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-lg bg-cyan-950/70 border border-cyan-500/50 text-cyan-300">
              <Radio className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-cyan-400 animate-pulse shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-mono font-extrabold uppercase tracking-widest whitespace-nowrap">
                {/* Mobile View: Shows 'LIVE' as requested */}
                <span className="inline md:hidden text-cyan-300 font-black">LIVE</span>
                {/* Desktop View: Shows configured badge */}
                <span className="hidden md:inline">{siteConfig?.tickerBadgeText || 'UGS LIVE HUD'}</span>
              </span>
            </div>
          </div>

          {/* CENTER: Futuristic Infinite Scrolling Marquee Stream */}
          <div 
            className="flex-1 overflow-hidden relative flex items-center h-full mask-gradient-sides py-0.5"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Left & Right subtle edge fade mask */}
            <div className="absolute left-0 inset-y-0 w-6 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

            <div 
              className={`animate-futuristic-marquee ${speedClass} flex items-center gap-6 sm:gap-8`}
              style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
            >
              {displayItems.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => {
                    if (item.fullItem) {
                      setSelectedNotice(item.fullItem);
                    }
                  }}
                  className={`inline-flex shrink-0 whitespace-nowrap transition-colors group ${
                    item.fullItem ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  {layoutMode === 'single-line' ? (
                    /* 1-LINE VIEW: Unbroken clean continuous stream with ample vertical breathing room */
                    <div className="inline-flex items-center gap-2.5 text-xs text-slate-200 py-1">
                      {/* Category Pill with Futuristic HUD Glow */}
                      <span className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider border shrink-0 ${getCategoryBadge(item.category, item.isUrgent)}`}>
                        {item.isUrgent && '⚡ '}
                        {item.category}
                      </span>

                      {/* Title / Headline (Guaranteed no top or bottom clipping) */}
                      <span className="font-semibold text-[11px] sm:text-xs text-slate-100 group-hover:text-cyan-200 transition-colors tracking-wide whitespace-nowrap leading-normal">
                        {item.title}
                      </span>

                      {/* Timestamp Tag */}
                      <span className="text-[9px] font-mono text-slate-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800 shrink-0">
                        {item.date}
                      </span>

                      {/* Cyber Separator Glyph */}
                      <span className="text-cyan-500/40 text-[10px] font-mono pl-3 shrink-0">
                        ✦
                      </span>
                    </div>
                  ) : (
                    /* 2-LINE VIEW: Dual-tier HUD Stream with headline and subline perfectly visible */
                    <div className="inline-flex items-center gap-3 py-1">
                      <div className="inline-flex flex-col justify-center gap-0.5 text-xs shrink-0 whitespace-nowrap">
                        {/* Line 1: Category Badge & Main Headline */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider border shrink-0 ${getCategoryBadge(item.category, item.isUrgent)}`}>
                            {item.isUrgent && '⚡ '}
                            {item.category}
                          </span>
                          <span className="font-bold text-[11px] sm:text-xs text-white group-hover:text-cyan-200 transition-colors tracking-wide whitespace-nowrap leading-none">
                            {item.line1}
                          </span>
                        </div>

                        {/* Line 2: Subtitle, Trials Schedule & Date */}
                        <div className="flex items-center gap-2 pl-0.5 text-[10px] text-slate-300 font-mono shrink-0">
                          <span className="text-cyan-400 font-bold">↳</span>
                          <span className="text-slate-300 group-hover:text-cyan-100 transition-colors whitespace-nowrap">
                            {item.line2}
                          </span>
                          <span className="text-[8px] text-slate-400 bg-slate-900/90 px-1.5 py-0.2 rounded border border-slate-800 shrink-0">
                            {item.date}
                          </span>
                        </div>
                      </div>

                      {/* Cyber Separator Glyph */}
                      <span className="text-cyan-500/40 text-[10px] font-mono pl-2 shrink-0">
                        ✦
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Quick HUD Controls */}
          <div className="shrink-0 flex items-center gap-1.5 pl-2 sm:pr-1 sm:pl-3 border-l border-slate-800 bg-slate-950/90 z-10">
            {/* 1-Line / 2-Line Layout Mode Switcher - Hidden in mobile view mode */}
            <button
              type="button"
              onClick={toggleLayoutMode}
              title={`Active Layout: ${layoutMode === 'single-line' ? '1-Line Stream' : '2-Line Stream'} (Click to toggle)`}
              className={`hidden sm:flex px-2 py-1 rounded-lg border text-[10px] font-mono font-bold items-center gap-1 transition-all cursor-pointer ${
                layoutMode === 'two-line'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Layers className="w-2.5 h-2.5 text-cyan-400" />
              <span>{layoutMode === 'single-line' ? '1-LINE' : '2-LINE'}</span>
            </button>

            {/* Pause / Play Toggle - Hidden on mobile view */}
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? "Resume Marquee Stream" : "Pause Marquee Stream"}
              className={`hidden sm:flex p-1.5 rounded-lg border text-xs items-center justify-center transition-all cursor-pointer ${
                isPaused
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40'
              }`}
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            </button>

            {/* Speed Toggle (SLOW / 1X / FAST) - Hidden on mobile view */}
            <button
              type="button"
              onClick={cycleSpeed}
              title={`Marquee Speed: ${speed.toUpperCase()} (Click to toggle)`}
              className="hidden sm:flex px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white text-[10px] font-mono font-bold items-center gap-1 cursor-pointer"
            >
              <Gauge className="w-2.5 h-2.5 text-cyan-400" />
              <span>{speed === 'fast' ? 'FAST' : speed === 'slow' ? 'SLOW' : '1X'}</span>
            </button>

            {/* Admission Dropdown (Online Admission & Offline Admission Form shifted from hero image) */}
            {role === 'public' && (
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAdmissionDropdownOpen(prev => !prev);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-mono font-bold transition-all cursor-pointer shadow-md active:scale-95 ${
                    isAdmissionDropdownOpen
                      ? 'bg-cyan-500/30 border-cyan-300 text-white shadow-cyan-500/30 ring-1 ring-cyan-400'
                      : 'bg-gradient-to-r from-cyan-500/25 via-blue-500/25 to-indigo-500/25 hover:from-cyan-500/40 hover:to-indigo-500/40 border-cyan-400/60 hover:border-cyan-300 text-cyan-200 hover:text-white shadow-cyan-500/20'
                  }`}
                  aria-expanded={isAdmissionDropdownOpen}
                  title="Admission 2026–27 (Click to toggle menu)"
                >
                  <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
                  <span>ADMISSION</span>
                  <ChevronDown className={`w-3 h-3 text-cyan-400 transition-transform duration-200 ${isAdmissionDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isAdmissionDropdownOpen && (
                  <>
                    {/* Fixed invisible backdrop to dismiss dropdown on outside click */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsAdmissionDropdownOpen(false)} 
                    />

                    <div 
                      className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-slate-950/98 border border-cyan-500/50 rounded-2xl shadow-2xl shadow-cyan-950/90 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-2xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                          <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                            Admission Desk 2026–27
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          OPEN
                        </span>
                      </div>

                      <div className="mt-1.5 space-y-1">
                        {/* 1. Online Admission */}
                        <button
                          type="button"
                          onClick={() => {
                            openAdmissionModal();
                            setIsAdmissionDropdownOpen(false);
                          }}
                          className="w-full flex items-start gap-2.5 p-2.5 rounded-xl bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-indigo-500/15 hover:from-cyan-500/25 hover:to-indigo-500/25 border border-cyan-400/40 text-left transition-all cursor-pointer group active:scale-95"
                        >
                          <div className="mt-0.5 p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-white flex items-center justify-between">
                              <span>Online Admission</span>
                              <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                            <div className="text-[10px] text-slate-300 mt-0.5">
                              Direct Digital Form & Fast-Track Entry
                            </div>
                          </div>
                        </button>

                        {/* 2. Offline Admission Form */}
                        <button
                          type="button"
                          onClick={() => {
                            openOfflineAdmissionModal();
                            setIsAdmissionDropdownOpen(false);
                          }}
                          className="w-full flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 text-left transition-all cursor-pointer group active:scale-95"
                        >
                          <div className="mt-0.5 p-1.5 rounded-lg bg-slate-800 text-cyan-400 group-hover:scale-110 transition-transform">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-white flex items-center justify-between">
                              <span>Offline Admission Form</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Download Printable Registration Kit
                            </div>
                          </div>
                        </button>

                        {/* 3. Principal Appointment */}
                        <button
                          type="button"
                          onClick={() => {
                            openPrincipalAppointmentModal();
                            setIsAdmissionDropdownOpen(false);
                          }}
                          className="w-full flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 text-left transition-all cursor-pointer group active:scale-95"
                        >
                          <div className="mt-0.5 p-1.5 rounded-lg bg-purple-500/20 text-purple-300 group-hover:scale-110 transition-transform">
                            <UserCheck className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-white flex items-center justify-between">
                              <span>Principal Interaction</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Schedule Campus Tour & Consultation
                            </div>
                          </div>
                        </button>

                        {/* 4. All Circulars & Notices Archive */}
                        <div className="pt-1.5 border-t border-slate-800/80">
                          <button
                            type="button"
                            onClick={() => {
                              setPublicPage('circulars');
                              setIsAdmissionDropdownOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-mono text-cyan-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <Bell className="w-3.5 h-3.5" />
                              <span>View All Circulars & Notices</span>
                            </span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* GRAND INSTITUTION IDENTITY BANNER: "UNITED GLOBAL SCHOOL" (Selectable & Grand Size) */}
      <div 
        aria-label="Institution Grand Title Banner"
        className="w-full relative z-30 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b-2 border-cyan-500/30 py-3 sm:py-5 px-3 sm:px-6 select-text selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      >
        {/* Holographic cyber ambient spotlight behind title */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/15 via-blue-900/10 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-90 shadow-[0_0_12px_#22d3ee]" />

        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 relative">
          
          {/* Top subtle micro-indicator */}
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] sm:tracking-[0.25em] text-cyan-400 uppercase select-none opacity-85">
            <span className="w-1.5 h-1.5 rotate-45 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>CENTRAL CAMPUS PORTAL · RUPAHI TOWN</span>
            <span className="w-1.5 h-1.5 rotate-45 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          </div>

          {/* Grand Header: UNITED GLOBAL SCHOOL (Bahut Bada & Majestic) */}
          <div className="w-full flex items-center justify-center gap-3 sm:gap-6">
            {/* Left Tech Laser Line (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 flex-1 max-w-[200px] justify-end opacity-70 select-none">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              <div className="w-2.5 h-2.5 rotate-45 border-2 border-cyan-400 bg-slate-950 shadow-[0_0_10px_#22d3ee] shrink-0" />
            </div>

            <h1 className="select-text cursor-text text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight sm:tracking-[0.06em] uppercase text-center bg-gradient-to-r from-cyan-200 via-white to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(6,182,212,0.45)] leading-tight">
              {siteConfig?.schoolName || 'United Global School'}
            </h1>

            {/* Right Tech Laser Line (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 flex-1 max-w-[200px] opacity-70 select-none">
              <div className="w-2.5 h-2.5 rotate-45 border-2 border-cyan-400 bg-slate-950 shadow-[0_0_10px_#22d3ee] shrink-0" />
              <div className="h-[2px] w-full bg-gradient-to-l from-transparent via-cyan-500/50 to-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            </div>
          </div>

          {/* Appointment with Principal Interactive Button */}
          <button
            type="button"
            onClick={openPrincipalAppointmentModal}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 rounded-full bg-gradient-to-r from-purple-500/20 via-slate-900 to-cyan-500/20 hover:from-purple-500/35 hover:to-cyan-500/35 border border-purple-500/40 hover:border-purple-300 text-purple-200 hover:text-white shadow-[0_0_15px_rgba(168,85,247,0.25)] transition-all cursor-pointer group active:scale-95"
            title="Book Official Appointment with Principal"
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase text-purple-200 group-hover:text-white">
              Appointment with Principal
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono text-cyan-400/90 tracking-wider hidden xs:inline">
              Campus Visit & Consultation
            </span>
            <ChevronRight className="w-3 h-3 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

        </div>
      </div>

      {/* INSPECTION MODAL: When a user clicks a notice from the ticker */}
      {selectedNotice && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedNotice(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-slate-900 border border-cyan-500/40 p-6 sm:p-7 shadow-2xl shadow-cyan-500/20 space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${getCategoryBadge(selectedNotice.category, selectedNotice.isUrgent)}`}>
                    {selectedNotice.isUrgent && '⚡ URGENT · '}
                    {selectedNotice.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedNotice.date}
                  </span>
                </div>
                
                {/* Clean 2-Line formatted Title */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-display leading-snug">
                    {getItemLines(selectedNotice.title, selectedNotice.subtitle, selectedNotice.content).line1}
                  </h3>
                  <p className="text-xs text-cyan-300 font-mono font-semibold mt-0.5">
                    {getItemLines(selectedNotice.title, selectedNotice.subtitle, selectedNotice.content).line2}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-300 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-line">
              {selectedNotice.content}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-mono text-slate-400">
                Audience: <strong className="text-cyan-300">{selectedNotice.targetRole}</strong>
              </span>

              <div className="flex items-center gap-2">
                {role === 'public' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedNotice(null);
                      setPublicPage('circulars');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-400/40 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Circulars Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedNotice(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
