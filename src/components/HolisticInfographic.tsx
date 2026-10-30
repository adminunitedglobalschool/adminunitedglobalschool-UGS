import React, { useState } from 'react';
import { HOLISTIC_PILLARS } from '../data/initialData';
import { HolisticPillar } from '../types/school';
import { 
  Cpu, 
  GraduationCap, 
  Trophy, 
  Palette, 
  Compass, 
  ArrowRight, 
  Check, 
  Activity,
  Zap,
  Sparkles
} from 'lucide-react';

export const HolisticInfographic: React.FC = () => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>('stem');
  const [selectedGradeStage, setSelectedGradeStage] = useState<'primary' | 'middle' | 'senior'>('middle');

  const selectedPillar = HOLISTIC_PILLARS.find(p => p.id === selectedPillarId) || HOLISTIC_PILLARS[0];

  const getPillarIcon = (name: string, className: string = 'w-5 h-5') => {
    switch (name) {
      case 'Cpu': return <Cpu className={className} />;
      case 'GraduationCap': return <GraduationCap className={className} />;
      case 'Trophy': return <Trophy className={className} />;
      case 'Palette': return <Palette className={className} />;
      case 'Compass': return <Compass className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  const gradeStageProgression = {
    primary: {
      label: 'Foundational Stage (Grades 1–5)',
      stem: 'Visual Block Coding, Lego Robotics & Sensory Science Observations',
      academic: 'Phonics, Experiential Math, Bilingual Storytelling (English & Assamese)',
      sports: 'Motor Skills, Yoga, Swimming Basics & Playground Coordination',
      culture: 'Folk Rhymes, Clay Sculpting, Rhythm & Creative Expression',
      leadership: 'Sharing Circles, Respect for Nature & Peer Collaboration'
    },
    middle: {
      label: 'Preparatory & Middle (Grades 6–8)',
      stem: 'Arduino Microcontrollers, IoT Sensors, 3D Tinkercad Printing',
      academic: 'Algebraic Inquiry, Science Experiments in Physical Labs, Critical Reading',
      sports: 'Inter-House Football, Track Athletics, Badminton Coaching',
      culture: 'Instrumental Music (Violin/Tabla), Traditional Sattriya & Contemporary Art',
      leadership: 'House Prefects, Eco-Club Tree Planting in Rupahi Town'
    },
    senior: {
      label: 'Secondary & Senior (Grades 9–12)',
      stem: 'Autonomous AI Robotics, Python Automation, Competitive Hackathons',
      academic: 'CBSE Board Rigor, Olympiad Prep, Integrated NEET/JEE Foundations',
      sports: 'State Championship Tournaments, Athletic Endurance, NIS Drills',
      culture: 'Orchestral Performances, Annual Kalakshetra Drama Production',
      leadership: 'Student Council Cabinet, Community Service, Disaster Preparedness'
    }
  };

  return (
    <section id="holistic-pillars" className="py-16 lg:py-24 border-t border-slate-800 bg-slate-950/60 relative">
      <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Animated Futuristic Section Header Box - Wide Desktop Layout */}
        <div className="relative group w-full max-w-6xl xl:max-w-7xl mx-auto mb-12">
          {/* Outer Ambient Glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/25 via-blue-600/25 to-indigo-600/25 blur-xl opacity-40 group-hover:opacity-60 transition-all duration-700 animate-pulse pointer-events-none" />

          {/* Main Cyber Box Enclosure */}
          <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10 xl:p-12 rounded-3xl bg-slate-950/90 backdrop-blur-xl border border-cyan-500/40 animate-cyber-glow text-center shadow-2xl shadow-cyan-950/50">
            
            {/* Cyber Corner HUD Tech Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

            {/* Animated Light Sweep Line */}
            <div className="absolute inset-y-0 w-36 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent pointer-events-none animate-cyber-shine" />

            {/* Category Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs text-cyan-300 font-semibold tracking-wide uppercase mb-3.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Interactive Pedagogical Architecture</span>
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black font-display tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 leading-tight">
              The 5 Pillars of Holistic Student Development
            </h2>

            {/* Subtext description */}
            <p className="mt-4 max-w-4xl lg:max-w-5xl mx-auto text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed font-normal">
              United Global School rejects rote memorization. Our integrated educational ecosystem balances mind, body, character, and futuristic technical skills. Click each pillar below to explore our interactive syllabus and student outcomes.
            </p>
          </div>
        </div>

        {/* 5-Pillar Navigation Buttons (Interactive Segmented Controller) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {HOLISTIC_PILLARS.map((pillar) => {
            const isSelected = pillar.id === selectedPillarId;
            return (
              <button
                key={pillar.id}
                onClick={() => setSelectedPillarId(pillar.id)}
                className={`p-4 rounded-2xl text-left border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {isSelected && (
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500" 
                  />
                )}
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="p-2.5 rounded-xl transition-colors"
                    style={{ 
                      backgroundColor: isSelected ? `${pillar.color}20` : '#1e293b',
                      color: pillar.color 
                    }}
                  >
                    {getPillarIcon(pillar.iconName, 'w-5 h-5')}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Pillar 0{HOLISTIC_PILLARS.indexOf(pillar) + 1}
                  </span>
                </div>
                <div>
                  <h3 className={`text-sm font-bold tracking-tight ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {pillar.shortDesc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Deep-Dive Canvas for Selected Pillar */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Col: Pillar Overview & Metrics */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                  style={{ backgroundColor: `${selectedPillar.color}25`, color: selectedPillar.color }}
                >
                  {getPillarIcon(selectedPillar.iconName, 'w-6 h-6')}
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-display text-white">
                    {selectedPillar.title}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Core Curriculum Component · Rupahi Campus
                  </div>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {selectedPillar.extendedDesc}
              </p>

              {/* Live Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {selectedPillar.metrics.map((metric, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                    <div className="text-lg font-bold font-display text-white tabular-nums">
                      {metric.value}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Initiatives List */}
              <div className="pt-2">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  Strategic Learning Initiatives:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedPillar.keyInitiatives.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-cyan-400" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Col: Interactive Age Progression Simulator */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/80 rounded-2xl p-6 border border-slate-800">
              
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Growth Progression Ladder
                  </div>
                  <span className="text-[11px] text-slate-400">Select Age Bracket:</span>
                </div>

                {/* Stage Toggles */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-xl mb-4">
                  <button
                    onClick={() => setSelectedGradeStage('primary')}
                    className={`py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                      selectedGradeStage === 'primary' 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Grades 1–5
                  </button>
                  <button
                    onClick={() => setSelectedGradeStage('middle')}
                    className={`py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                      selectedGradeStage === 'middle' 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Grades 6–8
                  </button>
                  <button
                    onClick={() => setSelectedGradeStage('senior')}
                    className={`py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                      selectedGradeStage === 'senior' 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Grades 9–12
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-3">
                  <div className="font-semibold text-cyan-400 text-xs">
                    {gradeStageProgression[selectedGradeStage].label}
                  </div>
                  <div className="text-slate-300 leading-relaxed">
                    {selectedPillarId === 'stem' && gradeStageProgression[selectedGradeStage].stem}
                    {selectedPillarId === 'academic' && gradeStageProgression[selectedGradeStage].academic}
                    {selectedPillarId === 'sports' && gradeStageProgression[selectedGradeStage].sports}
                    {selectedPillarId === 'culture' && gradeStageProgression[selectedGradeStage].culture}
                    {selectedPillarId === 'leadership' && gradeStageProgression[selectedGradeStage].leadership}
                  </div>
                </div>

                {/* Holistic Balance Radar Breakdown */}
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Curricular Immersion</span>
                    <span className="font-mono text-cyan-400 font-semibold tabular-nums">96%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full w-[96%]" />
                  </div>

                  <div className="flex justify-between text-xs text-slate-300 pt-1">
                    <span>Practical Lab & Hands-on Work</span>
                    <span className="font-mono text-emerald-400 font-semibold tabular-nums">88%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full w-[88%]" />
                  </div>
                </div>

              </div>

              {/* Action Note */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Integrated CBSE & Assam Edu Board Standards</span>
                <span className="text-cyan-400 font-medium">Session 2026-27</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
