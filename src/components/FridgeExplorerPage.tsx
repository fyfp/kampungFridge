import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  Thermometer,
} from 'lucide-react';
import { FoodCategory, FoodItem, FreshnessStatus, FridgeLocation } from '../types';

interface FridgeExplorerPageProps {
  locations: FridgeLocation[];
  selectedLocationId: string;
  onSelectLocation: (id: string) => void;
  foodItems: FoodItem[];
  selectedItemIds: string[];
  onToggleSelectItem: (itemId: string) => void;
  onClearSelection: () => void;
  onClaimClick: (item: FoodItem) => void;
  onMatchRecipes: (fallbackItemNames: string[]) => void;
}

const CATEGORIES: ('All' | FoodCategory)[] = [
  'All',
  'Fresh Produce',
  'Dried & Pantry',
  'Protein & Dairy',
];

const FRESHNESS_FILTERS: ('All' | FreshnessStatus)[] = [
  'All',
  'Fresh',
  'Use Soon',
  'Expiring Today',
];

function FreshnessIndicator({ status }: { status: FreshnessStatus }) {
  if (status === 'Expiring Today') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B91C1C]">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>Expiring Today</span>
      </span>
    );
  }
  if (status === 'Use Soon') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B45309]">
        <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>Use Soon</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>Fresh</span>
    </span>
  );
}

