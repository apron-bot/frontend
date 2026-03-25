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

export async function generateRecipes(userId: string, query?: string) {
  return fetchApi(`/dashboard/recipes/${userId}/generate`, {
    method: 'POST',
    body: JSON.stringify({ query: query || null }),
  });
}

export async function getPreferences(userId: string) {
  return fetchApi(`/dashboard/preferences/${userId}`);
}
