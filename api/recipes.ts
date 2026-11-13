export interface ApiRequest {
  method?: string;
  query?: Record<string, unknown>;
}

export interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

interface MealDbCategoryRaw {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

interface MealDbFilterMealRaw {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

interface MealDbFullMealRaw {
  idMeal: string;
  strMeal: string;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strMealThumb: string | null;
  strTags: string | null;
  strYoutube: string | null;
  [key: string]: string | null | undefined;
}

const DEFAULT_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const DEFAULT_CATEGORIES_ENDPOINT = `${DEFAULT_BASE_URL}/categories.php`;

const INGREDIENT_ALIASES: Record<string, string[]> = {
  'baby bok choy': ['bok choy', 'cabbage', 'broccoli'],
  'bok choy': ['bok choy', 'cabbage', 'broccoli'],
  'firm silken tofu': ['tofu', 'soy'],
  tofu: ['tofu'],
  'thai jasmine rice': ['rice'],
  'jasmine rice': ['rice'],
  rice: ['rice'],
  'fresh pumpkin wedges': ['pumpkin', 'butternut squash'],
  pumpkin: ['pumpkin', 'squash'],
  'roma tomatoes': ['tomatoes', 'tomato'],
  tomatoes: ['tomatoes', 'tomato'],
  'penne pasta': ['penne rigate', 'pasta', 'spaghetti'],
  pasta: ['pasta', 'penne rigate', 'spaghetti'],
  'australian carrots': ['carrots', 'carrot'],
  carrots: ['carrots', 'carrot'],
  'fresh spinach': ['spinach'],
  spinach: ['spinach'],
  'minced chicken breast': ['chicken breast', 'chicken'],
  'chicken breast': ['chicken breast', 'chicken'],
  chicken: ['chicken'],
  'navel oranges': ['orange', 'oranges'],
  oranges: ['orange', 'oranges'],
};

function getApiBaseUrl(): string {
  const apiKey = process.env.THEMEALDB_API_KEY?.trim();
  if (apiKey) {
    return `https://www.themealdb.com/api/json/v2/${encodeURIComponent(apiKey)}`;
  }
  return DEFAULT_BASE_URL;
}

function normalizeIngredientTerms(rawName: string): string[] {
  const cleaned = rawName
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-zA-Z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  if (!cleaned) return [];
  if (INGREDIENT_ALIASES[cleaned]) {
    return INGREDIENT_ALIASES[cleaned];
  }

  const words = cleaned
    .split(' ')
    .filter((w) => !['fresh', 'firm', 'silken', 'baby', 'thai', 'australian', 'navel', 'minced', 'wedges', 'halal'].includes(w));

  const candidates: string[] = [];
  if (words.length > 0) {
    candidates.push(words.join(' '));
    if (words.length > 1) {
      candidates.push(words[words.length - 1]);
    }
  } else {
    candidates.push(cleaned);
  }
  return Array.from(new Set(candidates));
}

function mapFullMeal(meal: MealDbFullMealRaw, matchedIngredients: string[]) {
  const ingredients: { name: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim() || '';
    if (ing) {
      ingredients.push({ name: ing, measure });
    }
  }

  const instructions = (meal.strInstructions || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const tags = (meal.strTags || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    category: meal.strCategory || 'Main',
    area: meal.strArea || 'International',
    thumbnailUrl: meal.strMealThumb || '',
    instructions,
    ingredients,
    matchedIngredients,
    tags,
    youtubeUrl: meal.strYoutube || undefined,
  };
}

async function fetchMealsForIngredient(
  baseUrl: string,
  originalIngredient: string
): Promise<MealDbFilterMealRaw[]> {
  const candidates = normalizeIngredientTerms(originalIngredient);

  for (const term of candidates) {
    const filterUrl = `${baseUrl}/filter.php?i=${encodeURIComponent(term.replace(/\s+/g, '_'))}`;
    const res = await fetch(filterUrl, { headers: { Accept: 'application/json' } });
    if (res.ok) {
      const json = (await res.json()) as { meals?: MealDbFilterMealRaw[] | null };
      if (Array.isArray(json.meals) && json.meals.length > 0) {
        return json.meals;
      }
    }

    // Fallback: search by meal name for ingredients like tofu or pasta
    const searchUrl = `${baseUrl}/search.php?s=${encodeURIComponent(term)}`;
    const searchRes = await fetch(searchUrl, { headers: { Accept: 'application/json' } });
    if (searchRes.ok) {
      const searchJson = (await searchRes.json()) as { meals?: MealDbFilterMealRaw[] | null };
      if (Array.isArray(searchJson.meals) && searchJson.meals.length > 0) {
        return searchJson.meals;
      }
    }
  }

  return [];
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method && req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed. Use GET.' });
    return;
  }

  const baseUrl = getApiBaseUrl();
  const rawIngredientsParam = req.query?.ingredients;
  const ingredientsParam =
    typeof rawIngredientsParam === 'string'
      ? rawIngredientsParam
      : Array.isArray(rawIngredientsParam)
        ? rawIngredientsParam.join(',')
        : '';

  // Mode 1: Match recipes by selected fridge ingredients
  if (ingredientsParam.trim().length > 0) {
    const selectedNames = ingredientsParam
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 6);

    try {
      const mealMap = new Map<
        string,
        { summary: MealDbFilterMealRaw; matchedSet: Set<string> }
      >();

      const perIngredientResults = await Promise.all(
        selectedNames.map(async (name) => ({
          name,
          meals: await fetchMealsForIngredient(baseUrl, name),
        }))
      );

      for (const { name, meals } of perIngredientResults) {
        for (const m of meals.slice(0, 12)) {
          const existing = mealMap.get(m.idMeal);
          if (existing) {
            existing.matchedSet.add(name);
          } else {
            mealMap.set(m.idMeal, {
              summary: m,
              matchedSet: new Set([name]),
            });
          }
        }
      }

      // Rank by number of matched ingredients descending
      const topRanked = Array.from(mealMap.values())
        .sort((a, b) => b.matchedSet.size - a.matchedSet.size)
        .slice(0, 9);

      // Hydrate full meal details (instructions + ingredients)
      const hydratedMeals = await Promise.all(
        topRanked.map(async ({ summary, matchedSet }) => {
          const lookupRes = await fetch(
            `${baseUrl}/lookup.php?i=${encodeURIComponent(summary.idMeal)}`,
            { headers: { Accept: 'application/json' } }
          );
          if (lookupRes.ok) {
            const lookupJson = (await lookupRes.json()) as {
              meals?: MealDbFullMealRaw[] | null;
            };
            const full = lookupJson.meals?.[0];
            if (full) {
              return mapFullMeal(full, Array.from(matchedSet));
            }
          }
          return {
            id: summary.idMeal,
            title: summary.strMeal,
            category: 'Meal',
            area: 'Community',
            thumbnailUrl: summary.strMealThumb,
            instructions: [],
            ingredients: [],
            matchedIngredients: Array.from(matchedSet),
            tags: [],
          };
        })
      );

      res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
      res.status(200).json({
        source: 'themealdb',
        queryIngredients: selectedNames,
        count: hydratedMeals.length,
        meals: hydratedMeals,
      });
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown upstream error';
      res.status(502).json({
        error: 'Unable to fetch matching recipes from TheMealDB.',
        details: message,
      });
      return;
    }
  }

  // Mode 2: Default categories endpoint (https://www.themealdb.com/api/json/v1/1/categories.php)
  const configuredCategoriesUrl = process.env.THEMEALDB_CATEGORIES_URL?.trim();
  const endpoint =
    configuredCategoriesUrl ||
    (process.env.THEMEALDB_API_KEY?.trim()
      ? `${baseUrl}/categories.php`
      : DEFAULT_CATEGORIES_ENDPOINT);

  try {
    const upstream = await fetch(endpoint, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!upstream.ok) {
      res.status(upstream.status).json({
        error: 'Failed to fetch recipes from TheMealDB upstream.',
        status: upstream.status,
      });
      return;
    }

    const payload = (await upstream.json()) as { categories?: MealDbCategoryRaw[] };
    const categories = Array.isArray(payload.categories)
      ? payload.categories.map((cat) => ({
          id: cat.idCategory,
          name: cat.strCategory,
          thumbnailUrl: cat.strCategoryThumb,
          description: cat.strCategoryDescription,
        }))
      : [];

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({
      source: 'themealdb',
      count: categories.length,
      categories,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown upstream error';
    res.status(502).json({
      error: 'Unable to reach TheMealDB recipe service.',
      details: message,
    });
  }
}