export function FridgeExplorerPage({
  locations,
  selectedLocationId,
  onSelectLocation,
  foodItems,
  selectedItemIds,
  onToggleSelectItem,
  onClearSelection,
  onClaimClick,
  onMatchRecipes,
}: FridgeExplorerPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | FoodCategory>('All');
  const [selectedFreshness, setSelectedFreshness] = useState<'All' | FreshnessStatus>('All');

  const activeLocation = locations.find((l) => l.id === selectedLocationId);

  const filteredItems = useMemo(() => {
    return foodItems.filter((item) => {
      if (selectedLocationId !== 'all' && item.locationId !== selectedLocationId) return false;
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (selectedFreshness !== 'All' && item.freshness !== selectedFreshness) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDonor = item.donatedBy.toLowerCase().includes(q);
        if (!matchName && !matchDonor) return false;
      }
      return true;
    });
  }, [foodItems, selectedLocationId, selectedCategory, selectedFreshness, searchQuery]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedFreshness('All');
    onSelectLocation('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 space-y-6">
      {/* Page Header & Smart Fridge Sensor Status */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F1E17]">
            Real-Time Fridge & Pantry Stock
          </h1>
          <p className="mt-1 text-sm sm:text-base text-[#4B5E54]">
            Free fresh ingredients and dried staples shared by neighbours and local food vendors.
          </p>
        </div>

        {activeLocation ? (
          <div className="flex flex-wrap items-center gap-4 px-4 py-3 rounded-xl bg-white border border-[#E2EAE5] text-sm">
            <div className="flex items-center gap-1.5 text-[#0F1E17] font-medium">
              <Thermometer className="w-4 h-4 text-[#15803D]" aria-hidden="true" />
              <span className="font-mono tabular-nums">{activeLocation.temperatureC.toFixed(1)}°C</span>
              <span className="text-[#4B5E54] text-xs">Chilled</span>
            </div>
            <span aria-hidden="true" className="text-[#CBD8D0]">|</span>
            <div className="text-xs text-[#4B5E54]">
              Capacity <strong className="text-[#0F1E17] font-mono tabular-nums">{activeLocation.capacityPercent}%</strong> · Updated {activeLocation.lastRestocked}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E2EAE5] text-xs sm:text-sm text-[#4B5E54]">
            <Thermometer className="w-4 h-4 text-[#15803D]" aria-hidden="true" />
            <span>
              All <strong className="text-[#0F1E17] tabular-nums">{locations.length}</strong> smart fridges operating between <span className="font-mono tabular-nums text-[#0F1E17]">3.2°C–3.8°C</span>
            </span>
          </div>
        )}
      </div>

      {/* HDB Block Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onSelectLocation('all')}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[42px] ${
            selectedLocationId === 'all'
              ? 'bg-[#0F1E17] border-[#0F1E17] text-white'
              : 'bg-white border-[#DCE7E0] text-[#0F1E17] hover:bg-[#EFF5F1]'
          }`}
        >
          All HDB Blocks ({foodItems.length})
        </button>

        {locations.map((loc) => {
          const count = foodItems.filter((i) => i.locationId === loc.id).length;
          const isSelected = selectedLocationId === loc.id;
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => onSelectLocation(loc.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[42px] ${
                isSelected
                  ? 'bg-[#15803D] border-[#15803D] text-white'
                  : 'bg-white border-[#DCE7E0] text-[#0F1E17] hover:bg-[#EFF5F1]'
              }`}
            >
              {loc.blockName} ({count})
            </button>
          );
        })}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-[#E2EAE5] p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="w-4 h-4 text-[#5C7065] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bok choy, rice, pasta, tomatoes..."
              aria-label="Search fridge ingredients"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCE7E0] text-sm text-[#0F1E17] bg-[#F8FAF9] focus:bg-white focus:border-[#15803D]"
            />
          </div>

          {/* Recipe Matcher Shortcut */}
          <div className="flex flex-wrap items-center gap-2">
            {selectedItemIds.length > 0 && (
              <button
                type="button"
                onClick={onClearSelection}
                className="px-3 py-2.5 rounded-xl border border-[#DCE7E0] bg-white text-xs sm:text-sm font-medium text-[#4B5E54] hover:text-[#0F1E17] hover:bg-[#F8FAF9] cursor-pointer whitespace-nowrap min-h-[42px]"
              >
                Clear ({selectedItemIds.length})
              </button>
            )}
            <button
              type="button"
              onClick={() => onMatchRecipes(filteredItems.map((i) => i.name))}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[42px] ${
                selectedItemIds.length > 0
                  ? 'bg-[#0F1E17] text-white hover:bg-[#1E3529]'
                  : 'bg-[#EFF5F1] text-[#15803D] hover:bg-[#E1EDE5]'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                {selectedItemIds.length > 0
                  ? `Match Recipes With These Items (${selectedItemIds.length})`
                  : 'Match Recipes With These Items'}
              </span>
            </button>
          </div>
        </div>

        {/* Segmented Category & Freshness Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-[#EDF3EF]">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F2F6F3] rounded-xl">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] ${
                  selectedCategory === category
                    ? 'bg-white text-[#0F1E17] shadow-xs'
                    : 'text-[#4B5E54] hover:text-[#0F1E17]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F2F6F3] rounded-xl">
            {FRESHNESS_FILTERS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedFreshness(status)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] ${
                  selectedFreshness === status
                    ? 'bg-white text-[#0F1E17] shadow-xs'
                    : 'text-[#4B5E54] hover:text-[#0F1E17]'
                }`}
              >
                {status === 'All' ? 'All Freshness' : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2EAE5] p-10 text-center">
          <p className="text-base font-semibold text-[#0F1E17]">
            No ingredients match your current filters
          </p>
          <p className="mt-1 text-sm text-[#4B5E54]">
            Try clearing your search or checking another HDB community fridge nearby.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[#15803D] text-white text-sm font-semibold hover:bg-[#166534] cursor-pointer min-h-[44px]"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const loc = locations.find((l) => l.id === item.locationId);
            const isSelected = selectedItemIds.includes(item.id);
            return (
              <article
                key={item.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-colors ${
                  isSelected
                    ? 'bg-[#F4FAF6] border-[#15803D]'
                    : 'bg-white border-[#E2EAE5] hover:border-[#B9CEC1]'
                }`}
              >
                <div>
                  {/* Quiet 1-line kicker metadata (NO pill boxes) */}
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-[#4B5E54] truncate">
                      {item.category} · {item.storageType}
                    </p>
                    <FreshnessIndicator status={item.freshness} />
                  </div>

                  {/* Primary Item Title */}
                  <h2 className="mt-2.5 font-display text-lg font-bold text-[#0F1E17]">
                    {item.name}
                  </h2>

                  {/* Unboxed Typographic Metadata */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#4B5E54]">
                    <span className="font-semibold text-[#0F1E17] tabular-nums">
                      {item.quantity} {item.unit} available
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Best before {item.expiryDate}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#EDF3EF] space-y-1 text-xs text-[#4B5E54]">
                    <div className="flex items-center gap-1.5 text-[#0F1E17]">
                      <MapPin className="w-3.5 h-3.5 text-[#15803D] shrink-0" aria-hidden="true" />
                      <span>{loc?.blockName}</span>
                    </div>
                    <p>
                      Shared by {item.donatedBy}
                      {item.halalCertified ? ' · Halal-friendly' : ''}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onToggleSelectItem(item.id)}
                    aria-pressed={isSelected}
                    className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px] ${
                      isSelected
                        ? 'bg-[#0F1E17] border-[#0F1E17] text-white'
                        : 'bg-white border-[#CBD8D0] text-[#0F1E17] hover:bg-[#EFF5F1]'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-white bg-[#15803D]' : 'border-[#8EA397]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" aria-hidden="true" />}
                    </span>
                    <span>{isSelected ? 'Selected' : 'Select'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onClaimClick(item)}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#15803D] text-white text-sm font-semibold hover:bg-[#166534] active:scale-[0.98] transition-all cursor-pointer min-h-[44px] whitespace-nowrap"
                  >
                    Claim Free
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
