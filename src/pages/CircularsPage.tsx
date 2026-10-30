import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { 
  Bell, 
  Calendar, 
  AlertCircle, 
  Search, 
  Download, 
  FileText, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const CircularsPage: React.FC = () => {
  const { announcements, setPublicPage, showToast } = useSchool();
  const [filterCat, setFilterCat] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Academic', 'Notice', 'Sports', 'Examination'];

  const filtered = announcements.filter(a => {
    const matchesCat = filterCat === 'All' || a.category === filterCat;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const academicCalendarEvents = [
    { date: '15 Oct 2026', title: 'Mid-Term Summative Assessments Begin', type: 'Exams' },
    { date: '28 Oct 2026', title: 'Diwali & Kali Puja Vacation', type: 'Holiday' },
    { date: '14 Nov 2026', title: 'Annual Children Day & STEM Science Exhibition', type: 'Event' },
    { date: '05 Dec 2026', title: 'Inter-School Sports Gala at Campus Turf', type: 'Sports' },
    { date: '12 Jan 2027', title: 'Magh Bihu Celebrations & Winter Recess', type: 'Holiday' },
    { date: '15 Feb 2027', title: 'CBSE Pre-Board Mock Examinations (Classes 10 & 12)', type: 'Exams' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-cyan-500/30 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono tracking-widest uppercase">
            <Bell className="w-4 h-4" />
            Official School Bulletin & Dispatches
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white tracking-tight leading-tight">
            Official Notices & Academic Circulars
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Direct communications from the Office of the Principal and Central Administrative Directorate, United Global School, Rupahi Town.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <button
              onClick={() => showToast('Full Academic Calendar 2026-27 downloaded!')}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Complete Academic Year Calendar
            </button>
            <span className="text-slate-400">· Official CBSE Affiliation UGS-AS-2026-89</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Notices + Academic Calendar Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Filterable Notices List */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    filterCat === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notices & circulars..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Notices List */}
          <div className="space-y-4">
            {filtered.map(notice => (
              <div
                key={notice.id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-semibold">{notice.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 font-mono text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {notice.date}
                      </span>
                    </div>

                    {notice.isUrgent && (
                      <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Immediate Action
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold font-display text-white leading-snug">
                    {notice.title}
                  </h2>

                  <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {notice.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Target: <strong>{notice.targetRole}</strong></span>
                  <button
                    onClick={() => showToast(`Notice "${notice.title.slice(0, 24)}..." downloaded as PDF`)}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Official Notice
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Academic Calendar & Quick Notices */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Session 2026-27 Key Dates
              </span>
              <span className="text-[10px] text-slate-400 font-mono">CALENDAR</span>
            </div>

            <div className="space-y-3 text-xs">
              {academicCalendarEvents.map((evt, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-cyan-400 font-semibold">{evt.date}</span>
                    <span className="text-slate-400">{evt.type}</span>
                  </div>
                  <div className="font-semibold text-white">
                    {evt.title}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setPublicPage('home')}
                className="w-full text-center text-xs text-slate-400 hover:text-white"
              >
                ← Return to Main Homepage
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
