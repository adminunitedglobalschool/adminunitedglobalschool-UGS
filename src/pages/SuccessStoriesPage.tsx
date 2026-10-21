import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { 
  Trophy, 
  Award, 
  Search, 
  Star, 
  Calendar, 
  Medal, 
  Sparkles,
  Users,
  CheckCircle2,
  Filter,
  ArrowRight
} from 'lucide-react';

export const SuccessStoriesPage: React.FC = () => {
  const { achievements, setPublicPage } = useSchool();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'STEM & Robotics', 'Academic', 'Athletics & Sports', 'Arts & Culture', 'Leadership'];

  const filtered = achievements.filter(a => {
    const matchesCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-amber-500/30 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono tracking-widest uppercase">
            <Trophy className="w-4 h-4" />
            Hall of Excellence & Student Laureates
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white tracking-tight leading-tight">
            Scrolling Laurels & Triumph Stories
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            United Global School champions holistic student excellence. From National Robotics Hackathons to Assam State Athletics and classical Assamese music honors, our students embody passion and resilience.
          </p>

          {/* Quick Metrics */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-2xl font-bold font-display text-amber-400 tabular-nums">
                64+
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                State & National Medals
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-2xl font-bold font-display text-cyan-400 tabular-nums">
                99.2%
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Top Academic Pass Rate
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-2xl font-bold font-display text-emerald-400 tabular-nums">
                38+
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                STEM Student Innovations
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-2xl font-bold font-display text-purple-400 tabular-nums">
                100%
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Holistic Participation
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student or achievement..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-amber-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Success Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <div
            key={item.id}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-5 shadow-xl group"
          >
            <div>
              {/* Card Meta */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="text-amber-400 font-semibold">{item.category}</span>
                <span className="flex items-center gap-1 font-mono text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.year}
                </span>
              </div>

              <h2 className="text-lg font-bold font-display text-white group-hover:text-amber-300 transition-colors leading-snug">
                {item.title}
              </h2>

              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Student attribution */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold font-display text-white text-sm">
                  {item.studentName.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {item.studentName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {item.grade} · United Global School
                  </div>
                </div>
              </div>

              <div className="px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-[11px] font-bold text-amber-300">
                {item.badge}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Return home link */}
      <div className="text-center pt-6">
        <button
          onClick={() => setPublicPage('home')}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5"
        >
          ← Return to Main Homepage
        </button>
      </div>

    </div>
  );
};
