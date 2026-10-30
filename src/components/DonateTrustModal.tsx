import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { 
  X, 
  Heart, 
  CheckCircle2, 
  Building2, 
  Copy, 
  Check, 
  QrCode, 
  ShieldCheck, 
  Sparkles, 
  Printer, 
  ArrowRight,
  HandHeart,
  Award,
  Wallet
} from 'lucide-react';

export const DonateTrustModal: React.FC = () => {
  const { isDonateModalOpen, closeDonateModal, showToast } = useSchool();
  const [activeTab, setActiveTab] = useState<'online' | 'bank'>('online');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [donationToken, setDonationToken] = useState('');

  const [selectedAmount, setSelectedAmount] = useState<number>(2500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [formData, setFormData] = useState({
    donorName: '',
    phone: '',
    email: '',
    panNumber: '',
    cause: 'Merit Scholarship for Underprivileged Rural Students',
    utrNumber: '',
  });

  if (!isDonateModalOpen) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Copied ${fieldName} to clipboard!`);
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  const finalAmount = customAmount ? Number(customAmount) || 0 : selectedAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.donorName.trim() || !formData.phone.trim()) {
      showToast('Please provide your name and phone number.');
      return;
    }
    if (finalAmount <= 0) {
      showToast('Please select or enter a valid donation amount.');
      return;
    }

    const token = `UGS-TR-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;
    setDonationToken(token);
    setSubmitted(true);
    showToast(`Thank you for your noble contribution! Receipt Token: ${token}`);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    closeDonateModal();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-950/40 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="no-print p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0">
              <HandHeart className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-display text-white">
                  Donate to Our Trust
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold uppercase">
                  80G Tax Exemption
                </span>
              </div>
              <p className="text-xs text-slate-400">
                United Global Educational & Social Welfare Trust · Bhakatgaon, Rupahi
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="no-print px-4 sm:px-6 pt-3 pb-2 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('online')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'online'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              Online Contribution & Pledge
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'bank'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Official Bank NEFT / RTGS
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {submitted ? (
            /* Official Tax Exemption & Donation Certificate */
            <div className="space-y-6">
              <div className="text-center py-3 space-y-1">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold font-display text-white">
                  Noble Contribution Recorded!
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Thank you for empowering the students of United Global School, Bhakatgaon.
                </p>
              </div>

              {/* Printable Certificate Card */}
              <div className="p-5 rounded-2xl bg-white text-slate-900 border border-slate-300 shadow-xl max-w-lg mx-auto print:max-w-none print:shadow-none space-y-3 font-sans">
                <div className="border-b border-slate-300 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-emerald-700 font-bold uppercase block">
                      OFFICIAL 80G DONATION ACKNOWLEDGMENT
                    </span>
                    <h5 className="font-black text-sm uppercase tracking-tight text-slate-950">
                      United Global Educational & Social Welfare Trust
                    </h5>
                    <p className="text-[10px] text-slate-600">
                      Regd. Office: Bhakatgaon, Rupahi Town · Nagaon, Assam – 782125
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 block">Receipt No</span>
                    <span className="font-mono font-black text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {donationToken}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Donor Name:</span>
                    <span className="font-bold text-slate-800">{formData.donorName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Contact Mobile:</span>
                    <span className="font-mono font-medium text-slate-800">{formData.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Contribution Amount:</span>
                    <span className="font-black text-emerald-700 text-sm">₹{finalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">PAN for 80G:</span>
                    <span className="font-mono font-semibold text-slate-800">{formData.panNumber || 'NOT PROVIDED'}</span>
                  </div>
                  <div className="col-span-2 p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Earmarked Cause:</span>
                    <span className="font-medium text-slate-800">{formData.cause}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-2 text-[10px] text-slate-600 space-y-1">
                  <p>
                    <strong>Tax Exemption Note:</strong> Donations to United Global Educational & Social Welfare Trust are eligible for tax deductions under Section 80G of the Income Tax Act.
                  </p>
                  <p className="italic text-slate-500">
                    Authorized Signatory · United Global Educational & Social Welfare Trust
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Print Donation Acknowledgment
                </button>
                <button
                  onClick={handleResetAndClose}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : activeTab === 'online' ? (
            /* Online Contribution & Pledge Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Trust Mission Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>United Global Trust Mission & 80G Tax Exemption</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Every contribution directly empowers students with 100% scholarships, robotics lab kits, athletic coaching, and nutritious school meals in the Rupahi & Bhakatgaon region.
                </p>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Contribution Amount (INR) <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  {[1000, 2500, 5000, 10000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="100"
                    placeholder="Or enter custom amount in Rupees"
                    value={customAmount}
                    onChange={e => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(0);
                    }}
                    className="w-full pl-7 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Cause Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Earmark Your Donation
                </label>
                <select
                  value={formData.cause}
                  onChange={e => setFormData({ ...formData, cause: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="Merit Scholarship for Underprivileged Rural Students">
                    Merit Scholarship for Underprivileged Rural Students (100% Tuition & Books)
                  </option>
                  <option value="Robotics, AI & Futuristic STEM Lab Sponsorship">
                    Robotics, AI & Futuristic STEM Lab Equipment Sponsorship
                  </option>
                  <option value="Girls STEM & Sports Leadership Fund">
                    Girls STEM & Sports Leadership Fund
                  </option>
                  <option value="Student Nutrition & Clean RO Drinking Water">
                    Student Nutrition & Clean RO Drinking Water Infrastructure
                  </option>
                  <option value="General School Trust & Campus Infrastructure Fund">
                    General School Trust & Campus Infrastructure Fund
                  </option>
                </select>
              </div>

              {/* Donor Particulars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Donor Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.donorName}
                    onChange={e => setFormData({ ...formData, donorName: e.target.value })}
                    placeholder="e.g. Guardian ABC 01 / Contributor XYZ"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    WhatsApp / Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 94350 00000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="donor@example.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    PAN Number (Optional for 80G Tax Exemption)
                  </label>
                  <input
                    type="text"
                    value={formData.panNumber}
                    onChange={e => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                    placeholder="ABCDE1234F"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white uppercase focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* UPI Quick Pay Box */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      Direct Official UPI ID (Scan / Pay via GPay, PhonePe, Paytm, BHIM)
                    </span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-cyan-300">
                      unitedglobalschool@sbi
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy('unitedglobalschool@sbi', 'UPI ID')}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedField === 'UPI ID' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'UPI ID' ? 'Copied' : 'Copy UPI'}</span>
                </button>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-slate-950" />
                  Complete Contribution & Generate Slip
                </button>
              </div>
            </form>
          ) : (
            /* Direct Bank Details Tab */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h5 className="font-bold text-sm text-white">Trust Account Banking Particulars</h5>
                      <p className="text-xs text-slate-400">For Domestic & Corporate NEFT / RTGS / IMPS Contributions</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    CURRENT A/C
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Beneficiary Account Name:</span>
                      <strong className="text-white text-xs block mt-0.5">
                        United Global Educational & Social Welfare Trust
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('United Global Educational & Social Welfare Trust', 'Account Name')}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {copiedField === 'Account Name' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Bank Name & Branch:</span>
                      <strong className="text-white text-xs block mt-0.5">
                        State Bank of India (SBI) · Rupahi Town Branch
                      </strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Account Number:</span>
                      <strong className="text-emerald-400 font-mono text-sm block mt-0.5">
                        409182391029
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('409182391029', 'Account Number')}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {copiedField === 'Account Number' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[10px]">IFSC Code:</span>
                      <strong className="text-cyan-400 font-mono text-sm block mt-0.5">
                        SBIN0002099
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('SBIN0002099', 'IFSC Code')}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {copiedField === 'IFSC Code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-slate-300">
                  <p>
                    After completing the transfer, donors can email the transaction reference receipt to <strong className="text-white">trust@unitedglobalschool.edu.in</strong> or WhatsApp <strong className="text-emerald-400">+91 94350 12345</strong> to receive the physical 80G Tax Exemption Certificate.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
