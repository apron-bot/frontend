export type ThemeMode = 'day' | 'night';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type IngredientCategory = 'Dairy' | 'Produce' | 'Meat' | 'Grains' | 'Other';

export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  category: IngredientCategory;
  quantity: string;
  isLowStock: boolean;
  addedRecently?: boolean;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  inPantry: boolean;
}

export interface RecipeStep {
  instruction: string;
  timerMinutes?: number;
  emoji?: string;
}

export interface Recipe {
  id: string;
  title: string;
  emoji: string;
  mealType: MealType;
  difficulty: Difficulty;
  timeMinutes: number;
  servings: number;
  tags: string[];
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  saved: boolean;
  placeholderColor: string;
  availabilityStatus: 'all' | 'some' | 'few';
}

export interface Restaurant {
  id: string;
  name: string;
  emoji: string;
  deliveryTime: string;
  priceRange: string;
  cuisine: string[];
  placeholderColor: string;
}

export interface Order {
  id: string;
  storeName: string;
  emoji: string;
  description: string;
  detail: string;
  status: 'delivering' | 'delivered';
  iconBg: string;
  progress?: number;
  items?: { name: string; quantity: number; price: number }[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  store: string;
  price: number;
  checked: boolean;
}

export interface MealPlanDay {
  day: string;
  dayShort: string;
  recipe: { title: string; emoji: string } | null;
  cooked: boolean;
  isToday: boolean;
}

export interface FlavorProfile {
  salty: number;
  sweet: number;
  sour: number;
  spicy: number;
  umami: number;
}

export interface FridgeChange {
  delta: number;
  emoji: string;
  name: string;
}
