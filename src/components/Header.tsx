import { BookOpen, ClipboardCheck, HeartHandshake, Home, QrCode, Refrigerator } from 'lucide-react';
import { AppTab } from '../types';

interface HeaderProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenQrModal: () => void;
}

const NAV_ITEMS: { id: AppTab; label: string; mobileLabel: string; icon: typeof Home }[] = [
  { id: 'overview', label: 'Overview', mobileLabel: 'Home', icon: Home },
  { id: 'fridge', label: 'Fridge Stock', mobileLabel: 'Fridge', icon: Refrigerator },
  { id: 'recipes', label: 'Recipes', mobileLabel: 'Recipes', icon: BookOpen },
  { id: 'donate', label: 'Donate', mobileLabel: 'Donate', icon: HeartHandshake },
  { id: 'volunteer', label: 'Volunteers', mobileLabel: 'Volunteer', icon: ClipboardCheck },
];

export function Header({ activeTab, onSelectTab, onOpenQrModal }: HeaderProps) {
  return (
    <>
      {/* Desktop & Mobile Top Bar (follows strict 3-zone Top Bar Contract) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2EAE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 md:h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element Brand Wordmark */}
          <button
            type="button"
            onClick={() => onSelectTab('overview')}
            className="font-display text-lg md:text-xl font-bold tracking-tight text-[#0F1E17] whitespace-nowrap shrink-0 cursor-pointer hover:text-[#15803D] transition-colors"
          >
            KampungFridge
          </button>

          {/* Zone 2: 5 concise single-line text nav links (Desktop) */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#15803D]'
                      : 'text-[#4B5E54] hover:text-[#0F1E17]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#15803D]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onOpenQrModal}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 md:px-4 md:py-2 rounded-lg bg-[#15803D] text-white text-xs md:text-sm font-medium hover:bg-[#166534] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] md:min-h-[40px]"
            >
              <QrCode className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Scan QR</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar (Thumb Zone, compact h-14 = 56px so total sticky <= 104px) */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2EAE5]"
      >
        <div className="grid grid-cols-5 h-14">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center min-h-[44px] transition-colors cursor-pointer ${
                  isActive ? 'text-[#15803D]' : 'text-[#5C7065] hover:text-[#0F1E17]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? 'stroke-[2.25]' : 'stroke-[1.75]'}`}
                  aria-hidden="true"
                />
                <span className="text-[11px] font-medium tracking-tight mt-0.5 whitespace-nowrap">
                  {item.mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
