/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AccessibilityUtilityStrip } from './components/AccessibilityUtilityStrip';
import { DonorPortalPage } from './components/DonorPortalPage';
import { FridgeExplorerPage } from './components/FridgeExplorerPage';
import { Header } from './components/Header';
import {
  ClaimItemModal,
  QrScannerModal,
  SmsAlertModal,
  ToastStack,
} from './components/Modals';
import { OverviewPage } from './components/OverviewPage';
import { RecipesPage } from './components/RecipesPage';
import { VolunteerDashboardPage } from './components/VolunteerDashboardPage';
import { useCommunityFridge } from './hooks/useCommunityFridge';

export default function App() {
  const {
    activeTab,
    setActiveTab,
    selectedLocationId,
    setSelectedLocationId,
    locations,
    foodItems,
    selectedFridgeItemIds,
    toggleFridgeItemSelection,
    clearFridgeItemSelection,
    matchedQueryIngredients,
    apiMatchedRecipes,
    isMatchingRecipes,
    matchRecipesError,
    matchRecipesFromSelection,
    clearMatchedRecipes,
    recipes,
    recipeCategories,
    isLoadingCategories,
    categoriesError,
    reloadRecipeCategories,
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
  } = useCommunityFridge();

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] text-[#0F1E17]">
      <Header
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        onOpenQrModal={() => setQrModalOpen(true)}
      />

      <AccessibilityUtilityStrip
        largeTextMode={largeTextMode}
        onToggleLargeText={() => setLargeTextMode((prev) => !prev)}
        smsSubscription={smsSubscription}
        onOpenSmsModal={() => setSmsModalOpen(true)}
      />

      <main className="flex-1">
        {activeTab === 'overview' && (
          <OverviewPage
            locations={locations}
            foodItems={foodItems}
            claimedCount={claimedCount}
            cookoutEvent={cookoutEvent}
            onNavigateTab={handleTabChange}
            onOpenQrModal={() => setQrModalOpen(true)}
            onOpenSmsModal={() => setSmsModalOpen(true)}
            onToggleCookoutRsvp={toggleCookoutRsvp}
          />
        )}

        {activeTab === 'fridge' && (
          <FridgeExplorerPage
            locations={locations}
            selectedLocationId={selectedLocationId}
            onSelectLocation={setSelectedLocationId}
            foodItems={foodItems}
            selectedItemIds={selectedFridgeItemIds}
            onToggleSelectItem={toggleFridgeItemSelection}
            onClearSelection={clearFridgeItemSelection}
            onClaimClick={(item) => setClaimTargetItem(item)}
            onMatchRecipes={(fallbackNames) => void matchRecipesFromSelection(fallbackNames)}
          />
        )}

        {activeTab === 'recipes' && (
          <RecipesPage
            recipes={recipes}
            matchedQueryIngredients={matchedQueryIngredients}
            apiMatchedRecipes={apiMatchedRecipes}
            isMatchingRecipes={isMatchingRecipes}
            matchRecipesError={matchRecipesError}
            onRetryMatchRecipes={() => void matchRecipesFromSelection(matchedQueryIngredients)}
            onClearMatchedRecipes={clearMatchedRecipes}
            recipeCategories={recipeCategories}
            isLoadingCategories={isLoadingCategories}
            categoriesError={categoriesError}
            onReloadCategories={reloadRecipeCategories}
            foodItems={foodItems}
            locations={locations}
            selectedLocationId={selectedLocationId}
            onGoToFridge={() => handleTabChange('fridge')}
          />
        )}

        {activeTab === 'donate' && (
          <DonorPortalPage
            locations={locations}
            donations={donations}
            donorPoints={donorPoints}
            onSubmitDonation={submitDonation}
            onRedeemReward={redeemReward}
          />
        )}

        {activeTab === 'volunteer' && (
          <VolunteerDashboardPage
            locations={locations}
            foodItems={foodItems}
            cleanupTasks={cleanupTasks}
            vendorDropoffs={vendorDropoffs}
            onToggleCleanupTask={toggleCleanupTask}
            onMarkInspected={markItemInspected}
            onSendExpirySms={sendExpirySmsBlast}
            onLogVendorDropoff={logVendorDropoff}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="bg-white border-t border-[#E2EAE5] pb-20 md:pb-8 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#4B5E54]">
          <div>
            <p className="font-semibold text-[#0F1E17]">
              KampungFridge · Non-Profit HDB Community Food-Sharing Initiative
            </p>
            <p className="mt-1">
              Free for all residents · Supported by Town Councils, Volunteers & Corporate Sponsors
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => handleTabChange('fridge')}
              className="hover:text-[#0F1E17] cursor-pointer"
            >
              Fridge Stock
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('recipes')}
              className="hover:text-[#0F1E17] cursor-pointer"
            >
              Recipes
            </button>
            <button
              type="button"
              onClick={() => setSmsModalOpen(true)}
              className="hover:text-[#0F1E17] cursor-pointer"
            >
              SMS Alerts
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('volunteer')}
              className="hover:text-[#0F1E17] cursor-pointer"
            >
              Volunteers
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Notifications */}
      <QrScannerModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        locations={locations}
        onSelectLocation={handleQrScanSelect}
      />

      <SmsAlertModal
        isOpen={smsModalOpen}
        onClose={() => setSmsModalOpen(false)}
        locations={locations}
        existing={smsSubscription}
        onSubscribe={subscribeSmsAlert}
      />

      <ClaimItemModal
        item={claimTargetItem}
        locations={locations}
        onClose={() => setClaimTargetItem(null)}
        onConfirm={confirmClaimItem}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
