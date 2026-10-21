import React, { useState, useEffect } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Achievement } from '../types/school';
import { 
  Trophy, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  Sparkles, 
  Pause, 
  Play 
} from 'lucide-react';

export const SuccessCarousel: React.FC = () => {
  const { achievements } = useSchool();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const categories = ['All', 'STEM & Robotics', 'Academic', 'Athletics & Sports', 'Arts & Culture', 'Leadership'];

  const filteredAchievements = selectedCategory === 'All' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  // Auto-scroll loop
  useEffect(() => {
    if (!isAutoPlaying || filteredAchievements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % filteredAchievements.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlaying, filteredAchievements.length]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? filteredAchievements.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % filteredAchievements.length);
  };

  const activeItem = filteredAchievements[currentIndex] || filteredAchievements[0];

  return (
    <section id="success-stories" className="py-16 lg:py-24 border-t border-slate-800 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Nav Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-2">
              Hall of Excellence
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              Scrolling Success & Student Accolades
            </h2>
            <p className="mt-2 text-slate-300 text-sm max-w-xl">
              From National Robotics competitions to State Athletic golds and cultural honors, our students continuously raise the banner of Bhakatgaon, Rupahi Town high.
            </p>
          </div>

          {/* Interactive Navigation Affordances */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title={isAutoPlaying ? "Pause Autoplay" : "Resume Autoplay"}
              aria-label={isAutoPlaying ? "Pause Autoplay" : "Resume Autoplay"}
            >
              {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              aria-label="Previous Achievement"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              aria-label="Next Achievement"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Carousel Stage Card */}
        {activeItem && (
          <div 
            className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl relative overflow-hidden group"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              <div className="lg:col-span-8 space-y-4">
                
                {/* Meta line without pills */}
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-amber-400 font-semibold">{activeItem.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeItem.year}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-cyan-400 font-medium">{activeItem.badge}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight leading-snug">
                  {activeItem.title}
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {activeItem.description}
                </p>

                <div className="pt-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold font-display text-white text-base">
                    {activeItem.studentName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {activeItem.studentName}
                    </div>
                    <div className="text-xs text-slate-400">
                      {activeItem.grade} · United Global School
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Side Visual Badge */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="w-20 h-20 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/10">
                  <Trophy className="w-10 h-10" />
                </div>
                <div className="text-base font-bold text-white">
                  {activeItem.badge}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Verified Competition Honor
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 w-full text-center text-[11px] text-cyan-400">
                  Session {activeItem.year} Accolade
                </div>
              </div>

            </div>

            {/* Carousel Pagination Dots Indicator */}
            <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-slate-800/80">
              {filteredAchievements.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === idx 
                      ? 'w-8 bg-amber-400' 
                      : 'w-2 bg-slate-700 hover:bg-slate-600'
                  }`}
                  aria-label={`Jump to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
