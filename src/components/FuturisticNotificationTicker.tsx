import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Announcement } from '../types/school';
import { 
  Radio, 
  Sparkles, 
  Bell, 
  Flame, 
  ChevronRight, 
  Pause, 
  Play, 
  Zap, 
  X, 
  Calendar, 
  ExternalLink,
  ShieldAlert,
  Gauge
} from 'lucide-react';

export const FuturisticNotificationTicker: React.FC = () => {
  const { siteConfig, announcements, setPublicPage, role } = useSchool();
  const [isPaused, setIsPaused] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Announcement | null>(null);
  const [manualSpeed, setManualSpeed] = useState<'slow' | 'normal' | 'fast' | null>(null);

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

  // Build items array from announcements + custom broadcast
  const noticeItems: Array<{
    id: string;
    title: string;
    category: string;
    date: string;
    isUrgent?: boolean;
    fullItem?: Announcement;
  }> = [];

  // 1. If admin set a custom breaking broadcast message, put it first
  if (siteConfig?.tickerCustomBroadcast && siteConfig.tickerCustomBroadcast.trim()) {
    noticeItems.push({
      id: 'custom-broadcast',
      title: siteConfig.tickerCustomBroadcast,
      category: 'LIVE DISPATCH',
      date: 'CURRENT SESSION',
      isUrgent: true,
    });
  }

  // 2. Add published announcements from CMS
  if (announcements && announcements.length > 0) {
    announcements.forEach((a) => {
      noticeItems.push({
        id: a.id,
        title: a.title,
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
      category: 'ADMISSIONS',
      date: '2026-27',
      isUrgent: true,
    });
  }

  // Duplicate items for continuous seamless loop
  const displayItems = [...noticeItems, ...noticeItems];

  const getCategoryBadge = (category: string, isUrgent?: boolean) => {
    if (isUrgent) {
      return 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)] animate-pulse';
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

  return (
    <>
      {/* FUTURISTIC HUD NOTIFICATION TICKER */}
      <section 
        aria-label="Campus Live Notifications HUD Stream"
        className="w-full relative z-40 bg-slate-950/95 border-b border-cyan-500/30 backdrop-blur-md overflow-hidden select-none"
      >
        {/* Subtle Cyber Neon Underline Glow */}
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center h-10 sm:h-11">
          
          {/* LEFT: Futuristic Holographic HUD Badge */}
          <div className="shrink-0 flex items-center gap-2 pr-3 sm:pr-4 border-r border-slate-800 bg-slate-950/90 z-10 py-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></span>
            </span>

            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-mono font-extrabold uppercase tracking-widest whitespace-nowrap">
                {siteConfig?.tickerBadgeText || 'UGS LIVE HUD'}
              </span>
            </div>
          </div>

          {/* CENTER: Futuristic Infinite Scrolling Marquee Stream */}
          <div 
            className="flex-1 overflow-hidden relative flex items-center h-full mask-gradient-sides"
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
                  className={`inline-flex items-center gap-2.5 text-xs text-slate-200 transition-colors group ${
                    item.fullItem ? 'cursor-pointer hover:text-cyan-300' : 'cursor-default'
                  }`}
                >
                  {/* Category Pill with Futuristic HUD Glow */}
                  <span className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider border shrink-0 ${getCategoryBadge(item.category, item.isUrgent)}`}>
                    {item.isUrgent && '⚡ '}
                    {item.category}
                  </span>

                  {/* Title / Headline */}
                  <span className="font-medium text-[11px] sm:text-xs text-slate-200 group-hover:text-cyan-200 transition-colors tracking-wide">
                    {item.title}
                  </span>

                  {/* Timestamp Tag */}
                  <span className="text-[9px] font-mono text-slate-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800">
                    {item.date}
                  </span>

                  {/* Cyber Separator Glyph */}
                  <span className="text-cyan-500/40 text-[10px] font-mono pl-3">
                    ✦
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Quick HUD Controls */}
          <div className="shrink-0 flex items-center gap-1.5 pl-2 sm:pl-3 border-l border-slate-800 bg-slate-950/90 z-10">
            {/* Pause / Play Toggle */}
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? "Resume Marquee Stream" : "Pause Marquee Stream"}
              className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                isPaused
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40'
              }`}
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            </button>

            {/* Speed Toggle (1x / 1.5x / 2x) */}
            <button
              type="button"
              onClick={cycleSpeed}
              title={`Marquee Speed: ${speed.toUpperCase()} (Click to toggle)`}
              className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer"
            >
              <Gauge className="w-2.5 h-2.5 text-cyan-400" />
              <span>{speed === 'fast' ? 'FAST' : speed === 'slow' ? 'SLOW' : '1X'}</span>
            </button>

            {/* View All Circulars Link */}
            {role === 'public' && (
              <button
                type="button"
                onClick={() => setPublicPage('circulars')}
                className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border border-cyan-400/30 text-cyan-300 hover:text-white hover:border-cyan-400 text-[10px] font-mono font-bold transition-all cursor-pointer"
              >
                <span>ALL NOTICES</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>

        </div>
      </section>

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
              <div className="space-y-1">
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
                <h3 className="text-base sm:text-lg font-bold text-white font-display leading-snug">
                  {selectedNotice.title}
                </h3>
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
