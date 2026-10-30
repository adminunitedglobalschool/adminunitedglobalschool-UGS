import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { X, Printer, CheckCircle2, School, Download, ShieldCheck } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { selectedReceipt, closeReceiptModal, students } = useSchool();

  if (!selectedReceipt) return null;

  const student = students.find(s => s.id === selectedReceipt.studentId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl relative max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Control Bar (Hidden during print) */}
        <div className="no-print flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Official Digital Fee Receipt
            </span>
            <span className="text-xs text-slate-400">· {selectedReceipt.receiptNo}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={closeReceiptModal}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Official Printable Receipt Content */}
        <div className="p-6 sm:p-8 bg-white text-slate-900 rounded-b-3xl print:rounded-none">
          
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-5 text-center">
            <div className="flex items-center justify-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold">
                UGS
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-slate-950 uppercase tracking-tight">
                United Global School
              </h2>
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Rupahi Town, Nagaon District, Assam – 782125
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              CBSE Affiliation: UGS-AS-2026-89 · U-DISE: 18100508901 · Phone: +91 94350 88210
            </div>
            <div className="mt-2 inline-block px-3 py-0.5 bg-slate-100 border border-slate-300 rounded text-[11px] font-bold uppercase tracking-wider text-slate-800">
              E-Fee Payment Receipt
            </div>
          </div>

          {/* Receipt & Student Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
            <div className="space-y-1">
              <div>
                <span className="text-slate-500">Receipt No: </span>
                <span className="font-mono font-bold text-slate-900">{selectedReceipt.receiptNo}</span>
              </div>
              <div>
                <span className="text-slate-500">Date & Time: </span>
                <span className="font-medium text-slate-900">{selectedReceipt.date} (Automated Ledger)</span>
              </div>
              <div>
                <span className="text-slate-500">Fee Term: </span>
                <span className="font-semibold text-slate-900">{selectedReceipt.term}</span>
              </div>
              <div>
                <span className="text-slate-500">Collected By: </span>
                <span className="text-slate-800 font-medium">{selectedReceipt.collectedBy}</span>
              </div>
            </div>

            <div className="space-y-1 text-right">
              <div>
                <span className="text-slate-500">Student Name: </span>
                <span className="font-bold text-slate-950 text-sm">{selectedReceipt.studentName}</span>
              </div>
              <div>
                <span className="text-slate-500">Admission No: </span>
                <span className="font-mono font-semibold text-slate-900">{selectedReceipt.admissionNo}</span>
              </div>
              <div>
                <span className="text-slate-500">Class & Section: </span>
                <span className="font-semibold text-slate-900">{selectedReceipt.grade} ({selectedReceipt.section})</span>
              </div>
              {student && (
                <div>
                  <span className="text-slate-500">Guardian: </span>
                  <span className="text-slate-800">{student.guardianName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="py-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-300 text-slate-600">
                  <th className="text-left py-2 font-semibold">S.No</th>
                  <th className="text-left py-2 font-semibold">Fee Particulars</th>
                  <th className="text-right py-2 font-semibold">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr>
                  <td className="py-2 text-slate-500">01</td>
                  <td className="py-2 text-slate-800 font-sans font-medium">Tuition & Smart Classroom Fee</td>
                  <td className="py-2 text-right tabular-nums">₹{selectedReceipt.breakdown.tuitionFee.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-500">02</td>
                  <td className="py-2 text-slate-800 font-sans font-medium">Robotics & STEM Innovation Lab</td>
                  <td className="py-2 text-right tabular-nums">₹{selectedReceipt.breakdown.stemLabFee.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-500">03</td>
                  <td className="py-2 text-slate-800 font-sans font-medium">Sports Arena & Athletic Development</td>
                  <td className="py-2 text-right tabular-nums">₹{selectedReceipt.breakdown.sportsActivityFee.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-500">04</td>
                  <td className="py-2 text-slate-800 font-sans font-medium">Campus Solar & Infrastructure Fund</td>
                  <td className="py-2 text-right tabular-nums">₹{selectedReceipt.breakdown.developmentFee.toLocaleString('en-IN')}</td>
                </tr>
                {selectedReceipt.breakdown.transportFee > 0 && (
                  <tr>
                    <td className="py-2 text-slate-500">05</td>
                    <td className="py-2 text-slate-800 font-sans font-medium">Transport Maintenance (Rupahi Route)</td>
                    <td className="py-2 text-right tabular-nums">₹{selectedReceipt.breakdown.transportFee.toLocaleString('en-IN')}</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-900 text-sm font-bold">
                  <td colSpan={2} className="py-3 text-slate-950 font-sans">
                    Total Amount Paid:
                  </td>
                  <td className="py-3 text-right text-slate-950 font-mono tabular-nums text-base">
                    ₹{selectedReceipt.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Mode & Transaction Reference */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3 my-2">
            <div>
              <span className="text-slate-500">Payment Mode: </span>
              <strong className="text-slate-900">{selectedReceipt.paymentMethod}</strong>
            </div>
            <div>
              <span className="text-slate-500">Reference / Txn ID: </span>
              <span className="font-mono font-medium text-slate-800">{selectedReceipt.transactionRef}</span>
            </div>
            <div>
              <span className="text-slate-500">Status: </span>
              <span className="text-emerald-700 font-bold uppercase">PAID & SETTLED</span>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-8 mt-4 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
            <div className="flex flex-col items-start justify-end">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-blue-600/40 flex items-center justify-center text-[10px] text-blue-800 font-bold uppercase text-center p-1 leading-tight transform -rotate-12">
                United Global School Seal
              </div>
              <div className="text-[10px] text-slate-400 mt-2">
                System Generated Digital Stamp
              </div>
            </div>

            <div className="text-right flex flex-col justify-end">
              <div className="font-serif italic text-base text-slate-800 font-bold">
                Staff ABC 01
              </div>
              <div className="border-t border-slate-400 pt-1 text-[11px] font-semibold text-slate-700">
                Authorized Accounts Officer
              </div>
              <div className="text-[10px] text-slate-500">
                United Global School, Rupahi Town
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center">
            This is a computer generated electronic receipt. Valid for all school clearance and academic records.
          </div>

        </div>

      </div>
    </div>
  );
};
