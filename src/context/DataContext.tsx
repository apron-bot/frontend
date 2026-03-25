import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { getInventory, getMealPlan, getOrders, getUserId, discoverUser, getLastPhoto } from '../services/api';
import { eventStream } from '../services/stream';

interface InventoryItem {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit: string;
  expiry_date: string | null;
  date_added: string;
  source: string;
}

interface BrowserAgentState {
  screenshot: string | null;
  description: string;
  step: number;
  status: 'idle' | 'starting' | 'in_progress' | 'done' | 'failed';
  cartUrl: string | null;
}

interface DataContextType {
  inventory: InventoryItem[];
  mealPlan: any | null;
  orders: any[];
  loading: boolean;
  lastPhoto: string | null;
  fridgeChanges: { delta: number; name: string }[];
  connected: boolean;
  browserAgent: BrowserAgentState;
  refreshInventory: () => Promise<void>;
  refreshMealPlan: () => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [mealPlan, setMealPlan] = useState<any | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);
  const [fridgeChanges, setFridgeChanges] = useState<{ delta: number; name: string }[]>([]);
  const [connected, setConnected] = useState(false);
  const [browserAgent, setBrowserAgent] = useState<BrowserAgentState>({
    screenshot: null,
    description: '',
    step: 0,
    status: 'idle',
    cartUrl: null,
  });
  const [userId, setUserIdState] = useState<string | null>(getUserId());
  const inventoryRef = useRef<InventoryItem[]>([]);

  // Keep ref in sync
  inventoryRef.current = inventory;

  const refreshInventory = useCallback(async () => {
    const uid = userId || getUserId();
    if (!uid) return;
    try {
      const items = await getInventory(uid);
      if (Array.isArray(items)) {
        setInventory(items);
      }
    } catch (e) {
      /* silently fail */
    }
  }, [userId]);

  const refreshMealPlan = useCallback(async () => {
    const uid = userId || getUserId();
    if (!uid) return;
    try {
      const plan = await getMealPlan(uid);
      setMealPlan(plan);
    } catch (e) {
      /* silently fail */
    }
  }, [userId]);

  const refreshOrders = useCallback(async () => {
    const uid = userId || getUserId();
    if (!uid) return;
    try {
      const orderList = await getOrders(uid);
      if (Array.isArray(orderList)) {
        setOrders(orderList);
      }
    } catch (e) {
      /* silently fail */
    }
  }, [userId]);

  const refreshLastPhoto = useCallback(async () => {
    const uid = userId || getUserId();
    if (!uid) return;
    try {
      const photo = await getLastPhoto(uid);
      if (photo) {
        setLastPhoto(photo);
      }
    } catch (e) {
      /* silently fail */
    }
  }, [userId]);

  // Auto-discover user on mount, poll every 5s if not found
  useEffect(() => {
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    const tryDiscover = async () => {
      const uid = await discoverUser();
      if (!cancelled && uid) {
        setUserIdState(uid);
        setConnected(true);
        if (pollTimer) {
          clearInterval(pollTimer);
          pollTimer = null;
        }
      }
    };

    tryDiscover();

    // If no user found yet, poll every 5s
    pollTimer = setInterval(() => {
      if (!getUserId()) {
        tryDiscover();
      } else {
        if (pollTimer) clearInterval(pollTimer);
      }
    }, 5000);

    return () => {
      cancelled = true;
      if (pollTimer) clearInterval(pollTimer);
    };
  }, []);

  // Fetch all data when userId becomes available
  useEffect(() => {
    if (userId) {
      setLoading(true);
      Promise.all([
        refreshInventory(),
        refreshMealPlan(),
        refreshOrders(),
        refreshLastPhoto(),
      ]).finally(() => setLoading(false));
    }
  }, [userId, refreshInventory, refreshMealPlan, refreshOrders, refreshLastPhoto]);

  // Subscribe to SSE events
  useEffect(() => {
    eventStream.connect();

    const unsubInventory = eventStream.on('inventory_updated', (data) => {
      if (data.items) {
        const newItems: InventoryItem[] = data.items;
        const oldInventory = inventoryRef.current;
        const changes: { delta: number; name: string }[] = [];

        for (const item of newItems) {
          const old = oldInventory.find((i) => i.name === item.name);
          if (!old) {
            changes.push({ delta: item.quantity, name: item.name });
          } else if (item.quantity !== old.quantity) {
            changes.push({ delta: item.quantity - old.quantity, name: item.name });
          }
        }
        for (const old of oldInventory) {
          if (!newItems.find((i) => i.name === old.name)) {
            changes.push({ delta: -old.quantity, name: old.name });
          }
        }

        if (changes.length > 0) {
          setFridgeChanges(changes);
        }
        setInventory(newItems);
      } else {
        // No inline items, just refresh from backend
        refreshInventory();
      }
    });

    const unsubPhoto = eventStream.on('photo_received', (data) => {
      if (data && data.image_b64) {
        setLastPhoto(data.image_b64);
      } else {
        // Refresh photo from backend
        refreshLastPhoto();
      }
      // Also refresh inventory since a photo likely triggers inventory update
      refreshInventory();
    });

    const unsubMessage = eventStream.on('message_processed', () => {
      refreshInventory();
      refreshMealPlan();
      refreshOrders();
    });

    const unsubBrowser = eventStream.on('browser_step', (data) => {
      setBrowserAgent({
        screenshot: data.screenshot || null,
        description: data.description || '',
        step: data.step ?? 0,
        status: data.status || 'in_progress',
        cartUrl: data.cart_url || null,
      });
    });

    return () => {
      unsubInventory();
      unsubPhoto();
      unsubMessage();
      unsubBrowser();
      eventStream.disconnect();
    };
  }, [refreshInventory, refreshMealPlan, refreshOrders, refreshLastPhoto]);

  return (
    <DataContext.Provider
      value={{
        inventory,
        mealPlan,
        orders,
        loading,
        lastPhoto,
        fridgeChanges,
        connected,
        browserAgent,
        refreshInventory,
        refreshMealPlan,
        refreshOrders,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
