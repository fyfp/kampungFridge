import { useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  MessageSquare,
  Truck,
} from 'lucide-react';
import { VendorDropoffInput } from '../hooks/useCommunityFridge';
import { CleanupTask, FoodItem, FridgeLocation, VendorDropoff } from '../types';

interface VolunteerDashboardPageProps {
  locations: FridgeLocation[];
  foodItems: FoodItem[];
  cleanupTasks: CleanupTask[];
  vendorDropoffs: VendorDropoff[];
  onToggleCleanupTask: (taskId: string) => void;
  onMarkInspected: (itemId: string) => void;
  onSendExpirySms: (item: FoodItem) => void;
  onLogVendorDropoff: (input: VendorDropoffInput) => void;
}

export function VolunteerDashboardPage({
  locations,
  foodItems,
  cleanupTasks,
  vendorDropoffs,
  onToggleCleanupTask,
  onMarkInspected,
  onSendExpirySms,
  onLogVendorDropoff,
}: VolunteerDashboardPageProps) {
  const [vendorName, setVendorName] = useState('');
  const [vendorType, setVendorType] = useState<VendorDropoff['vendorType']>('Restaurant');
  const [itemsSummary, setItemsSummary] = useState('');
  const [weightKg, setWeightKg] = useState(5.0);
  const [locationId, setLocationId] = useState(locations[0]?.id ?? 'tp-118');

  const priorityWatchlist = foodItems.filter(
    (i) => i.freshness === 'Expiring Today' || i.freshness === 'Use Soon'
  );
  const pendingCleanups = cleanupTasks.filter((t) => !t.completed).length;
  const totalVendorKg = vendorDropoffs.reduce((sum, d) => sum + d.weightKg, 0);

  const handleDropoffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName.trim() || !itemsSummary.trim()) return;
    onLogVendorDropoff({
      vendorName: vendorName.trim(),
      vendorType,
      itemsSummary: itemsSummary.trim(),
      weightKg,
      locationId,
    });
    setVendorName('');
    setItemsSummary('');
    setWeightKg(5.0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F1E17]">
          Grassroots & Volunteer Operations
        </h1>
        <p className="mt-1 text-sm sm:text-base text-[#4B5E54]">
          Manage daily expiry alerts, fridge cleanup schedules, and surplus vendor deliveries across HDB blocks.
        </p>
      </div>

      {/* 4-Column Operations KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E2EAE5] p-5">
          <p className="text-xs font-medium text-[#4B5E54]">Expiry Watchlist</p>
          <p className="mt-1 text-2xl font-bold text-[#0F1E17] tabular-nums">
            {priorityWatchlist.length} items
          </p>
          <p className="mt-1 text-xs text-[#B45309] font-medium">
            Needs pickup or SMS alert
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2EAE5] p-5">
          <p className="text-xs font-medium text-[#4B5E54]">Pending Cleanup Tasks</p>
          <p className="mt-1 text-2xl font-bold text-[#0F1E17] tabular-nums">
            {pendingCleanups} / {cleanupTasks.length}
          </p>
          <p className="mt-1 text-xs text-[#4B5E54]">
            Scheduled today
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2EAE5] p-5">
          <p className="text-xs font-medium text-[#4B5E54]">Vendor Surplus Logged</p>
          <p className="mt-1 text-2xl font-bold text-[#0F1E17] tabular-nums">
            {totalVendorKg.toFixed(1)} kg
          </p>
          <p className="mt-1 text-xs text-[#15803D] font-medium">
            {vendorDropoffs.length} deliveries today
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2EAE5] p-5">
          <p className="text-xs font-medium text-[#4B5E54]">Maintenance Coverage</p>
          <p className="mt-1 text-2xl font-bold text-[#0F1E17] tabular-nums">
            {locations.length} / {locations.length}
          </p>
          <p className="mt-1 text-xs text-[#4B5E54]">
            All smart fridges nominal
          </p>
        </div>
      </div>

      {/* Expiry & Quality Watchlist Table */}
      <section className="bg-white rounded-2xl border border-[#E2EAE5] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-[#0F1E17]">
              Expiry & Quality Watchlist
            </h2>
            <p className="text-xs text-[#4B5E54]">
              Prioritise near-expiry items via SMS alert so edible ingredients never go to waste.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#E2EAE5] text-xs text-[#4B5E54]">
                <th className="py-2.5 pr-4 font-medium">Ingredient</th>
                <th className="py-2.5 pr-4 font-medium">HDB Block</th>
                <th className="py-2.5 pr-4 font-medium">Status</th>
                <th className="py-2.5 pr-4 font-medium text-right">Qty</th>
                <th className="py-2.5 font-medium text-right">Volunteer Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDF3EF]">
              {priorityWatchlist.map((item) => {
                const loc = locations.find((l) => l.id === item.locationId);
                return (
                  <tr key={item.id} className="h-12 hover:bg-[#F8FAF9]">
                    <td className="py-2.5 pr-4 font-medium text-[#0F1E17] whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-[#4B5E54] whitespace-nowrap">
                      {loc?.blockName}
                    </td>
                    <td className="py-2.5 pr-4 whitespace-nowrap">
                      {item.freshness === 'Expiring Today' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#B91C1C]">
                          <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                          Expiring Today
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#B45309]">
                          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                          Use Soon
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 pr-4 text-right font-mono text-xs text-[#0F1E17] tabular-nums whitespace-nowrap">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-2.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        {item.inspected ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#15803D] px-2.5 py-1">
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            Inspected
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onMarkInspected(item.id)}
                            className="px-3 py-1.5 rounded-lg border border-[#CBD8D0] text-xs font-medium text-[#0F1E17] hover:bg-[#EFF5F1] cursor-pointer min-h-[34px]"
                          >
                            Mark Inspected
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onSendExpirySms(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0F1E17] text-white text-xs font-medium hover:bg-[#1E3529] cursor-pointer min-h-[34px]"
                        >
                          <MessageSquare className="w-3 h-3" aria-hidden="true" />
                          <span>SMS Alert</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cleanup & Maintenance Checklist */}
        <section className="lg:col-span-6 bg-white rounded-2xl border border-[#E2EAE5] p-6">
          <h2 className="font-display text-lg font-bold text-[#0F1E17]">
            Daily Cleanup & Maintenance Checklist
          </h2>
          <p className="mt-1 text-xs text-[#4B5E54] mb-4">
            Coordinated between grassroots volunteers and monthly maintenance crew.
          </p>

          <div className="divide-y divide-[#EDF3EF]">
            {cleanupTasks.map((task) => {
              const loc = locations.find((l) => l.id === task.locationId);
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => onToggleCleanupTask(task.id)}
                  className="w-full py-3.5 flex items-start gap-3 text-left hover:bg-[#F8FAF9] px-2 -mx-2 rounded-xl transition-colors cursor-pointer min-h-[52px]"
                >
                  <span
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      task.completed
                        ? 'bg-[#15803D] border-[#15803D] text-white'
                        : 'border-[#CBD8D0] bg-white'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        task.completed ? 'line-through text-[#6B7D73]' : 'text-[#0F1E17]'
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-[#4B5E54] mt-0.5">
                      {loc?.blockName} · Assigned to {task.assignedTo} · {task.scheduledTime}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Vendor Surplus Drop-off Logger */}
        <section className="lg:col-span-6 bg-white rounded-2xl border border-[#E2EAE5] p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#15803D]" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-[#0F1E17]">
              Vendor Surplus Drop-off Log
            </h2>
          </div>

          <form onSubmit={handleDropoffSubmit} className="space-y-3 pb-5 border-b border-[#EDF3EF]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="Vendor or restaurant name"
                aria-label="Vendor or restaurant name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm text-[#0F1E17]"
              />
              <select
                value={vendorType}
                onChange={(e) => setVendorType(e.target.value as VendorDropoff['vendorType'])}
                aria-label="Vendor type"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm text-[#0F1E17] bg-white"
              >
                <option value="Restaurant">Restaurant</option>
                <option value="Supermarket">Supermarket</option>
                <option value="Wholesale Supplier">Wholesale Supplier</option>
                <option value="Bakery">Bakery</option>
              </select>
            </div>

            <input
              type="text"
              value={itemsSummary}
              onChange={(e) => setItemsSummary(e.target.value)}
              placeholder="Items summary (e.g. 12 loaves wholemeal bread, 5kg tomatoes)"
              aria-label="Items summary"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm text-[#0F1E17]"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                aria-label="Receiving HDB Fridge"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm text-[#0F1E17] bg-white"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.blockName}
                  </option>
                ))}
              </select>

              <input
                type="number"
                step="0.5"
                min="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(Math.max(0.5, Number(e.target.value)))}
                aria-label="Weight in kg"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8D0] text-sm font-mono tabular-nums text-[#0F1E17]"
              />

              <button
                type="submit"
                className="col-span-2 sm:col-span-1 px-4 py-2.5 rounded-xl bg-[#15803D] text-white text-sm font-semibold hover:bg-[#166534] cursor-pointer min-h-[42px]"
              >
                Log Drop-off
              </button>
            </div>
          </form>

          <div className="divide-y divide-[#EDF3EF]">
            {vendorDropoffs.map((drop) => {
              const loc = locations.find((l) => l.id === drop.locationId);
              return (
                <div key={drop.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3 text-sm">
                  <div>
                    <p className="font-semibold text-[#0F1E17]">
                      {drop.vendorName} <span className="font-normal text-xs text-[#4B5E54]">· {drop.vendorType}</span>
                    </p>
                    <p className="text-xs text-[#4B5E54] mt-0.5">
                      {drop.itemsSummary} · {loc?.blockName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono font-semibold text-xs text-[#15803D] tabular-nums">
                      {drop.weightKg.toFixed(1)} kg
                    </p>
                    <p className="text-[11px] text-[#6B7D73] mt-0.5">{drop.receivedAt}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
