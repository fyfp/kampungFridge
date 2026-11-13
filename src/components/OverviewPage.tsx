import { ArrowRight, Calendar, Check, MapPin, MessageSquare, QrCode, Users } from 'lucide-react';
import { IMAGE_ASSETS, KEY_PARTNERS } from '../data/mockData';
import { AppTab, CookoutEvent, FoodItem, FridgeLocation } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface OverviewPageProps {
  locations: FridgeLocation[];
  foodItems: FoodItem[];
  claimedCount: number;
  cookoutEvent: CookoutEvent;
  onNavigateTab: (tab: AppTab) => void;
  onOpenQrModal: () => void;
  onOpenSmsModal: () => void;
  onToggleCookoutRsvp: () => void;
}

export function OverviewPage({
  locations,
  foodItems,
  claimedCount,
  cookoutEvent,
  onNavigateTab,
  onOpenQrModal,
  onOpenSmsModal,
  onToggleCookoutRsvp,
}: OverviewPageProps) {
  const totalAvailableUnits = foodItems.reduce((acc, item) => acc + item.quantity, 0);
  const expiringTodayCount = foodItems.filter((i) => i.freshness === 'Expiring Today').length;

  return (
    <div className="space-y-16 pb-16">
      {/* Section 1: Digital Poster Hero Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Hero Copy Column */}
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div>
              <p className="text-sm font-medium text-[#15803D] mb-3">
                HDB Neighbourhood Food-Sharing Initiative · Singapore
              </p>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F1E17] leading-[1.12] text-balance">
                Share surplus food. Nourish every neighbour on your block.
              </h1>
              <p className="mt-5 text-base sm:text-lg text-[#4B5E54] leading-relaxed max-w-xl">
                Check real-time stock inside your void deck community fridge, discover simple recipes using today’s fresh produce, or donate unused ingredients to earn community rewards.
              </p>

              {/* Primary + Secondary CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onNavigateTab('fridge')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#15803D] text-white text-sm sm:text-base font-semibold hover:bg-[#166534] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[48px]"
                >
                  <span>Browse Live Fridge Stock</span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={onOpenSmsModal}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-[#CBD8D0] text-[#0F1E17] text-sm sm:text-base font-medium hover:bg-[#EFF5F1] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[48px]"
                >
                  <MessageSquare className="w-4 h-4 text-[#15803D] shrink-0" aria-hidden="true" />
                  <span>Register SMS Alerts</span>
                </button>
              </div>
            </div>

            {/* Quiet Quick-Access Links */}
            <div className="mt-8 pt-6 border-t border-[#E2EAE5] flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#4B5E54]">
              <button
                type="button"
                onClick={onOpenQrModal}
                className="inline-flex items-center gap-1.5 font-medium text-[#0F1E17] hover:text-[#15803D] transition-colors cursor-pointer whitespace-nowrap"
              >
                <QrCode className="w-4 h-4 text-[#15803D]" aria-hidden="true" />
                <span>At a void deck? Scan Fridge QR</span>
              </button>
              <span aria-hidden="true" className="hidden sm:inline text-[#CBD8D0]">·</span>
              <button
                type="button"
                onClick={() => onNavigateTab('donate')}
                className="font-medium text-[#0F1E17] hover:text-[#15803D] transition-colors cursor-pointer whitespace-nowrap"
              >
                Donate surplus food →
              </button>
            </div>
          </div>

          {/* Hero Photography Column */}
          <div className="lg:col-span-6">
            <div className="relative h-64 sm:h-80 lg:h-full min-h-[320px] rounded-2xl overflow-hidden border border-[#E2EAE5] bg-[#EFF5F1]">
              <ImageWithFallback
                src={IMAGE_ASSETS.heroFridge}
                alt="Clean glass-door community fridge and wooden pantry shelf at a bright Singapore HDB void deck"
                className="w-full h-full object-cover"
                fallbackLabel="HDB Void Deck Community Fridge"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 sm:p-6 text-white">
                <p className="text-xs font-medium text-white/85">
                  {locations[0]?.blockName} · {locations[0]?.lastRestocked}
                </p>
                <p className="text-sm sm:text-base font-semibold mt-0.5">
                  Fresh leafy greens, tomatoes, jasmine rice & pasta stocked free for residents
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Live Community Impact KPI Strip */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-[#E2EAE5] p-5">
            <p className="text-xs font-medium text-[#4B5E54]">Available Portions Today</p>
            <p className="mt-1.5 text-2xl sm:text-3xl font-bold text-[#0F1E17] tabular-nums">
              {totalAvailableUnits}
            </p>
            <p className="mt-1 text-xs text-[#15803D] font-medium">
              {expiringTodayCount} items need pickup today
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#E2EAE5] p-5">
            <p className="text-xs font-medium text-[#4B5E54]">Food Saved This Month</p>
            <p className="mt-1.5 text-2xl sm:text-3xl font-bold text-[#0F1E17] tabular-nums">
              342 kg
            </p>
            <p className="mt-1 text-xs text-[#4B5E54]">
              Fresh produce & dry staples
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#E2EAE5] p-5">
            <p className="text-xs font-medium text-[#4B5E54]">Active HDB Fridges</p>
            <p className="mt-1.5 text-2xl sm:text-3xl font-bold text-[#0F1E17] tabular-nums">
              {locations.length} Blocks
            </p>
            <p className="mt-1 text-xs text-[#4B5E54]">
              Toa Payoh · Tampines · AMK
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#E2EAE5] p-5">
            <p className="text-xs font-medium text-[#4B5E54]">Meals Shared This Week</p>
            <p className="mt-1.5 text-2xl sm:text-3xl font-bold text-[#0F1E17] tabular-nums">
              {186 + claimedCount}
            </p>
            <p className="mt-1 text-xs text-[#4B5E54]">
              Free for families & seniors
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: How It Works (Digital Poster Educative Flow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F1E17]">
              How the Community Fridge Works
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-[#4B5E54] max-w-2xl">
              Designed to replace paper flyers with one clear, dignified sharing loop for residents, seniors, and local donors.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('recipes')}
            className="text-sm font-semibold text-[#15803D] hover:text-[#166534] whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            Explore Fridge Recipes →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-[#E2EAE5] p-6 flex flex-col justify-between">
            <div>
              <p className="font-mono text-xs font-semibold text-[#15803D]">01. Donate Surplus</p>
              <h3 className="mt-2 text-lg font-bold text-[#0F1E17]">
                Neighbours & vendors drop off extra food
              </h3>
              <p className="mt-2 text-sm text-[#4B5E54] leading-relaxed">
                Residents and local F&B partners contribute unopened dry goods or fresh produce instead of throwing them away, earning Donor Points for every contribution.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('donate')}
              className="mt-5 text-sm font-semibold text-[#15803D] hover:underline text-left cursor-pointer"
            >
              Log a food donation →
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2EAE5] p-6 flex flex-col justify-between">
            <div>
              <p className="font-mono text-xs font-semibold text-[#15803D]">02. Smart Fridge Tracking</p>
              <h3 className="mt-2 text-lg font-bold text-[#0F1E17]">
                Daily freshness & expiry monitoring
              </h3>
              <p className="mt-2 text-sm text-[#4B5E54] leading-relaxed">
                Smart fridge sensors and grassroots volunteers track stock quantities, chilled temperatures, and expiry dates—alerting seniors via SMS when fresh food arrives.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('fridge')}
              className="mt-5 text-sm font-semibold text-[#15803D] hover:underline text-left cursor-pointer"
            >
              View real-time stock →
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2EAE5] p-6 flex flex-col justify-between">
            <div>
              <p className="font-mono text-xs font-semibold text-[#15803D]">03. Free Pickup & Recipes</p>
              <h3 className="mt-2 text-lg font-bold text-[#0F1E17]">
                Take what you need, cook with ease
              </h3>
              <p className="mt-2 text-sm text-[#4B5E54] leading-relaxed">
                Lower-income households and seniors collect ingredients at zero cost and browse personalised recipes filtered for Halal, Vegetarian, or Soft-Food diets.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('recipes')}
              className="mt-5 text-sm font-semibold text-[#15803D] hover:underline text-left cursor-pointer"
            >
              Match fridge recipes →
            </button>
          </div>
        </div>
      </section>

      {/* Section 3: Quarterly Community Cookout Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#E2EAE5] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-5 h-60 sm:h-72 lg:h-auto">
            <ImageWithFallback
              src={IMAGE_ASSETS.cookoutShowcase}
              alt="Singapore HDB neighbours and seniors enjoying freshly cooked surplus vegetable meals at a community kitchen"
              className="w-full h-full object-cover"
              fallbackLabel="Quarterly Community Cookout"
            />
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-[#B45309]">
                Quarterly Community Event · Open to All Residents
              </p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#0F1E17]">
                {cookoutEvent.title}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#4B5E54] leading-relaxed">
                Join neighbours, volunteer chefs, and seniors as we showcase delicious, budget-friendly meals prepared directly from rescued community fridge ingredients.
              </p>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#0F1E17]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#15803D] shrink-0" aria-hidden="true" />
                  <span>{cookoutEvent.dateLabel} · {cookoutEvent.timeLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#15803D] shrink-0" aria-hidden="true" />
                  <span>{cookoutEvent.venue}</span>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-[#E2EAE5]">
                <p className="text-xs font-medium text-[#4B5E54]">Live Cooking Menu</p>
                <p className="mt-1 text-sm font-medium text-[#0F1E17]">
                  {cookoutEvent.featuredDishes.join('  ·  ')}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-[#4B5E54]">
                <Users className="w-4 h-4 text-[#15803D]" aria-hidden="true" />
                <span className="tabular-nums font-medium text-[#0F1E17]">
                  {cookoutEvent.spotsRemaining} seats remaining
                </span>
              </div>

              <button
                type="button"
                onClick={onToggleCookoutRsvp}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px] ${
                  cookoutEvent.rsvped
                    ? 'bg-[#ECF4EE] text-[#15803D] border border-[#15803D]/30 hover:bg-[#DCECE1]'
                    : 'bg-[#0F1E17] text-white hover:bg-[#1E3529]'
                }`}
              >
                {cookoutEvent.rsvped && <Check className="w-4 h-4 shrink-0" aria-hidden="true" />}
                <span>{cookoutEvent.rsvped ? 'Seat Reserved (Cancel)' : 'Reserve Free Seat'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Key Partners & Grassroots Adoption Package */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Key Partners */}
          <div className="lg:col-span-6">
            <h2 className="font-display text-2xl font-bold text-[#0F1E17]">
              Powered by Local Neighbourhood Partners
            </h2>
            <p className="mt-2 text-sm text-[#4B5E54] leading-relaxed">
              A non-profit collaboration backed by corporate sponsors, local food suppliers, and dedicated HDB grassroots teams.
            </p>

            <div className="mt-6 divide-y divide-[#E2EAE5] bg-white rounded-2xl border border-[#E2EAE5]">
              {KEY_PARTNERS.map((partner) => (
                <div key={partner.name} className="p-4 sm:p-5">
                  <h3 className="text-sm font-bold text-[#0F1E17]">{partner.name}</h3>
                  <p className="text-sm text-[#4B5E54] mt-0.5">{partner.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Non-Profit Setup & Maintenance Package for Other Estates */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E2EAE5] p-6 sm:p-8">
            <p className="text-xs font-semibold text-[#15803D]">
              For Grassroots Groups & Town Councils
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-bold text-[#0F1E17]">
              Adopt a Community Fridge in Your Estate
            </h2>
            <p className="mt-2 text-sm text-[#4B5E54] leading-relaxed">
              Always 100% free for residents taking food. Supported by corporate sponsorships and transparent estate service packages.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#E2EAE5]">
                <p className="text-xs font-medium text-[#4B5E54]">Turnkey Setup Package</p>
                <p className="mt-1 text-2xl font-bold text-[#0F1E17] font-mono tabular-nums">$1,300</p>
                <p className="mt-1.5 text-xs text-[#4B5E54] leading-relaxed">
                  Includes smart fridge unit ($800 hardware), volunteer setup training ($200), QR signage & digital onboarding.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#E2EAE5]">
                <p className="text-xs font-medium text-[#4B5E54]">Monthly Maintenance</p>
                <p className="mt-1 text-2xl font-bold text-[#0F1E17] font-mono tabular-nums">$300 / mo</p>
                <p className="mt-1.5 text-xs text-[#4B5E54] leading-relaxed">
                  Covers scheduled professional fridge sanitization ($150/mo service), inventory alerts & SMS broadcast costs.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-[#E2EAE5]">
              <p className="text-xs text-[#4B5E54]">
                Corporate sponsors & F&B vendors welcome to co-fund blocks.
              </p>
              <button
                type="button"
                onClick={() => onNavigateTab('volunteer')}
                className="px-4 py-2.5 rounded-xl bg-[#0F1E17] text-white text-sm font-medium hover:bg-[#1E3529] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[42px]"
              >
                Open Volunteer Console
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
