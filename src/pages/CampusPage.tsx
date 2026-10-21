import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import stemLabImg from '../assets/images/stem_robotics_lab_1791694879429.jpg';
import sportsImg from '../assets/images/school_sports_athletics_1791694891463.jpg';
import artsImg from '../assets/images/holistic_arts_culture_1791694901718.jpg';
import heroCampusImg from '../assets/images/hero_united_global_school_1791694864291.jpg';
import { 
  Cpu, 
  Trophy, 
  Palette, 
  Sun, 
  MapPin, 
  ShieldCheck, 
  Bus, 
  Wifi, 
  Sparkles,
  Layers,
  Activity,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Navigation
} from 'lucide-react';

export const CampusPage: React.FC = () => {
  const { setPublicPage, openAdmissionModal } = useSchool();
  const [activeZone, setActiveZone] = useState<'stem' | 'sports' | 'arts' | 'solar' | 'transport'>('stem');
  const [virtualViewAngle, setVirtualViewAngle] = useState<'aerial' | 'interior' | 'specs'>('aerial');

  const zones = {
    stem: {
      name: 'STEM & AI Robotics Innovation Complex',
      kicker: 'Zone Alpha · 4,800 Sq.Ft Research Wing',
      lead: 'Dr. Mukut Sharma (Ph.D Physics & Senior STEM Mentor)',
      image: stemLabImg,
      summary: 'Equipped with industrial-grade stereolithography 3D printers, modular robotics test beds, dual-band IoT development nodes, and autonomous drone workstations.',
      specs: [
        { label: 'Workstations', val: '48 High-Performance Dev Nodes' },
        { label: 'Prototyping Tools', val: '6 Industrial 3D Printers & Laser CNC' },
        { label: 'Robotics Frameworks', val: 'ROS 2, Arduino IDE, ESP32 Microcontrollers' },
        { label: 'Bandwidth', val: '1 Gbps Dedicated Low-Latency Fiber' }
      ],
      features: [
        'Autonomous line-follower and obstacle avoidance proving grounds',
        'AI vision processing modules for real-time object tracking',
        'Cleanroom electronics soldering and circuit diagnostics station',
        'Student incubator for Assam state technological patents'
      ]
    },
    sports: {
      name: 'Olympic-Standard Sports Arena & Turf',
      kicker: 'Zone Beta · 5.2 Acres Athletic Complex',
      lead: 'Mr. Deben Nath (M.P.Ed, NIS Certified Athletics Director)',
      image: sportsImg,
      summary: 'Features a synthetic all-weather 400-meter sprint track, FIFA-dimension natural grass football pitch with floodlights, multi-sport courts, and traditional martial arts dojo.',
      specs: [
        { label: 'Sprint Track', val: '8-Lane 400m Synthetic IAAF Grade' },
        { label: 'Football Turf', val: '105m × 68m Natural Grass with Drainage' },
        { label: 'Indoor Complex', val: '4 Badminton & 2 Table Tennis Courts' },
        { label: 'Daily Regimen', val: '45-Min Mandatory Athletics & Yoga' }
      ],
      features: [
        'Biometric endurance & cardiovascular performance monitoring',
        'State-level inter-school championship hosting pavilion',
        'Specialized conditioning for Taekwondo & Karate black-belt aspirants',
        'Dedicated physiotherapist and emergency sports rehabilitation clinic'
      ]
    },
    arts: {
      name: 'Cultural Heritage & Performing Arts Studio',
      kicker: 'Zone Gamma · Acoustic & Fine Arts Pavilion',
      lead: 'Ms. Monalisa Das & Visiting Sangeet Acharyas',
      image: artsImg,
      summary: 'An acoustically engineered sanctuary honoring indigenous Assamese performing arts alongside western orchestral music, oil painting, and theatrical design.',
      specs: [
        { label: 'Sound Labs', val: '4 Acoustic Sound-Isolated Chambers' },
        { label: 'Instrument Bank', val: '120+ Acoustic, Electric & Classical Instruments' },
        { label: 'Art Gallery', val: 'Sunlit Exhibition Atrium with Easel Pods' },
        { label: 'Amphitheater', val: '650-Seat Tiered Open-Air Theater' }
      ],
      features: [
        'Sattriya, Borgeet, and folk Bihu preservation workshops',
        'Western string ensemble: Violin, Cello, and Keyboard training',
        'Sculpting, terracotta, and contemporary canvas techniques',
        'State youth festival preparation with accredited exponents'
      ]
    },
    solar: {
      name: 'Eco-Smart Clean Energy & Sustainable Grid',
      kicker: 'Zone Delta · Green Infrastructure',
      lead: 'Mr. Birendra Nath (Logistics & Eco-Campus Officer)',
      image: heroCampusImg,
      summary: 'United Global School operates as a net-positive green campus, generating 65 kW of clean solar power, harvesting 100% of rainwater, and maintaining zero single-use plastics.',
      specs: [
        { label: 'Solar Generation', val: '65 kW Peak Rooftop PV Arrays' },
        { label: 'Water Recycling', val: '25,000 Liters/Day Harvest Capacity' },
        { label: 'Carbon Offset', val: '42 Metric Tons Annual Reduction' },
        { label: 'Green Canopy', val: '1,400 Native Sal & Nahor Trees' }
      ],
      features: [
        'Live digital telemetry dashboard tracking energy generation',
        'Sub-surface drip irrigation for botanical research gardens',
        'Multi-stage RO drinking water filtration across all wings',
        'Zero-waste biodegradable cafeteria composting unit'
      ]
    },
    transport: {
      name: 'GPS Smart Transport & Safety Network',
      kicker: 'Zone Epsilon · Logistics & Regional Fleet',
      lead: 'Central Transport Control Room',
      image: heroCampusImg,
      summary: 'A secure fleet of modern school buses providing door-to-door transit across Bhakatgaon, Rupahi Town, Nagaon Bypass, Borghat, and surrounding tea estates.',
      specs: [
        { label: 'Active Fleet', val: '12 GPS-Tracked Eco-Compliant Buses' },
        { label: 'Coverage Radius', val: '32 km Radial Coverage in Nagaon' },
        { label: 'Surveillance', val: 'Dual CCTV & Speed Governors in 100% Buses' },
        { label: 'Guardian App', val: 'Real-Time Bus ETA Push Notifications' }
      ],
      features: [
        'Trained female attendants and certified first-responder drivers',
        'Automated RFID student tap-in/tap-out attendance logging',
        'SOS emergency beacons directly connected to school security',
        'Dedicated express routes for senior secondary board students'
      ]
    }
  };

  const current = zones[activeZone];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-cyan-500/30 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono tracking-widest uppercase">
            <Layers className="w-4 h-4" />
            Bhakatgaon Infrastructure Telemetry
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white tracking-tight leading-tight">
            Future-Ready Campus & Advanced Laboratories
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Spanning over 5.2 lush acres in Bhakatgaon, Rupahi Town, United Global School is engineered to stimulate intellectual curiosity, athletic endurance, and creative expression.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Bhakatgaon, Rupahi Town, Nagaon, Assam
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              100% Solar & Digital Enabled
            </span>
          </div>
        </div>
      </div>

      {/* Zone Selector HUD Ribbon */}
      <div className="p-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-x-auto scrollbar-none flex items-center gap-2">
        <button
          onClick={() => setActiveZone('stem')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeZone === 'stem'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          STEM & Robotics Hub
        </button>

        <button
          onClick={() => setActiveZone('sports')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeZone === 'sports'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Sports Arena & Turf
        </button>

        <button
          onClick={() => setActiveZone('arts')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeZone === 'arts'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/25 ring-1 ring-amber-400'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          Arts & Cultural Studio
        </button>

        <button
          onClick={() => setActiveZone('solar')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeZone === 'solar'
              ? 'bg-blue-500 text-slate-950 font-bold shadow-lg shadow-blue-500/25 ring-1 ring-blue-400'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sun className="w-4 h-4" />
          Eco-Solar Grid (65 kW)
        </button>

        <button
          onClick={() => setActiveZone('transport')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeZone === 'transport'
              ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/25 ring-1 ring-purple-400'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Bus className="w-4 h-4" />
          GPS Smart Fleet
        </button>
      </div>

      {/* Main Zone Interactive Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Media & Visual Anchor */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900 flex-1 min-h-[380px] lg:min-h-[460px] group">
            <img
              src={current.image}
              alt={current.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            
            {/* Overlay Telemetry HUD Badge */}
            <div className="absolute top-4 left-4 p-3 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                {current.kicker}
              </span>
              <span className="text-white font-bold text-sm block mt-0.5">
                {current.name}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Facility Mentor:</span>
                <span className="text-white font-semibold">{current.lead}</span>
              </div>
              <button
                onClick={openAdmissionModal}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors whitespace-nowrap"
              >
                Book Campus Visit
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Specifications & Feature Checklist */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
          <div>
            <div className="text-xs font-mono uppercase text-cyan-400 tracking-wider mb-1">
              Operational Metrics
            </div>
            <h2 className="text-2xl font-bold font-display text-white">
              {current.name}
            </h2>
            <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
              {current.summary}
            </p>

            {/* Spec Grid */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {current.specs.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="text-[11px] text-slate-400">{s.label}</div>
                  <div className="text-xs font-bold font-mono text-white tabular-nums">
                    {s.val}
                  </div>
                </div>
              ))}
            </div>

            {/* Key Capabilities */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2.5">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Facility Features & Capabilities:
              </div>
              {current.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Physical Location: Bhakatgaon, Rupahi</span>
            <button
              onClick={() => setPublicPage('home')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Return Home →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
