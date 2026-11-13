import { ApiMealRecipe, RecipeCategory } from '../types';

export interface FetchRecipeCategoriesResponse {
  source: string;
  count: number;
  categories: RecipeCategory[];
}

export interface FetchMatchedRecipesResponse {
  source: string;
  queryIngredients: string[];
  count: number;
  meals: ApiMealRecipe[];
}

export async function fetchRecipeCategories(): Promise<RecipeCategory[]> {
  const response = await fetch('/api/recipes', {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Recipe API responded with status ${response.status}`);
  }

  const data = (await response.json()) as FetchRecipeCategoriesResponse;
  return Array.isArray(data.categories) ? data.categories : [];
}

export async function fetchRecipesByIngredients(
  ingredients: string[]
): Promise<ApiMealRecipe[]> {
  const cleaned = ingredients.map((i) => i.trim()).filter(Boolean);
  if (cleaned.length === 0) return [];

  const params = new URLSearchParams({
    ingredients: cleaned.join(','),
  });

  const response = await fetch(`/api/recipes?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Recipe matching API responded with status ${response.status}`);
  }

  const data = (await response.json()) as FetchMatchedRecipesResponse;
  return Array.isArray(data.meals) ? data.meals : [];
}
