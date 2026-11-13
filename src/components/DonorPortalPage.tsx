import { useState } from 'react';
import { Award, CheckCircle2, Gift, HeartHandshake } from 'lucide-react';
import { DonationInput } from '../hooks/useCommunityFridge';
import { DonationRecord, FoodCategory, FridgeLocation } from '../types';

interface DonorPortalPageProps {
  locations: FridgeLocation[];
  donations: DonationRecord[];
  donorPoints: number;
  onSubmitDonation: (input: DonationInput) => void;
  onRedeemReward: (title: string, cost: number) => void;
}

const REWARDS = [
  {
    id: 'rew-1',
    title: '$5 Neighbourhood Kopitiam Voucher',
    description: 'Redeemable at participating Toa Payoh & Tampines hawker stalls',
    cost: 150,
  },
  {
    id: 'rew-2',
    title: 'Reusable KampungFridge Grocery Tote',
    description: 'Washable insulated tote bag for carrying fresh produce',
    cost: 200,
  },
  {
    id: 'rew-3',
    title: 'Sponsor 1 Family Pantry Pack',
    description: 'Convert your points into rice & cooking oil for a senior household',
    cost: 300,
  },
];

export function DonorPortalPage({
  locations,
  donations,
  donorPoints,
  onSubmitDonation,
  onRedeemReward,
}: DonorPortalPageProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Fresh Produce');
  const [locationId, setLocationId] = useState(locations[0]?.id ?? 'tp-118');
  const [quantity, setQuantity] = useState(2);
  const [unit, setUnit] = useState('packs');
  const [daysUntilExpiry, setDaysUntilExpiry] = useState(3);
  const [donatedBy, setDonatedBy] = useState('Mdm Tan (Blk 118)');
  const [halalCertified, setHalalCertified] = useState(true);
  const [formError, setFormError] = useState('');

  const estimatedPoints =
    category === 'Fresh Produce' || category === 'Protein & Dairy' ? 45 : 30;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter the food item name.');
      return;
    }
    setFormError('');
    onSubmitDonation({
      name: name.trim(),
      category,
      locationId,
      quantity,
      unit,
      daysUntilExpiry,
      donatedBy: donatedBy.trim(),
      halalCertified,
      storageType: category === 'Dried & Pantry' ? 'Dry Pantry' : 'Chilled',
    });
    setName('');
    setQuantity(2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F1E17]">
          Donor Portal & Community Points
        </h1>
        <p className="mt-1 text-sm sm:text-base text-[#4B5E54]">
          Share surplus fresh ingredients or unopened pantry staples, see neighbours benefit, and earn community rewards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Log Donation Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-6 bg-white rounded-2xl border border-[#E2EAE5] p-6 space-y-5"
        >
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#EDF3EF]">
            <div className="flex items-center gap-2.5">
              <HeartHandshake className="w-5 h-5 text-[#15803D]" aria-hidden="true" />
              <h2 className="font-display text-lg font-bold text-[#0F1E17]">
                Log Food Contribution
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#15803D] font-mono tabular-nums">
              +{estimatedPoints} pts
            </span>
          </div>

          <div>
            <label htmlFor="donate-name" className="block text-sm font-medium text-[#0F1E17] mb-1.5">
              Ingredient or Food Name
            </label>
            <input
              id="donate-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chye Sim, Wholemeal Bread, Basmati Rice"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm text-[#0F1E17] bg-white focus:border-[#15803D]"
            />
            {formError && <p className="text-xs text-[#B91C1C] mt-1">{formError}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="donate-category" className="block text-sm font-medium text-[#0F1E17] mb-1.5">
                Category
              </label>
              <select
                id="donate-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm text-[#0F1E17] bg-white"
              >
                <option value="Fresh Produce">Fresh Produce</option>
                <option value="Dried & Pantry">Dried & Pantry</option>
                <option value="Protein & Dairy">Protein & Dairy</option>
                <option value="Bakery & Ready">Bakery & Ready</option>
              </select>
            </div>

            <div>
              <label htmlFor="donate-location" className="block text-sm font-medium text-[#0F1E17] mb-1.5">
                Drop-off HDB Fridge
              </label>
              <select
                id="donate-location"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm text-[#0F1E17] bg-white"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.blockName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="donate-qty" className="block text-sm font-medium text-[#0F1E17] mb-1.5">
                Quantity
              </label>
              <input
                id="donate-qty"
                type="number"
                min={1}
                max={50}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm font-mono tabular-nums text-[#0F1E17]"
              />
            </div>

            <div>
              <label htmlFor="donate-unit" className="block text-sm font-medium text-[#0F1E17] mb-1.5">
                Unit
              </label>
              <select
                id="donate-unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm text-[#0F1E17] bg-white"
              >
                <option value="packs">packs</option>
                <option value="bags">bags</option>
                <option value="boxes">boxes</option>
                <option value="kg">kg</option>
              </select>
            </div>

            <div>
              <label htmlFor="donate-expiry" className="block text-sm font-medium text-[#0F1E17] mb-1.5">
                Best Before
              </label>
              <select
                id="donate-expiry"
                value={daysUntilExpiry}
                onChange={(e) => setDaysUntilExpiry(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm text-[#0F1E17] bg-white"
              >
                <option value={0}>Today</option>
                <option value={2}>In 2 days</option>
                <option value={5}>In 5 days</option>
                <option value={90}>3+ months</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="donate-by" className="block text-sm font-medium text-[#0F1E17] mb-1.5">
              Your Name or Block (displayed to neighbours)
            </label>
            <input
              id="donate-by"
              type="text"
              value={donatedBy}
              onChange={(e) => setDonatedBy(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm text-[#0F1E17]"
            />
          </div>

          <label className="flex items-center gap-2.5 text-sm text-[#0F1E17] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={halalCertified}
              onChange={(e) => setHalalCertified(e.target.checked)}
              className="w-4 h-4 accent-[#15803D] rounded"
            />
            <span>Halal-friendly / Muslim-friendly ingredient</span>
          </label>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-[#15803D] text-white text-sm font-semibold hover:bg-[#166534] active:scale-[0.98] transition-all cursor-pointer min-h-[48px]"
          >
            Add to Live Fridge Stock & Claim +{estimatedPoints} Points
          </button>
        </form>

        {/* Right Column: Points Summary, Rewards & History */}
        <div className="lg:col-span-6 space-y-6">
          {/* Impact & Points Summary */}
          <div className="bg-white rounded-2xl border border-[#E2EAE5] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#4B5E54]">Your Donor Points Balance</p>
                <p className="mt-1 font-display text-3xl sm:text-4xl font-bold text-[#0F1E17] tabular-nums">
                  {donorPoints} pts
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#ECF4EE] text-[#15803D] flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" aria-hidden="true" />
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-[#EDF3EF] grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-[#4B5E54]">Neighbours Helped</p>
                <p className="mt-0.5 text-lg font-bold text-[#0F1E17] tabular-nums">
                  {14 + donations.length} households
                </p>
              </div>
              <div>
                <p className="text-xs text-[#4B5E54]">Estimated Food Rescued</p>
                <p className="mt-0.5 text-lg font-bold text-[#0F1E17] tabular-nums">
                  {(11.5 + donations.length * 1.8).toFixed(1)} kg
                </p>
              </div>
            </div>
          </div>

          {/* Redeemable Community Rewards */}
          <div className="bg-white rounded-2xl border border-[#E2EAE5] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-5 h-5 text-[#15803D]" aria-hidden="true" />
              <h2 className="font-display text-lg font-bold text-[#0F1E17]">
                Neighbourhood Rewards
              </h2>
            </div>

            <div className="divide-y divide-[#EDF3EF]">
              {REWARDS.map((reward) => {
                const canRedeem = donorPoints >= reward.cost;
                return (
                  <div
                    key={reward.id}
                    className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#0F1E17]">{reward.title}</p>
                      <p className="text-xs text-[#4B5E54] mt-0.5">{reward.description}</p>
                    </div>
                    <button
                      type="button"
                      disabled={!canRedeem}
                      onClick={() => onRedeemReward(reward.title, reward.cost)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold tabular-nums whitespace-nowrap shrink-0 transition-colors min-h-[38px] ${
                        canRedeem
                          ? 'bg-[#0F1E17] text-white hover:bg-[#1E3529] cursor-pointer'
                          : 'bg-[#F2F6F3] text-[#83948B] cursor-not-allowed'
                      }`}
                    >
                      {reward.cost} pts
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Contributions Table */}
          <div className="bg-white rounded-2xl border border-[#E2EAE5] p-6">
            <h2 className="font-display text-lg font-bold text-[#0F1E17] mb-3">
              Recent Contributions
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#E2EAE5] text-xs text-[#4B5E54]">
                    <th className="py-2.5 font-medium">Item</th>
                    <th className="py-2.5 font-medium">Status</th>
                    <th className="py-2.5 font-medium text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF3EF]">
                  {donations.map((don) => (
                    <tr key={don.id} className="h-11">
                      <td className="py-2 pr-3">
                        <p className="font-medium text-[#0F1E17]">{don.itemName}</p>
                        <p className="text-xs text-[#4B5E54]">
                          {don.quantityLabel} · {don.dateLabel}
                        </p>
                      </td>
                      <td className="py-2 pr-3 text-xs font-medium text-[#15803D]">
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{don.status}</span>
                        </span>
                      </td>
                      <td className="py-2 text-right font-mono font-semibold text-[#0F1E17] tabular-nums">
                        +{don.pointsEarned}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
