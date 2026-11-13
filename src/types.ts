export type AppTab = 'overview' | 'fridge' | 'recipes' | 'donate' | 'volunteer';

export type FoodCategory = 'Fresh Produce' | 'Dried & Pantry' | 'Protein & Dairy' | 'Bakery & Ready';

export type FreshnessStatus = 'Fresh' | 'Use Soon' | 'Expiring Today';

export type DietaryTag = 'Halal' | 'Vegetarian' | 'Elderly-Friendly' | 'Low Sodium' | 'Quick <15m';

export interface FridgeLocation {
  id: string;
  blockName: string;
  estate: string;
  address: string;
  temperatureC: number;
  capacityPercent: number;
  lastRestocked: string;
  qrCodeLabel: string;
  volunteerLead: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  locationId: string;
  quantity: number;
  unit: string;
  freshness: FreshnessStatus;
  expiryDate: string;
  daysUntilExpiry: number;
  donatedBy: string;
  donorType: 'Resident' | 'Vendor';
  halalCertified: boolean;
  storageType: 'Chilled' | 'Dry Pantry';
  addedAt: string;
  inspected: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  prepMinutes: number;
  servings: number;
  dietaryTags: DietaryTag[];
  imageUrl?: string;
  ingredientsRequired: string[];
  pantryStaples: string[];
  steps: string[];
  nutritionNote: string;
}

export interface DonationRecord {
  id: string;
  itemName: string;
  category: FoodCategory;
  quantityLabel: string;
  locationId: string;
  dateLabel: string;
  pointsEarned: number;
  status: 'Active in Fridge' | 'Collected by Neighbour';
}

export interface CleanupTask {
  id: string;
  locationId: string;
  title: string;
  assignedTo: string;
  scheduledTime: string;
  completed: boolean;
}

export interface VendorDropoff {
  id: string;
  vendorName: string;
  vendorType: 'Restaurant' | 'Supermarket' | 'Wholesale Supplier' | 'Bakery';
  itemsSummary: string;
  weightKg: number;
  locationId: string;
  receivedAt: string;
}

export interface CookoutEvent {
  id: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  venue: string;
  featuredDishes: string[];
  spotsRemaining: number;
  rsvped: boolean;
}

export interface SmsSubscription {
  phoneNumber: string;
  locationId: string;
  preferredTime: 'Morning (8:30 AM)' | 'Evening (5:30 PM)';
  active: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'info' | 'warning';
}

export interface RecipeCategory {
  id: string;
  name: string;
  thumbnailUrl: string;
  description: string;
}

export interface ApiMealRecipe {
  id: string;
  title: string;
  category: string;
  area: string;
  thumbnailUrl: string;
  instructions: string[];
  ingredients: { name: string; measure: string }[];
  matchedIngredients: string[];
  tags: string[];
  youtubeUrl?: string;
}
