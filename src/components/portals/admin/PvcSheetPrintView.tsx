import React, { useState, useEffect } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { Student, Teacher, Staff, Administrator } from '../../../types/school';
import { IdCardData } from './IdCardRenderer';
import { 
  Printer, 
  RotateCw, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Trash2, 
  Plus, 
  ArrowRight, 
  Scissors, 
  School, 
  ShieldCheck, 
  QrCode, 
  Search,
  Filter,
  Check,
  Download,
  Info,
  Maximize2,
  X
} from 'lucide-react';

export const PvcSheetPrintView: React.FC = () => {
  const { students, teachers, staff, administrators, showToast } = useSchool();

  // Convert an entity to IdCardData format
  const studentToCardData = (s: Student): IdCardData => ({
    type: 'student',
    id: s.id,
    code: s.admissionNo,
    name: s.name,
    roleOrGrade: `${s.grade} · Section ${s.section}`,
    departmentOrHouse: `House ${s.house}`,
    phone: s.phone,
    email: s.email,
    avatar: s.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    bloodGroup: s.bloodGroup,
    validThrough: '2026–2027',
    zoneOrRoll: `Roll No: ${String(s.rollNo).padStart(2, '0')}`,
  });

  const teacherToCardData = (t: Teacher): IdCardData => ({
    type: 'teacher',
    id: t.id,
    code: t.empId,
    name: t.name,
    roleOrGrade: t.designation,
    departmentOrHouse: t.subject,
    phone: t.phone,
    email: t.email,
    avatar: t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    bloodGroup: t.bloodGroup,
    validThrough: '2026–2028',
    zoneOrRoll: `Dept: ${t.subject.split('&')[0].trim()}`,
  });

  const adminToCardData = (a: Administrator): IdCardData => ({
    type: 'administrator',
    id: a.id,
    code: a.empId,
    name: a.name,
    roleOrGrade: a.role,
    departmentOrHouse: a.accessLevel,
    phone: a.phone,
    email: a.email,
    avatar: a.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bloodGroup: 'O+',
    validThrough: 'PERMANENT',
    securityLevel: a.securityClearance,
    zoneOrRoll: 'Executive Office',
  });

  const staffToCardData = (st: Staff): IdCardData => ({
    type: 'staff',
    id: st.id,
    code: st.empId,
    name: st.name,
    roleOrGrade: st.role,
    departmentOrHouse: `Dept: ${st.department}`,
    phone: st.phone,
    email: st.email,
    avatar: st.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bloodGroup: 'B+',
    validThrough: '2026–2027',
    zoneOrRoll: `Zone: ${st.zone || 'Operations'}`,
  });

  // 9 Slots on the A4 page (indices 0 to 8)
  const [slots, setSlots] = useState<(IdCardData | null)[]>(() => {
    // Default initial 9 slots: fill with students and teachers
    const initial: (IdCardData | null)[] = [];
    students.slice(0, 7).forEach(s => initial.push(studentToCardData(s)));
    teachers.slice(0, 2).forEach(t => initial.push(teacherToCardData(t)));
    while (initial.length < 9) {
      initial.push(null);
    }
    return initial.slice(0, 9);
  });

  // Global side: 'front' or 'back'
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  // Card Theme: 'clean-white' (high-contrast for physical PVC card stock) or 'cyber-dark' (holographic dark style)
  const [themeMode, setThemeMode] = useState<'clean-white' | 'cyber-dark'>('clean-white');
  // Crop / cut marks toggle
  const [showCutMarks, setShowCutMarks] = useState<boolean>(true);

  // Slot selector modal state
  const [activeSlotModalIndex, setActiveSlotModalIndex] = useState<number | null>(null);
  const [pickerFilterType, setPickerFilterType] = useState<'all' | 'students' | 'teachers' | 'administrators' | 'staff'>('all');
  const [pickerSearch, setPickerSearch] = useState<string>('');

  // Auto-fill presets
  const handleAutoFillStudents = () => {
    const newSlots = [...slots];
    students.slice(0, 9).forEach((s, idx) => {
      newSlots[idx] = studentToCardData(s);
    });
    setSlots(newSlots);
    showToast('Auto-filled 9 slots with enrolled students.');
  };

  const handleAutoFillFacultyStaff = () => {
    const newSlots: (IdCardData | null)[] = [];
    administrators.forEach(a => newSlots.push(adminToCardData(a)));
    teachers.forEach(t => newSlots.push(teacherToCardData(t)));
    staff.forEach(s => newSlots.push(staffToCardData(s)));
    
    const finalSlots = newSlots.slice(0, 9);
    while (finalSlots.length < 9) finalSlots.push(null);
    setSlots(finalSlots);
    showToast('Auto-filled 9 slots with Administration, Teachers & Staff.');
  };

  const handleClearSlots = () => {
    setSlots(Array(9).fill(null));
    showToast('Cleared all 9 PVC card slots.');
  };

  const handleRemoveSlot = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSlots = [...slots];
    newSlots[index] = null;
    setSlots(newSlots);
  };

  const handleSelectPersonForSlot = (cardData: IdCardData) => {
    if (activeSlotModalIndex === null) return;
    const newSlots = [...slots];
    newSlots[activeSlotModalIndex] = cardData;
    setSlots(newSlots);
    setActiveSlotModalIndex(null);
    showToast(`Slot ${activeSlotModalIndex + 1} updated to ${cardData.name}`);
  };

  const handlePrint = () => {
    window.print();
  };

  // Compile full selectable roster for the picker modal
  const allSelectableItems: IdCardData[] = [
    ...students.map(studentToCardData),
    ...teachers.map(teacherToCardData),
    ...administrators.map(adminToCardData),
    ...staff.map(staffToCardData),
  ];

  const filteredSelectableItems = allSelectableItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
                          item.code.toLowerCase().includes(pickerSearch.toLowerCase()) ||
                          item.roleOrGrade.toLowerCase().includes(pickerSearch.toLowerCase());
    const matchesType = pickerFilterType === 'all' || item.type === pickerFilterType.slice(0, -1) || 
                        (pickerFilterType === 'staff' && item.type === 'staff') ||
                        (pickerFilterType === 'students' && item.type === 'student') ||
                        (pickerFilterType === 'teachers' && item.type === 'teacher') ||
                        (pickerFilterType === 'administrators' && item.type === 'administrator');
    return matchesSearch && matchesType;
  });

  const filledCount = slots.filter(Boolean).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Setup Configuration HUD */}
      <div className="no-print p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-display text-white">
                  9 PVC Card A4 Print Studio
                </h2>
                <span className="text-[10px] text-cyan-400 font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  STANDARD CR-80 FORMAT (54 × 85.6 mm)
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  A4 SHEET (3 × 3 GRID)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Setup for printing exactly 9 PVC ID Cards on a single A4 sheet for inkjet PVC trays, laser sheet laminations & die-cutters
              </p>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 hover:border-cyan-500/50 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
              Viewing: <span className="font-bold text-white uppercase">{cardSide} Side</span>
            </button>

            <button
              onClick={() => setThemeMode(themeMode === 'clean-white' ? 'cyber-dark' : 'clean-white')}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 hover:border-cyan-500/50 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Theme: <span className="font-bold text-white">{themeMode === 'clean-white' ? 'Clean White PVC' : 'Cyber Holographic'}</span>
            </button>

            <button
              onClick={() => setShowCutMarks(!showCutMarks)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                showCutMarks 
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300' 
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              Cut Lines: {showCutMarks ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              Print A4 Sheet ({filledCount}/9)
            </button>
          </div>
        </div>

        {/* Quick Batch Automation Bar */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Quick Batch Fill:</span>
            <button
              onClick={handleAutoFillStudents}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-[11px] transition-colors"
            >
              Auto-fill 9 Students
            </button>
            <button
              onClick={handleAutoFillFacultyStaff}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-[11px] transition-colors"
            >
              Auto-fill Faculty & Staff
            </button>
            <button
              onClick={handleClearSlots}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 font-medium text-[11px] transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear Sheet
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Click any slot card to change person. Press Print or <code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded font-mono">Ctrl+P</code> to generate PDF.</span>
          </div>
        </div>
      </div>

      {/* Print Instructions Callout for Browser Settings */}
      <div className="no-print p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/30 flex items-start gap-3 text-xs text-cyan-300">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">Recommended Browser Print Dialog Settings for Exact A4 Scale:</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px] text-cyan-200/90 pt-1">
            <div>• <strong className="text-white">Destination:</strong> Save as PDF or PVC Printer</div>
            <div>• <strong className="text-white">Paper Size:</strong> A4 (210 × 297 mm)</div>
            <div>• <strong className="text-white">Margins:</strong> None or Minimum</div>
            <div>• <strong className="text-white">Options:</strong> Enable &quot;Background graphics&quot;</div>
          </div>
        </div>
      </div>

      {/* THE PRINTABLE A4 CANVAS CONTAINER */}
      <div className="flex justify-center overflow-x-auto py-2">
        <div 
          id="a4-print-canvas"
          className={`pvc-a4-sheet relative select-none shadow-2xl transition-all duration-200 ${
            themeMode === 'clean-white' 
              ? 'bg-white text-slate-900 border border-slate-300' 
              : 'bg-slate-950 text-white border border-slate-800'
          }`}
          style={{
            width: '210mm',
            minHeight: '297mm',
            maxHeight: '297mm',
            padding: '12mm 15mm',
            boxSizing: 'border-box',
          }}
        >
          {/* Header Strip on top of A4 (Subtle Institutional Header) */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-dashed border-slate-400/50 text-[9px] font-mono opacity-70">
            <div className="flex items-center gap-1.5 font-bold">
              <span>UNITED GLOBAL SCHOOL · A4 9-PVC ID SHEET</span>
              <span>·</span>
              <span className="uppercase">{cardSide} SIDE BATCH</span>
            </div>
            <div className="flex items-center gap-3">
              <span>CR80 STANDARD (54 × 85.6mm)</span>
              <span>BATCH: UGS-2026-PVC</span>
              <span>SCALE: 100%</span>
            </div>
          </div>

          {/* 3 x 3 GRID: EXACTLY 9 CARDS */}
          <div 
            className="grid grid-cols-3 gap-x-[5mm] gap-y-[4.5mm] justify-items-center"
            style={{
              width: '100%',
            }}
          >
            {slots.map((card, index) => {
              return (
                <div 
                  key={index}
                  onClick={() => setActiveSlotModalIndex(index)}
                  className={`pvc-single-card group relative cursor-pointer transition-transform hover:scale-[1.01] ${
                    showCutMarks ? 'ring-1 ring-dashed ring-slate-400/40' : ''
                  }`}
                  style={{
                    width: '54mm',
                    height: '85.6mm',
                    boxSizing: 'border-box',
                  }}
                >
                  {/* Cutting Corner Crop Marks (Optional Guillotine alignment guides) */}
                  {showCutMarks && (
                    <>
                      <div className="no-print absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-slate-400 pointer-events-none" />
                      <div className="no-print absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-slate-400 pointer-events-none" />
                      <div className="no-print absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-slate-400 pointer-events-none" />
                      <div className="no-print absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-slate-400 pointer-events-none" />
                    </>
                  )}

                  {/* Slot Number Indicator in UI (hidden when printing) */}
                  <div className="no-print absolute top-1 right-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <span className="px-1 py-0.5 rounded bg-black/80 text-[8px] font-mono text-cyan-300 font-bold">
                      #{index + 1}
                    </span>
                    {card && (
                      <button 
                        onClick={(e) => handleRemoveSlot(index, e)}
                        title="Remove Card"
                        className="p-0.5 rounded bg-rose-600 text-white hover:bg-rose-500"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>

                  {/* Card Content or Empty Slot placeholder */}
                  {card ? (
                    <SinglePvcCardRenderer 
                      data={card} 
                      side={cardSide} 
                      themeMode={themeMode} 
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl border-2 border-dashed border-slate-400/50 bg-slate-500/5 flex flex-col items-center justify-center p-2 text-center text-slate-400 hover:border-cyan-500/60 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-slate-400/10 flex items-center justify-center mb-1 text-slate-500 group-hover:text-cyan-400">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 font-mono">SLOT {index + 1}</span>
                      <span className="text-[9px] text-slate-500">Click to Select</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Guide Strip on bottom of A4 */}
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-dashed border-slate-400/50 text-[8px] font-mono opacity-70">
            <div>DIRECTORATE OF ADMISSIONS & RECORDS · BHAKATGAON, RUPAHI TOWN, NAGAON, ASSAM</div>
            <div>VERIFIED SECURE PVC IDENTITY SHEETS · CBSE NEW DELHI</div>
          </div>
        </div>
      </div>

      {/* SLOT SELECTOR MODAL */}
      {activeSlotModalIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold font-mono text-sm">
                  #{activeSlotModalIndex + 1}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Assign Card to Slot #{activeSlotModalIndex + 1}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select a student, teacher, administrator, or staff member for this A4 print position
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveSlotModalIndex(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Search by name, code/admission number, or role..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto">
                {(['all', 'students', 'teachers', 'administrators', 'staff'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setPickerFilterType(t)}
                    className={`px-2.5 py-2 rounded-xl text-[11px] font-semibold capitalize whitespace-nowrap transition-colors ${
                      pickerFilterType === t
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Roster Grid */}
            <div className="max-h-96 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-800/40">
              {filteredSelectableItems.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelectPersonForSlot(item)}
                  className="pt-2 flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {item.name}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                          item.type === 'student' ? 'bg-cyan-500/20 text-cyan-300' :
                          item.type === 'teacher' ? 'bg-emerald-500/20 text-emerald-300' :
                          item.type === 'administrator' ? 'bg-purple-500/20 text-purple-300' :
                          'bg-amber-500/20 text-amber-300'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.roleOrGrade} · <span className="font-mono text-slate-300">{item.code}</span>
                      </div>
                    </div>
                  </div>

                  <button className="px-3 py-1.5 rounded-lg bg-slate-800 group-hover:bg-cyan-500 text-slate-300 group-hover:text-slate-950 text-xs font-semibold flex items-center gap-1 transition-colors">
                    Assign
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {filteredSelectableItems.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500">
                  No matching records found.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Embedded CSS for Accurate @media print */}
      <style>{`
        @media print {
          /* Hide anything marked no-print */
          .no-print, nav, header, footer, button, aside {
            display: none !important;
          }
          
          /* Set A4 page size without margins */
          @page {
            size: A4 portrait;
            margin: 0;
          }
          
          html, body {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          #a4-print-canvas {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 10mm 14mm !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

    </div>
  );
};

// MINI RENDERER FOR INDIVIDUAL PVC CARD ON THE A4 SHEET
interface SingleCardProps {
  data: IdCardData;
  side: 'front' | 'back';
  themeMode: 'clean-white' | 'cyber-dark';
}

const SinglePvcCardRenderer: React.FC<SingleCardProps> = ({ data, side, themeMode }) => {
  const isDark = themeMode === 'cyber-dark';

  const getTypeStyles = () => {
    switch (data.type) {
      case 'student':
        return {
          banner: 'bg-cyan-700 text-white',
          badgeText: 'STUDENT PASS',
          accent: 'text-cyan-700',
          borderAccent: 'border-cyan-600',
          chip: 'from-cyan-400 to-blue-500',
        };
      case 'teacher':
        return {
          banner: 'bg-emerald-700 text-white',
          badgeText: 'FACULTY PASS',
          accent: 'text-emerald-700',
          borderAccent: 'border-emerald-600',
          chip: 'from-emerald-400 to-teal-500',
        };
      case 'administrator':
        return {
          banner: 'bg-purple-800 text-white',
          badgeText: 'DIRECTORATE',
          accent: 'text-purple-800',
          borderAccent: 'border-purple-600',
          chip: 'from-purple-400 to-indigo-500',
        };
      case 'staff':
        return {
          banner: 'bg-amber-700 text-white',
          badgeText: 'STAFF PASS',
          accent: 'text-amber-700',
          borderAccent: 'border-amber-600',
          chip: 'from-amber-400 to-orange-500',
        };
    }
  };

  const style = getTypeStyles();

  if (side === 'back') {
    return (
      <div 
        className={`w-full h-full rounded-2xl p-2.5 flex flex-col justify-between border ${
          isDark 
            ? 'bg-slate-950 text-slate-200 border-slate-800' 
            : 'bg-white text-slate-800 border-slate-300'
        }`}
        style={{ boxSizing: 'border-box' }}
      >
        {/* Back Header */}
        <div>
          <div className="flex items-center justify-between pb-1 border-b border-slate-300 text-[8px] font-bold">
            <span className="tracking-wider">UNITED GLOBAL SCHOOL</span>
            <span className="font-mono text-[7px] text-slate-500">CBSE 2026-27</span>
          </div>

          {/* Magnetic Stripe graphic */}
          <div className="mt-1.5 w-full h-4 bg-slate-900 rounded-sm flex items-center px-1">
            <div className="w-full h-1 bg-slate-700 rounded-xs" />
          </div>

          <div className="mt-1.5 space-y-1 text-[7px] leading-tight text-slate-500">
            <p>1. Institutional property of United Global School, Bhakatgaon, Rupahi Town.</p>
            <p>2. Mandatory for campus biometric entry, laboratories & transportation.</p>
            <p>3. If found, contact Directorate: +91 94350 88210.</p>
          </div>
        </div>

        {/* Back QR & Signature Section */}
        <div>
          <div className={`p-1.5 rounded-lg flex items-center gap-1.5 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
            <div className="w-9 h-9 bg-white p-0.5 rounded flex items-center justify-center shrink-0">
              <QrCode className="w-8 h-8 text-black" />
            </div>
            <div className="text-[7px] leading-tight space-y-0.5">
              <div className="font-bold text-slate-800 truncate max-w-[95px]">{data.name}</div>
              <div className="font-mono text-slate-600">{data.code}</div>
              <div className="text-slate-500 truncate max-w-[95px]">{data.phone}</div>
            </div>
          </div>

          <div className="mt-1.5 pt-1 border-t border-slate-300 flex items-center justify-between text-[7px]">
            <div>
              <div className="font-serif italic font-bold text-[8px]">Dr. A. Saikia</div>
              <div className="text-[6px] text-slate-400">Principal Signature</div>
            </div>
            <div className="font-bold text-[7px] text-emerald-700 flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" />
              Verified
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FRONT SIDE OF PVC CARD
  return (
    <div 
      className={`w-full h-full rounded-2xl p-2 flex flex-col justify-between border relative overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-white border-slate-800' 
          : 'bg-white text-slate-900 border-slate-300 shadow-sm'
      }`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Top Banner with School Name */}
      <div>
        <div className="flex items-center justify-between pb-1 border-b border-slate-200">
          <div className="flex items-center gap-1">
            <div className={`w-5 h-5 rounded-md ${style.banner} flex items-center justify-center text-white shrink-0`}>
              <School className="w-3 h-3" />
            </div>
            <div className="leading-none">
              <div className="text-[8px] font-black font-display tracking-tight text-slate-900 truncate max-w-[100px]">
                UNITED GLOBAL SCHOOL
              </div>
              <div className="text-[6px] text-slate-500 font-medium">
                Bhakatgaon · Assam
              </div>
            </div>
          </div>

          <span className={`px-1 py-0.2 rounded text-[6px] font-bold font-mono tracking-wider ${style.banner}`}>
            {style.badgeText}
          </span>
        </div>

        {/* Microchip & RFID Indicator */}
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className={`w-5 h-4 rounded bg-gradient-to-tr ${style.chip} p-0.5 shadow-inner flex flex-col justify-around`}>
              <div className="h-px bg-black/40 w-full" />
              <div className="h-px bg-black/40 w-full" />
            </div>
            <span className="text-[6px] text-slate-400 font-mono">RFID</span>
          </div>
          <div className="text-[7px] font-mono font-bold text-slate-600">
            {data.code}
          </div>
        </div>
      </div>

      {/* Center: Photo & Name & Role */}
      <div className="flex flex-col items-center text-center my-0.5">
        <div className="relative">
          <div className={`w-14 h-14 rounded-xl p-0.5 border ${style.borderAccent} shadow-sm overflow-hidden bg-slate-100`}>
            <img 
              src={data.avatar} 
              alt={data.name} 
              className="w-full h-full rounded-lg object-cover" 
            />
          </div>
          {data.bloodGroup && (
            <div className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full bg-rose-600 text-white text-[6px] font-bold shadow-xs">
              {data.bloodGroup}
            </div>
          )}
        </div>

        <h4 className="text-[9px] font-extrabold font-display text-slate-900 mt-1 leading-tight truncate max-w-[125px]">
          {data.name}
        </h4>
        
        <div className="text-[7px] font-semibold text-slate-600 mt-0.2 truncate max-w-[125px]">
          {data.roleOrGrade}
        </div>

        {data.departmentOrHouse && (
          <div className="text-[6.5px] font-medium text-slate-500 mt-0.2 truncate max-w-[125px]">
            {data.departmentOrHouse}
          </div>
        )}
      </div>

      {/* Bottom: ID details & Barcode */}
      <div>
        <div className="p-1 rounded-md bg-slate-50 border border-slate-200 grid grid-cols-2 text-[6.5px]">
          <div>
            <span className="text-slate-400 block text-[5.5px]">IDENTIFIER:</span>
            <span className="font-mono font-bold text-slate-800">{data.zoneOrRoll || data.code}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[5.5px]">TERM:</span>
            <span className="font-mono font-bold text-slate-800">{data.validThrough}</span>
          </div>
        </div>

        {/* Barcode line */}
        <div className="mt-1 pt-0.5 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-px h-3">
            {[2, 3, 1, 2, 4, 1, 3, 1, 2, 3, 1, 2, 4, 1, 2, 1, 3].map((w, i) => (
              <div 
                key={i} 
                className="bg-slate-800 h-full" 
                style={{ width: `${w * 0.9}px` }} 
              />
            ))}
          </div>
          <div className="text-[5.5px] font-mono text-slate-400">
            {data.code}
          </div>
        </div>
      </div>
    </div>
  );
};
