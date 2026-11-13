import { MessageSquare, Type } from 'lucide-react';
import { SmsSubscription } from '../types';

interface AccessibilityUtilityStripProps {
  largeTextMode: boolean;
  onToggleLargeText: () => void;
  smsSubscription: SmsSubscription | null;
  onOpenSmsModal: () => void;
}

export function AccessibilityUtilityStrip({
  largeTextMode,
  onToggleLargeText,
  smsSubscription,
  onOpenSmsModal,
}: AccessibilityUtilityStripProps) {
  return (
    <div className="bg-[#EFF5F1] border-b border-[#DCE7E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <p className="text-[#354A3E] font-medium">
          Free HDB Neighbourhood Food Sharing · Open daily 7:00 AM – 10:00 PM
        </p>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenSmsModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#CFE0D5] text-[#15803D] font-medium hover:bg-[#F7FBF8] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] sm:min-h-[34px]"
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>
              {smsSubscription
                ? `SMS Alerts Active (${smsSubscription.phoneNumber})`
                : 'Daily SMS Stock Alert'}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleLargeText}
            aria-pressed={largeTextMode}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] sm:min-h-[34px] ${
              largeTextMode
                ? 'bg-[#0F1E17] border-[#0F1E17] text-white'
                : 'bg-white border-[#CFE0D5] text-[#0F1E17] hover:bg-[#F7FBF8]'
            }`}
          >
            <Type className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{largeTextMode ? 'Large Text: On' : 'Large Text Mode'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
