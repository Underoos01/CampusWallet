import React, { useState } from 'react';
import { X, QrCode, Zap, CheckCircle2, CreditCard, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { formatRupee } from '../../utils/formatters';

interface ScanQRPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickPay: (title: string, amount: number, category: string, paymentMethod: 'campus_card' | 'bank_upi') => void;
  campusCardBalance: number;
}

export const ScanQRPayModal: React.FC<ScanQRPayModalProps> = ({
  isOpen,
  onClose,
  onQuickPay,
  campusCardBalance,
}) => {
  const [activeTab, setActiveTab] = useState<'qr' | 'nfc'>('qr');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickMerchants = [
    { title: 'Campus Canteen Chowk (Thali & Chai)', amount: 95.00, category: 'Canteen & Mess Extras' },
    { title: 'Nescafe Kiosk (Cold Coffee & Brownie)', amount: 140.00, category: 'Canteen & Mess Extras' },
    { title: 'Academic Complex Xerox & Print Hub', amount: 45.00, category: 'Books, Xerox & Labs' },
    { title: 'Hostel 4 Washing Machine Token', amount: 30.00, category: 'Hostel, Laundry & WiFi' },
  ];

  const handlePay = (item: typeof quickMerchants[0], method: 'campus_card' | 'bank_upi') => {
    onQuickPay(item.title, item.amount, item.category, method);
    setSuccessMessage(`Paid ${formatRupee(item.amount)} to ${item.title}`);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-[390px] bg-white rounded-[24px] shadow-card-sheet overflow-hidden border border-[#E2E8F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#0D5C63] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#4EDEA3]" />
            <h3 className="text-base font-bold">Campus Tap & UPI Pay</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#E2E8F0] bg-slate-50">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'qr'
                ? 'border-b-2 border-[#0D5C63] text-[#0D5C63] bg-white'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Scan UPI QR
          </button>
          <button
            onClick={() => setActiveTab('nfc')}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'nfc'
                ? 'border-b-2 border-[#0D5C63] text-[#0D5C63] bg-white'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            RFID Smart Tap
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {successMessage ? (
            <div className="py-8 text-center animate-in zoom-in-95">
              <CheckCircle2 className="w-14 h-14 text-[#10B981] mx-auto mb-3" />
              <h4 className="text-lg font-bold text-[#0F172A]">Payment Successful!</h4>
              <p className="text-sm text-[#475569] mt-1">{successMessage}</p>
            </div>
          ) : activeTab === 'qr' ? (
            <div>
              {/* QR Scanner Viewfinder frame */}
              <div className="relative w-48 h-48 mx-auto my-3 bg-slate-900 rounded-[20px] overflow-hidden flex items-center justify-center border-2 border-[#0D5C63]">
                {/* Simulated camera grid & laser */}
                <div className="absolute inset-4 border border-dashed border-white/40 rounded-[12px] flex items-center justify-center">
                  <div className="w-24 h-24 border-2 border-[#4EDEA3] rounded-[8px] flex items-center justify-center bg-white/5">
                    <QrCode className="w-16 h-16 text-white/70" />
                  </div>
                </div>
                {/* Scanning line animation */}
                <div className="absolute left-0 right-0 h-0.5 bg-[#4EDEA3] shadow-[0_0_8px_#4EDEA3] animate-pulse" />
              </div>

              <p className="text-center text-[12px] text-[#64748B] mb-4">
                Point at any Campus Counter or UPI QR standee
              </p>

              {/* Quick 1-Tap Merchant shortcuts */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">
                  Instant Test Pay at Campus Kiosks
                </p>
                {quickMerchants.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-[12px] border border-[#E2E8F0] cursor-pointer"
                    onClick={() => handlePay(item, 'bank_upi')}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-[13px] font-semibold text-[#0F172A] truncate">{item.title}</p>
                      <p className="text-[11px] text-[#64748B]">{item.category}</p>
                    </div>
                    <Button variant="primary" size="sm">
                      Pay {formatRupee(item.amount)}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* NFC RFID Tap Simulation */}
              <div className="p-4 bg-gradient-to-br from-[#0D5C63] to-[#083B40] rounded-[18px] text-white text-center mb-4 shadow-sm">
                <CreditCard className="w-10 h-10 mx-auto mb-2 text-[#4EDEA3]" />
                <h4 className="text-sm font-bold">Campus RFID Smart Card</h4>
                <p className="text-xs text-white/80 mt-0.5">Card Balance: {formatRupee(campusCardBalance)}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] bg-white/10 px-2.5 py-1 rounded-full text-white/90">
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Ready for POS Tap-to-Pay</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">
                  Tap to Authorize at Campus Point
                </p>
                {quickMerchants.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-[12px] border border-[#E2E8F0] cursor-pointer"
                    onClick={() => handlePay(item, 'campus_card')}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-[13px] font-semibold text-[#0F172A] truncate">{item.title}</p>
                      <p className="text-[11px] text-[#64748B]">Auto-deduct from Campus Card</p>
                    </div>
                    <Button variant="secondary" size="sm">
                      Tap {formatRupee(item.amount)}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
