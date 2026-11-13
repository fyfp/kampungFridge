import { useMemo, useState } from 'react';
import { Check, Clock, Refrigerator, Utensils, X } from 'lucide-react';
import {
  ApiMealRecipe,
  DietaryTag,
  FoodItem,
  FridgeLocation,
  Recipe,
  RecipeCategory,
} from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface RecipesPageProps {
  recipes: Recipe[];
  matchedQueryIngredients: string[];
  apiMatchedRecipes: ApiMealRecipe[];
  isMatchingRecipes: boolean;
  matchRecipesError: string | null;
  onRetryMatchRecipes: () => void;
  onClearMatchedRecipes: () => void;
  recipeCategories: RecipeCategory[];
  isLoadingCategories: boolean;
  categoriesError: string | null;
  onReloadCategories: () => void;
  foodItems: FoodItem[];
  locations: FridgeLocation[];
  selectedLocationId: string;
  onGoToFridge: () => void;
}

const DIETARY_FILTERS: ('All' | DietaryTag)[] = [
  'All',
  'Halal',
  'Vegetarian',
  'Elderly-Friendly',
  'Low Sodium',
  'Quick <15m',
];

export function RecipesPage({
  recipes,
  matchedQueryIngredients,
  apiMatchedRecipes,
  isMatchingRecipes,
  matchRecipesError,
  onRetryMatchRecipes,
  onClearMatchedRecipes,
  recipeCategories,
  isLoadingCategories,
  categoriesError,
  onReloadCategories,
  foodItems,
  locations,
  selectedLocationId,
  onGoToFridge,
}: RecipesPageProps) {
  const [selectedDiet, setSelectedDiet] = useState<'All' | DietaryTag>('All');
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [activeApiMeal, setActiveApiMeal] = useState<ApiMealRecipe | null>(null);

  const activeBlockName =
    selectedLocationId === 'all'
      ? 'All HDB Fridges'
      : locations.find((l) => l.id === selectedLocationId)?.blockName ?? 'Selected Fridge';

  const availableItemNames = useMemo(() => {
    const scoped =
      selectedLocationId === 'all'
        ? foodItems
        : foodItems.filter((i) => i.locationId === selectedLocationId);
    return new Set(scoped.map((i) => i.name.toLowerCase()));
  }, [foodItems, selectedLocationId]);

  const enrichedRecipes = useMemo(() => {
    return recipes
      .filter((r) => selectedDiet === 'All' || r.dietaryTags.includes(selectedDiet))
      .map((recipe) => {
        const matched = recipe.ingredientsRequired.filter((ing) =>
          availableItemNames.has(ing.toLowerCase())
        );
        return {
          recipe,
          matchedIngredients: matched,
          matchCount: matched.length,
          totalRequired: recipe.ingredientsRequired.length,
        };
      })
      .sort((a, b) => b.matchCount - a.matchCount);
  }, [recipes, selectedDiet, availableItemNames]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F1E17]">
            Personalised Recipes From Today’s Fridge
          </h1>
          <p className="mt-1 text-sm sm:text-base text-[#4B5E54]">
            Cook easy, nutritious meals using ingredients currently available in <strong className="text-[#0F1E17]">{activeBlockName}</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToFridge}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#DCE7E0] text-sm font-medium text-[#0F1E17] hover:bg-[#EFF5F1] whitespace-nowrap shrink-0 self-start md:self-auto cursor-pointer min-h-[42px]"
        >
          <Refrigerator className="w-4 h-4 text-[#15803D]" aria-hidden="true" />
          <span>Select Fridge Items</span>
        </button>
      </div>

      {/* API-Matched Recipes Section (Triggered from Fridge Stock Selection) */}
      {matchedQueryIngredients.length > 0 && (
        <section className="bg-white rounded-2xl border border-[#CFE0D5] p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EDF3EF]">
            <div>
              <p className="text-xs font-semibold text-[#15803D]">
                Live Results From Recipe API (/api/recipes)
              </p>
              <h2 className="font-display text-xl font-bold text-[#0F1E17] mt-0.5">
                Recipes Matching: {matchedQueryIngredients.join(' · ')}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onGoToFridge}
                className="px-3.5 py-2 rounded-xl border border-[#DCE7E0] bg-white text-xs font-medium text-[#0F1E17] hover:bg-[#EFF5F1] cursor-pointer min-h-[38px]"
              >
                Edit Selection
              </button>
              <button
                type="button"
                onClick={onClearMatchedRecipes}
                className="px-3.5 py-2 rounded-xl border border-[#DCE7E0] bg-white text-xs font-medium text-[#4B5E54] hover:text-[#0F1E17] hover:bg-[#F8FAF9] cursor-pointer min-h-[38px]"
              >
                Clear
              </button>
            </div>
          </div>

          {isMatchingRecipes ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#E2EAE5] bg-[#F8FAF9] p-4 h-64 animate-pulse"
                />
              ))}
            </div>
          ) : matchRecipesError ? (
            <div className="p-5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm text-[#B91C1C]">{matchRecipesError}</p>
              <button
                type="button"
                onClick={onRetryMatchRecipes}
                className="px-4 py-2 rounded-xl bg-[#0F1E17] text-white text-xs font-semibold hover:bg-[#1E3529] cursor-pointer min-h-[38px]"
              >
                Retry Match
              </button>
            </div>
          ) : apiMatchedRecipes.length === 0 ? (
            <div className="p-6 rounded-xl bg-[#F8FAF9] border border-[#E2EAE5] text-center space-y-2">
              <p className="text-sm font-semibold text-[#0F1E17]">
                No API recipes matched those exact ingredients
              </p>
              <p className="text-xs text-[#4B5E54]">
                Try selecting a broader set of items like Chicken, Tomatoes, Rice, or Spinach in Fridge Stock.
              </p>
              <button
                type="button"
                onClick={onGoToFridge}
                className="mt-2 px-4 py-2 rounded-xl bg-[#15803D] text-white text-xs font-semibold hover:bg-[#166534] cursor-pointer min-h-[38px]"
              >
                Back to Fridge Stock
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {apiMatchedRecipes.map((meal) => (
                <article
                  key={meal.id}
                  className="rounded-xl border border-[#E2EAE5] bg-[#F8FAF9] overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="h-44 bg-[#EFF5F1]">
                      <ImageWithFallback
                        src={meal.thumbnailUrl}
                        alt={meal.title}
                        className="w-full h-full object-cover"
                        fallbackLabel={meal.title}
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-medium text-[#15803D]">
                        {meal.category} · {meal.area}
                      </p>
                      <h3 className="mt-1 font-display text-base font-bold text-[#0F1E17]">
                        {meal.title}
                      </h3>
                      <p className="mt-2 text-xs text-[#4B5E54]">
                        Uses from fridge: <strong className="text-[#0F1E17]">{meal.matchedIngredients.join(', ')}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    <button
                      type="button"
                      onClick={() => setActiveApiMeal(meal)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#0F1E17] text-white text-xs sm:text-sm font-semibold hover:bg-[#1E3529] transition-colors cursor-pointer min-h-[42px]"
                    >
                      View Full Recipe
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Dietary Requirement Filter Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#EFF5F1] rounded-xl w-fit max-w-full">
        {DIETARY_FILTERS.map((diet) => (
          <button
            key={diet}
            type="button"
            onClick={() => setSelectedDiet(diet)}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[38px] ${
              selectedDiet === diet
                ? 'bg-white text-[#0F1E17] shadow-xs'
                : 'text-[#4B5E54] hover:text-[#0F1E17]'
            }`}
          >
            {diet === 'All' ? 'All Dietary Needs' : diet}
          </button>
        ))}
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {enrichedRecipes.map(({ recipe, matchCount, totalRequired }) => (
          <article
            key={recipe.id}
            className="bg-white rounded-2xl border border-[#E2EAE5] overflow-hidden flex flex-col sm:flex-row items-stretch"
          >
            <div className="sm:w-48 lg:w-56 h-48 sm:h-auto shrink-0 bg-[#EFF5F1]">
              <ImageWithFallback
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover"
                fallbackLabel={recipe.title}
              />
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                {/* Clean Unboxed Metadata */}
                <p className="text-xs font-medium text-[#15803D] tabular-nums">
                  {matchCount}/{totalRequired} ingredients in stock now · {recipe.prepMinutes} mins
                </p>

                <h2 className="mt-1.5 font-display text-lg font-bold text-[#0F1E17]">
                  {recipe.title}
                </h2>
                <p className="mt-1.5 text-sm text-[#4B5E54] leading-relaxed">
                  {recipe.subtitle}
                </p>

                <p className="mt-3 text-xs text-[#4B5E54]">
                  {recipe.dietaryTags.join(' · ')}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-[#EDF3EF] flex items-center justify-between gap-3">
                <span className="text-xs text-[#4B5E54] tabular-nums">
                  Serves {recipe.servings}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveRecipe(recipe)}
                  className="px-4 py-2 rounded-xl bg-[#0F1E17] text-white text-xs sm:text-sm font-semibold hover:bg-[#1E3529] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
                >
                  View Simple Steps
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Live Serverless Recipe Categories (/api/recipes -> TheMealDB) */}
      <section className="pt-6 border-t border-[#E2EAE5] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-[#0F1E17]">
              Meal Categories From TheMealDB
            </h2>
            <p className="text-sm text-[#4B5E54]">
              Live categories pulled from <span className="font-mono text-xs">/api/recipes</span> to inspire household cooking.
            </p>
          </div>
          <button
            type="button"
            onClick={onReloadCategories}
            disabled={isLoadingCategories}
            className="px-3.5 py-2 rounded-xl border border-[#DCE7E0] bg-white text-xs font-medium text-[#0F1E17] hover:bg-[#EFF5F1] disabled:opacity-60 cursor-pointer whitespace-nowrap self-start sm:self-auto min-h-[38px]"
          >
            {isLoadingCategories ? 'Refreshing...' : 'Refresh Categories'}
          </button>
        </div>

        {categoriesError ? (
          <div className="bg-white rounded-2xl border border-[#E2EAE5] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-[#B91C1C]">{categoriesError}</p>
            <button
              type="button"
              onClick={onReloadCategories}
              className="px-4 py-2 rounded-xl bg-[#0F1E17] text-white text-xs font-semibold hover:bg-[#1E3529] cursor-pointer min-h-[38px]"
            >
              Retry
            </button>
          </div>
        ) : isLoadingCategories && recipeCategories.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#E2EAE5] p-4 h-36 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {recipeCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-xl border border-[#E2EAE5] p-4 flex flex-col justify-between"
              >
                <div className="h-24 rounded-lg overflow-hidden bg-[#F8FAF9] mb-3 flex items-center justify-center">
                  <ImageWithFallback
                    src={cat.thumbnailUrl}
                    alt={cat.name}
                    className="w-full h-full object-contain p-1"
                    fallbackLabel={cat.name}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F1E17]">{cat.name}</h3>
                  <p className="text-xs text-[#4B5E54] mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recipe Detail Modal */}
      {activeRecipe && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="recipe-detail-title"
        >
          <div className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-2xl border border-[#E2EAE5] shadow-xl">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#E2EAE5] flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#15803D]">
                  {activeRecipe.dietaryTags.join(' · ')}
                </p>
                <h2 id="recipe-detail-title" className="font-display text-xl font-bold text-[#0F1E17]">
                  {activeRecipe.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveRecipe(null)}
                aria-label="Close recipe instructions"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#4B5E54] hover:bg-[#EFF5F1] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#4B5E54]">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#15803D]" aria-hidden="true" />
                  <span className="tabular-nums">{activeRecipe.prepMinutes} mins</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-[#15803D]" aria-hidden="true" />
                  <span className="tabular-nums">{activeRecipe.servings} servings</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeRecipe.nutritionNote}</span>
              </div>

              {/* Ingredients Check */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#E2EAE5]">
                  <h3 className="text-sm font-bold text-[#0F1E17] mb-3">
                    From Community Fridge
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {activeRecipe.ingredientsRequired.map((ing) => {
                      const inStock = availableItemNames.has(ing.toLowerCase());
                      return (
                        <li key={ing} className="flex items-center justify-between gap-2">
                          <span className="text-[#0F1E17]">{ing}</span>
                          {inStock ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803D] shrink-0">
                              <Check className="w-3.5 h-3.5" aria-hidden="true" />
                              In Fridge
                            </span>
                          ) : (
                            <span className="text-xs text-[#6B7D73] shrink-0">Check nearby</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#E2EAE5]">
                  <h3 className="text-sm font-bold text-[#0F1E17] mb-3">
                    Basic Home Staples
                  </h3>
                  <ul className="space-y-2 text-sm text-[#4B5E54]">
                    {activeRecipe.pantryStaples.map((staple) => (
                      <li key={staple}>· {staple}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Step-by-step Instructions */}
              <div>
                <h3 className="text-base font-bold text-[#0F1E17] mb-3">
                  Easy Cooking Steps
                </h3>
                <ol className="space-y-3">
                  {activeRecipe.steps.map((step, index) => (
                    <li key={step} className="flex gap-3 text-sm text-[#0F1E17] leading-relaxed">
                      <span className="font-mono text-xs font-bold text-[#15803D] pt-0.5 shrink-0 tabular-nums">
                        0{index + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveRecipe(null);
                    onGoToFridge();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#15803D] text-white text-sm font-semibold hover:bg-[#166534] cursor-pointer min-h-[46px]"
                >
                  Claim Ingredients in Fridge Stock
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRecipe(null)}
                  className="py-3 px-5 rounded-xl border border-[#CBD8D0] text-sm font-medium text-[#0F1E17] hover:bg-[#F8FAF9] cursor-pointer min-h-[46px]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Meal Detail Modal */}
      {activeApiMeal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="api-meal-detail-title"
        >
          <div className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-2xl border border-[#E2EAE5] shadow-xl">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#E2EAE5] flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#15803D]">
                  {activeApiMeal.category} · {activeApiMeal.area} · Matched: {activeApiMeal.matchedIngredients.join(', ')}
                </p>
                <h2 id="api-meal-detail-title" className="font-display text-xl font-bold text-[#0F1E17]">
                  {activeApiMeal.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveApiMeal(null)}
                aria-label="Close API recipe details"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#4B5E54] hover:bg-[#EFF5F1] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {activeApiMeal.thumbnailUrl && (
                <div className="h-56 rounded-xl overflow-hidden bg-[#EFF5F1]">
                  <ImageWithFallback
                    src={activeApiMeal.thumbnailUrl}
                    alt={activeApiMeal.title}
                    className="w-full h-full object-cover"
                    fallbackLabel={activeApiMeal.title}
                  />
                </div>
              )}

              <div>
                <h3 className="text-base font-bold text-[#0F1E17] mb-3">
                  Ingredients ({activeApiMeal.ingredients.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {activeApiMeal.ingredients.map((ing, idx) => (
                    <div
                      key={`${ing.name}-${idx}`}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[#F8FAF9] border border-[#EDF3EF]"
                    >
                      <span className="text-[#0F1E17] font-medium">{ing.name}</span>
                      <span className="text-xs text-[#4B5E54] font-mono">{ing.measure}</span>
                    </div>
                  ))}
                </div>
              </div>

              {activeApiMeal.instructions.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-[#0F1E17] mb-3">
                    Preparation Instructions
                  </h3>
                  <ol className="space-y-3">
                    {activeApiMeal.instructions.map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-[#0F1E17] leading-relaxed">
                        <span className="font-mono text-xs font-bold text-[#15803D] pt-0.5 shrink-0 tabular-nums">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveApiMeal(null);
                    onGoToFridge();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#15803D] text-white text-sm font-semibold hover:bg-[#166534] cursor-pointer min-h-[46px]"
                >
                  Back to Fridge Stock
                </button>
                <button
                  type="button"
                  onClick={() => setActiveApiMeal(null)}
                  className="py-3 px-5 rounded-xl border border-[#CBD8D0] text-sm font-medium text-[#0F1E17] hover:bg-[#F8FAF9] cursor-pointer min-h-[46px]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
