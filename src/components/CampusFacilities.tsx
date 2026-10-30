import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import stemLabImg from '../assets/images/stem_robotics_lab_1791694879429.jpg';
import sportsImg from '../assets/images/school_sports_athletics_1791694891463.jpg';
import artsImg from '../assets/images/holistic_arts_culture_1791694901718.jpg';
import { 
  Cpu, 
  Trophy, 
  Palette, 
  Sun, 
  Wifi, 
  ShieldCheck, 
  Bus,
  CheckCircle2
} from 'lucide-react';

export const CampusFacilities: React.FC = () => {
  const { siteConfig } = useSchool();
  const [activeTab, setActiveTab] = useState<'stem' | 'sports' | 'arts' | 'campus'>('stem');

  const getFacilityImage = (id: string, defaultImg: string) => {
    const found = siteConfig?.campusImages?.find(item => item.id === id);
    return found?.url || defaultImg;
  };

  const facilityDetails = {
    stem: {
      title: 'Advanced STEM & AI Robotics Innovation Hub',
      desc: 'Equipped with industrial grade 3D printers, modular robotic assembly kits, microcontroller workstations, and AI vision processors. Students turn theoretical algorithms into tangible physical prototypes.',
      image: getFacilityImage('stem', stemLabImg),
      highlights: [
        'Dedicated 3D CAD modeling & rapid prototyping benches',
        'Robotics competitions practice arena with obstacles',
        'Arduino, Raspberry Pi & ESP32 IoT sensor testing rigs',
        'High-speed optical fiber network & cloud development sandboxes'
      ],
      leadFaculty: 'Teacher XYZ 01 (Ph.D Physics & Robotics Head)'
    },
    sports: {
      title: 'Olympic-Standard Sports Arena & Turf',
      desc: 'Spanning over 5 acres in Bhakatgaon, our sports complex features a synthetic 400-meter sprint track, FIFA-standard football turf, badminton courts, and dedicated martial arts dojo.',
      image: getFacilityImage('sports', sportsImg),
      highlights: [
        '400-meter all-weather synthetic athletic track',
        'Natural grass football ground with floodlights',
        'Indoor badminton & table tennis courts',
        'Daily yoga & physical stamina conditioning'
      ],
      leadFaculty: 'Teacher XYZ 03 (M.P.Ed, NIS Certified Coach)'
    },
    arts: {
      title: 'Cultural Heritage & Performing Arts Pavilion',
      desc: 'A naturally lit, acoustically tuned studio celebrating both Assamese folk heritage (Bihu, Sattriya, Borgeet) and western orchestral music, oil canvas painting, and classical theater.',
      image: getFacilityImage('arts', artsImg),
      highlights: [
        'Acoustically treated instrumental music lab (Violin, Tabla, Keyboard)',
        'Fine arts studio with natural sunlight and gallery displays',
        'Open-air amphitheater for theatrical dramas and debates',
        'State-level youth festival training mentorship'
      ],
      leadFaculty: 'Teacher XYZ 04 & Guest Mentors'
    },
    campus: {
      title: 'Eco-Smart & Safe Green Campus in Bhakatgaon',
      desc: 'Our green campus produces 65 kW of solar clean energy, harvests rainwater, and maintains 100% CCTV surveillance across all corridors, classrooms, and transport buses.',
      image: getFacilityImage('campus', stemLabImg),
      highlights: [
        '65 kW Rooftop Solar Photovoltaic Grid',
        'GPS-tracked school buses covering Rupahi Town, Nagaon & bypass routes',
        'Pure RO mineral water plants & sanitized hygiene zones',
        'Interactive smart digital interactive boards in 100% of classrooms'
      ],
      leadFaculty: 'Staff ABC 03 (Campus Operations Officer)'
    }
  };

  const current = facilityDetails[activeTab];

  return (
    <section id="campus-tour" className="py-16 lg:py-24 border-t border-slate-800 bg-slate-950/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-2">
            World-Class Infrastructure
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Campus Built for Futuristic Exploration
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Located in scenic Bhakatgaon, Rupahi Town, United Global School merges lush nature with cutting-edge academic and sports architecture.
          </p>
        </div>

        {/* Facility Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          <button
            onClick={() => setActiveTab('stem')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'stem'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            STEM & Robotics Hub
          </button>

          <button
            onClick={() => setActiveTab('sports')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'sports'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Sports Arena & Track
          </button>

          <button
            onClick={() => setActiveTab('arts')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'arts'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            Cultural & Arts Pavilion
          </button>

          <button
            onClick={() => setActiveTab('campus')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'campus'
                ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/20'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4" />
            Eco-Campus & Smart Safety
          </button>
        </div>

        {/* Dynamic Facility Card with 2-Column Split */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Visual Media Container */}
            <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-[440px]">
              <img
                src={current.image}
                alt={current.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
            </div>

            {/* Information Side */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div>
                <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-2">
                  Featured Facility
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {current.title}
                </h3>
                <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                  {current.desc}
                </p>

                {/* Highlights List */}
                <div className="mt-6 space-y-2.5">
                  {current.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Faculty Anchor */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Facility Mentor:</span>
                <span className="text-slate-200 font-semibold">{current.leadFaculty}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
