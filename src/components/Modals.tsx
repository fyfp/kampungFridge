import { useState } from 'react';
import { CheckCircle2, MapPin, MessageSquare, QrCode, X } from 'lucide-react';
import { FoodItem, FridgeLocation, SmsSubscription, ToastMessage } from '../types';

/* ---------------------- Scan QR Code Modal ---------------------- */
interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: FridgeLocation[];
  onSelectLocation: (locationId: string) => void;
}

export function QrScannerModal({
  isOpen,
  onClose,
  locations,
  onSelectLocation,
}: QrScannerModalProps) {
  const [scanningId, setScanningId] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerSimulatedScan = (locationId: string) => {
    setScanningId(locationId);
    window.setTimeout(() => {
      setScanningId(null);
      onSelectLocation(locationId);
    }, 350);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
    >
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-[#E2EAE5] p-6 shadow-xl">
        <div className="w-10 h-1.5 bg-[#D1DDD6] rounded-full mx-auto mb-4 sm:hidden" />
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 id="qr-modal-title" className="text-xl font-bold text-[#0F1E17]">
              Scan Community Fridge QR
            </h2>
            <p className="text-sm text-[#4B5E54] mt-1">
              Point your camera at the QR sticker on the fridge door, or pick your HDB block below to view live stock.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close QR scanner"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#4B5E54] hover:bg-[#EFF5F1] hover:text-[#0F1E17] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulated Viewfinder */}
        <div className="rounded-xl bg-[#0F1E17] text-white p-5 mb-5 flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-xl border-2 border-dashed border-[#4ADE80]/70 flex items-center justify-center mb-3 bg-white/5">
            <QrCode className="w-14 h-14 text-[#4ADE80]" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium">
            {scanningId ? 'Reading fridge QR code...' : 'Select a void deck fridge below to simulate QR scan'}
          </p>
          <p className="text-xs text-white/70 mt-1">
            Instant access with zero login required for residents
          </p>
        </div>

        <div className="space-y-2.5">
          {locations.map((loc) => (
            <button
              key={loc.id}
              type="button"
              onClick={() => triggerSimulatedScan(loc.id)}
              className="w-full flex items-center justify-between gap-3 p-3.5 rounded-xl border border-[#E2EAE5] hover:border-[#15803D] hover:bg-[#F5FAF7] text-left transition-colors cursor-pointer min-h-[56px]"
            >
              <div>
                <p className="font-semibold text-sm text-[#0F1E17]">{loc.blockName}</p>
                <p className="text-xs text-[#4B5E54] mt-0.5">
                  {loc.address} · <span className="font-mono">{loc.qrCodeLabel}</span>
                </p>
              </div>
              <span className="text-xs font-medium text-[#15803D] whitespace-nowrap shrink-0">
                Open Stock →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------- Daily SMS Alert Modal ---------------------- */
interface SmsAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: FridgeLocation[];
  existing: SmsSubscription | null;
  onSubscribe: (sub: Omit<SmsSubscription, 'active'>) => void;
}

export function SmsAlertModal({
  isOpen,
  onClose,
  locations,
  existing,
  onSubscribe,
}: SmsAlertModalProps) {
  const [phoneNumber, setPhoneNumber] = useState(existing?.phoneNumber ?? '+65 9123 4567');
  const [locationId, setLocationId] = useState(existing?.locationId ?? locations[0]?.id ?? 'tp-118');
  const [preferredTime, setPreferredTime] = useState<SmsSubscription['preferredTime']>(
    existing?.preferredTime ?? 'Morning (8:30 AM)'
  );
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneNumber.replace(/\s+/g, '');
    if (cleaned.length < 8) {
      setError('Please enter a valid 8-digit Singapore mobile number.');
      return;
    }
    setError('');
    onSubscribe({ phoneNumber: phoneNumber.trim(), locationId, preferredTime });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sms-modal-title"
    >
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl border border-[#E2EAE5] p-6 shadow-xl">
        <div className="w-10 h-1.5 bg-[#D1DDD6] rounded-full mx-auto mb-4 sm:hidden" />
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#ECF4EE] text-[#15803D] flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="sms-modal-title" className="text-lg font-bold text-[#0F1E17]">
                Daily SMS Stock Alert
              </h2>
              <p className="text-xs text-[#4B5E54]">
                Built for seniors & residents without smartphones
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close SMS Alert form"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#4B5E54] hover:bg-[#EFF5F1] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="sms-phone" className="block text-sm font-medium text-[#0F1E17] mb-1.5">
              Mobile Number (SMS)
            </label>
            <input
              id="sms-phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+65 9XXX XXXX"
              className="w-full px-3.5 py-3 rounded-xl border border-[#CBD8D0] text-base text-[#0F1E17] bg-white focus:border-[#15803D]"
            />
            {error && <p className="text-xs text-[#B91C1C] mt-1">{error}</p>}
          </div>

          <div>
            <label htmlFor="sms-block" className="block text-sm font-medium text-[#0F1E17] mb-1.5">
              Preferred HDB Community Fridge
            </label>
            <select
              id="sms-block"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl border border-[#CBD8D0] text-base text-[#0F1E17] bg-white"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.blockName} ({loc.estate})
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="block text-sm font-medium text-[#0F1E17] mb-1.5">
              Alert Time
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(['Morning (8:30 AM)', 'Evening (5:30 PM)'] as const).map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setPreferredTime(slot)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-colors cursor-pointer min-h-[44px] ${
                    preferredTime === slot
                      ? 'bg-[#15803D] border-[#15803D] text-white'
                      : 'bg-white border-[#CBD8D0] text-[#0F1E17] hover:bg-[#F5FAF7]'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#E2EAE5] text-xs text-[#4B5E54] leading-relaxed">
            Sample SMS: “KampungFridge Blk 118: Fresh Bok Choy, Jasmine Rice & Pumpkin available free today until 9 PM. Take what you need!”
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#15803D] text-white text-base font-semibold hover:bg-[#166534] transition-colors cursor-pointer min-h-[48px]"
          >
            Activate Free SMS Alerts
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------------- Claim Item Confirmation Modal ---------------------- */
interface ClaimItemModalProps {
  item: FoodItem | null;
  locations: FridgeLocation[];
  onClose: () => void;
  onConfirm: (item: FoodItem, quantity: number) => void;
}

export function ClaimItemModal({ item, locations, onClose, onConfirm }: ClaimItemModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!item) return null;

  const location = locations.find((l) => l.id === item.locationId);
  const maxQty = Math.min(item.quantity, 3);
  const safeQty = Math.min(quantity, maxQty);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="claim-modal-title"
    >
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl border border-[#E2EAE5] p-6 shadow-xl">
        <div className="w-10 h-1.5 bg-[#D1DDD6] rounded-full mx-auto mb-4 sm:hidden" />
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-medium text-[#15803D]">Free Neighbourhood Collection</p>
            <h2 id="claim-modal-title" className="text-xl font-bold text-[#0F1E17] mt-0.5">
              Reserve {item.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close reservation dialog"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#4B5E54] hover:bg-[#EFF5F1] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-5 text-sm text-[#4B5E54]">
          <div className="flex items-center gap-2 text-[#0F1E17]">
            <MapPin className="w-4 h-4 text-[#15803D] shrink-0" aria-hidden="true" />
            <span>
              {location?.blockName} · {location?.address}
            </span>
          </div>
          <p>
            Available stock: <strong className="text-[#0F1E17] tabular-nums">{item.quantity} {item.unit}</strong> · Best before {item.expiryDate}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-[#0F1E17] mb-2">
            How many {item.unit} do you need? (Max {maxQty} per household)
          </label>
          <div className="flex items-center gap-3">
            {Array.from({ length: maxQty }, (_, idx) => idx + 1).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setQuantity(num)}
                className={`flex-1 py-2.5 rounded-xl border text-base font-semibold tabular-nums transition-colors cursor-pointer min-h-[44px] ${
                  safeQty === num
                    ? 'bg-[#15803D] border-[#15803D] text-white'
                    : 'bg-white border-[#CBD8D0] text-[#0F1E17] hover:bg-[#F5FAF7]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-[#CBD8D0] text-sm font-medium text-[#0F1E17] hover:bg-[#F8FAF9] cursor-pointer min-h-[48px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(item, safeQty);
              setQuantity(1);
            }}
            className="flex-[2] py-3 px-4 rounded-xl bg-[#15803D] text-white text-sm font-semibold hover:bg-[#166534] cursor-pointer min-h-[48px]"
          >
            Confirm Free Pickup
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------- Toast Notification Stack ---------------------- */
interface ToastStackProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-16 md:bottom-6 right-4 left-4 sm:left-auto sm:w-96 z-50 space-y-2 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#0F1E17] text-white rounded-xl p-4 shadow-lg border border-white/10 flex items-start gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-[#4ADE80] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.description && (
              <p className="text-xs text-white/80 mt-0.5 leading-relaxed">{toast.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
            className="text-white/70 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
