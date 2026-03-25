const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-production-caab.up.railway.app';

// For demo: we'll use the first user. In production, this would come from auth.
let currentUserId: string | null = null;

export function setUserId(id: string) {
  currentUserId = id;
}

export function getUserId(): string | null {
  return currentUserId;
}

async function fetchApi(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function discoverUser(): Promise<string | null> {
  try {
    const users = await fetchApi('/dashboard/users');
    if (users.length > 0) {
      const userId = users[0].id;
      setUserId(userId);
      return userId;
    }
  } catch (e) {
    /* backend not available */
  }
  return null;
}

export async function getLastPhoto(userId: string): Promise<string | null> {
  try {
    const data = await fetchApi(`/dashboard/photos/${userId}/last`);
    return data.image_b64;
  } catch (e) {
    return null;
  }
}

export async function generateFoodIcon(foodName: string): Promise<string | null> {
  try {
    const data = await fetchApi(`/dashboard/icons/${encodeURIComponent(foodName)}/generate`, {
      method: 'POST',
    });
    return data.image_b64;
  } catch (e) {
    return null;
  }
}

export async function getFoodIcon(foodName: string): Promise<string | null> {
  try {
    const data = await fetchApi(`/dashboard/icons/${encodeURIComponent(foodName)}`);
    return data.image_b64;
  } catch (e) {
    return null;
  }
}

export async function getInventory(userId: string) {
  return fetchApi(`/dashboard/inventory/${userId}`);
}

export async function getMealPlan(userId: string) {
  return fetchApi(`/dashboard/meal-plan/${userId}/current`);
}

export async function getFavoriteRecipes(userId: string) {
  return fetchApi(`/dashboard/recipes/${userId}/favorites`);
}

export async function getOrders(userId: string) {
  return fetchApi(`/dashboard/orders/${userId}`);
}

export interface RecipeFilters {
  query?: string;
  servings?: number;
  difficulty?: string;
  flavor_profile?: Record<string, number>;
}

export async function generateRecipes(userId: string, filters?: RecipeFilters) {
  return fetchApi(`/dashboard/recipes/${userId}/generate`, {
    method: 'POST',
    body: JSON.stringify(filters || {}),
  });
}

export async function getPreferences(userId: string) {
  return fetchApi(`/dashboard/preferences/${userId}`);
}
