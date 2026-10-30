import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { 
  Bell, 
  Calendar, 
  AlertCircle, 
  ArrowUpRight, 
  FileText,
  Filter
} from 'lucide-react';

export const NoticesSection: React.FC = () => {
  const { announcements } = useSchool();
  const [filterCat, setFilterCat] = useState<string>('All');

  const categories = ['All', 'Academic', 'Notice', 'Sports', 'Examination'];

  const filtered = filterCat === 'All'
    ? announcements
    : announcements.filter(a => a.category === filterCat);

  return (
    <section id="notices" className="py-16 lg:py-24 border-t border-slate-800 bg-slate-950/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-2">
              Official Bulletin
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              Live Circulars & Notice Board
            </h2>
            <p className="mt-2 text-slate-300 text-sm max-w-xl">
              Stay updated with academic circulars, trial fixtures, and exam notifications issued by the Principal's Office in Rupahi Town.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 self-start md:self-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  filterCat === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(notice => (
            <div
              key={notice.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-3 text-xs text-slate-400 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-semibold">{notice.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {notice.date}
                    </span>
                  </div>

                  {notice.isUrgent && (
                    <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-rose-400" />
                      Urgent Action
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold font-display text-white leading-snug">
                  {notice.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {notice.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Target: {notice.targetRole}</span>
                <span className="text-cyan-400 font-medium">United Global School Dispatch</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
