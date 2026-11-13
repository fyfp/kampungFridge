import { useCallback, useEffect, useState } from 'react';
import {
  FRIDGE_LOCATIONS,
  INITIAL_CLEANUP_TASKS,
  INITIAL_COOKOUT_EVENT,
  INITIAL_DONATIONS,
  INITIAL_FOOD_ITEMS,
  INITIAL_RECIPES,
  INITIAL_VENDOR_DROPOFFS,
} from '../data/mockData';
import {
  AppTab,
  CleanupTask,
  CookoutEvent,
  DonationRecord,
  FoodCategory,
  FoodItem,
  FreshnessStatus,
  SmsSubscription,
  ToastMessage,
  VendorDropoff,
} from '../types';

export interface DonationInput {
  name: string;
  category: FoodCategory;
  locationId: string;
  quantity: number;
  unit: string;
  daysUntilExpiry: number;
  donatedBy: string;
  halalCertified: boolean;
  storageType: 'Chilled' | 'Dry Pantry';
}

export interface VendorDropoffInput {
  vendorName: string;
  vendorType: VendorDropoff['vendorType'];
  itemsSummary: string;
  weightKg: number;
  locationId: string;
}

export function useCommunityFridge() {
  const [activeTab, setActiveTab] = useState<AppTab>('overview');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('all');
  const [foodItems, setFoodItems] = useState<FoodItem[]>(INITIAL_FOOD_ITEMS);
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);
  const [donorPoints, setDonorPoints] = useState<number>(240);
  const [claimedCount, setClaimedCount] = useState<number>(0);
  const [cleanupTasks, setCleanupTasks] = useState<CleanupTask[]>(INITIAL_CLEANUP_TASKS);
  const [vendorDropoffs, setVendorDropoffs] = useState<VendorDropoff[]>(INITIAL_VENDOR_DROPOFFS);
  const [cookoutEvent, setCookoutEvent] = useState<CookoutEvent>(INITIAL_COOKOUT_EVENT);
  const [largeTextMode, setLargeTextMode] = useState<boolean>(false);
  const [smsSubscription, setSmsSubscription] = useState<SmsSubscription | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modal & drawer state
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);
  const [smsModalOpen, setSmsModalOpen] = useState<boolean>(false);
  const [claimTargetItem, setClaimTargetItem] = useState<FoodItem | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (largeTextMode) {
      root.classList.add('large-text-mode');
    } else {
      root.classList.remove('large-text-mode');
    }
  }, [largeTextMode]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (title: string, description?: string, variant: ToastMessage['variant'] = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-2), { id, title, description, variant }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  // Ready to swap with POST /api/fridge/claim when backend is built
  const confirmClaimItem = useCallback(
    (item: FoodItem, quantityToClaim: number) => {
      setFoodItems((prev) =>
        prev
          .map((existing) =>
            existing.id === item.id
              ? { ...existing, quantity: Math.max(0, existing.quantity - quantityToClaim) }
              : existing
          )
          .filter((existing) => existing.quantity > 0)
      );
      setClaimedCount((prev) => prev + quantityToClaim);
      setClaimTargetItem(null);

      const location = FRIDGE_LOCATIONS.find((loc) => loc.id === item.locationId);
      addToast(
        `Reserved ${quantityToClaim} ${item.unit} of ${item.name}`,
        `Ready for free pickup at ${location?.blockName ?? 'Community Fridge'}. Show pass #KF-${item.id.slice(-3).toUpperCase()}8.`,
        'success'
      );
    },
    [addToast]
  );

  // Ready to swap with POST /api/donations when backend is built
  const submitDonation = useCallback(
    (input: DonationInput) => {
      const freshness: FreshnessStatus =
        input.daysUntilExpiry <= 0
          ? 'Expiring Today'
          : input.daysUntilExpiry <= 2
            ? 'Use Soon'
            : 'Fresh';

      const pointsEarned =
        input.category === 'Fresh Produce' || input.category === 'Protein & Dairy' ? 45 : 30;

      const expiryObj = new Date(2026, 10, 12 + input.daysUntilExpiry);
      const expiryDate = expiryObj.toLocaleDateString('en-SG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      const newItem: FoodItem = {
        id: `item-${Date.now()}`,
        name: input.name,
        category: input.category,
        locationId: input.locationId,
        quantity: input.quantity,
        unit: input.unit,
        freshness,
        expiryDate,
        daysUntilExpiry: input.daysUntilExpiry,
        donatedBy: input.donatedBy || 'Kind Neighbour',
        donorType: 'Resident',
        halalCertified: input.halalCertified,
        storageType: input.storageType,
        addedAt: 'Just now',
        inspected: true,
      };

      const newDonation: DonationRecord = {
        id: `don-${Date.now()}`,
        itemName: input.name,
        category: input.category,
        quantityLabel: `${input.quantity} ${input.unit}`,
        locationId: input.locationId,
        dateLabel: 'Just now',
        pointsEarned,
        status: 'Active in Fridge',
      };

      setFoodItems((prev) => [newItem, ...prev]);
      setDonations((prev) => [newDonation, ...prev]);
      setDonorPoints((prev) => prev + pointsEarned);

      addToast(
        `Thank you! +${pointsEarned} Donor Points earned`,
        `${input.quantity} ${input.unit} of ${input.name} is now live in the fridge stock.`,
        'success'
      );
    },
    [addToast]
  );

  const toggleCleanupTask = useCallback((taskId: string) => {
    setCleanupTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const markItemInspected = useCallback(
    (itemId: string) => {
      setFoodItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, inspected: true } : item))
      );
      addToast('Quality check recorded', 'Item marked as inspected by volunteer crew.', 'info');
    },
    [addToast]
  );

  const sendExpirySmsBlast = useCallback(
    (item: FoodItem) => {
      const location = FRIDGE_LOCATIONS.find((l) => l.id === item.locationId);
      addToast(
        `Priority SMS queued for ${location?.blockName ?? 'HDB Block'}`,
        `Subscribers notified to collect ${item.name} before it expires today.`,
        'info'
      );
    },
    [addToast]
  );

  const logVendorDropoff = useCallback(
    (input: VendorDropoffInput) => {
      const dropoff: VendorDropoff = {
        id: `vnd-${Date.now()}`,
        vendorName: input.vendorName,
        vendorType: input.vendorType,
        itemsSummary: input.itemsSummary,
        weightKg: input.weightKg,
        locationId: input.locationId,
        receivedAt: 'Just now',
      };
      setVendorDropoffs((prev) => [dropoff, ...prev]);
      addToast(
        'Vendor surplus drop-off logged',
        `${input.weightKg.toFixed(1)} kg from ${input.vendorName} added to daily log.`,
        'success'
      );
    },
    [addToast]
  );

  const toggleCookoutRsvp = useCallback(() => {
    setCookoutEvent((prev) => {
      const nextRsvp = !prev.rsvped;
      addToast(
        nextRsvp ? 'RSVP confirmed for Q4 Community Cookout' : 'Cookout RSVP cancelled',
        nextRsvp
          ? `We saved your seat at ${prev.venue}. Bring your family along!`
          : 'Your spot has been released for other neighbours.',
        nextRsvp ? 'success' : 'info'
      );
      return {
        ...prev,
        rsvped: nextRsvp,
        spotsRemaining: nextRsvp ? Math.max(0, prev.spotsRemaining - 1) : prev.spotsRemaining + 1,
      };
    });
  }, [addToast]);

  const subscribeSmsAlert = useCallback(
    (subscription: Omit<SmsSubscription, 'active'>) => {
      setSmsSubscription({ ...subscription, active: true });
      setSmsModalOpen(false);
      const location = FRIDGE_LOCATIONS.find((l) => l.id === subscription.locationId);
      addToast(
        'Daily SMS Stock Alerts activated',
        `Sending ${subscription.preferredTime} updates for ${location?.blockName ?? 'your HDB block'} to ${subscription.phoneNumber}.`,
        'success'
      );
    },
    [addToast]
  );

  const handleQrScanSelect = useCallback(
    (locationId: string) => {
      setSelectedLocationId(locationId);
      setActiveTab('fridge');
      setQrModalOpen(false);
      const location = FRIDGE_LOCATIONS.find((l) => l.id === locationId);
      addToast(
        `Connected to ${location?.blockName ?? 'Community Fridge'}`,
        `Showing live chilled & pantry items for ${location?.qrCodeLabel ?? 'this fridge'}.`,
        'info'
      );
    },
    [addToast]
  );

  const redeemReward = useCallback(
    (title: string, cost: number) => {
      if (donorPoints < cost) return;
      setDonorPoints((prev) => prev - cost);
      addToast(
        `Redeemed: ${title}`,
        `${cost} Donor Points used. Your digital voucher code is ready at the void deck partner counter.`,
        'success'
      );
    },
    [donorPoints, addToast]
  );

  return {
    activeTab,
    setActiveTab,
    selectedLocationId,
    setSelectedLocationId,
    locations: FRIDGE_LOCATIONS,
    foodItems,
    recipes: INITIAL_RECIPES,
    donations,
    donorPoints,
    claimedCount,
    cleanupTasks,
    vendorDropoffs,
    cookoutEvent,
    largeTextMode,
    setLargeTextMode,
    smsSubscription,
    toasts,
    dismissToast,
    addToast,
    qrModalOpen,
    setQrModalOpen,
    smsModalOpen,
    setSmsModalOpen,
    claimTargetItem,
    setClaimTargetItem,
    confirmClaimItem,
    submitDonation,
    redeemReward,
    toggleCleanupTask,
    markItemInspected,
    sendExpirySmsBlast,
    logVendorDropoff,
    toggleCookoutRsvp,
    subscribeSmsAlert,
    handleQrScanSelect,
  };
}
