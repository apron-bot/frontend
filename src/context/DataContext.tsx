import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getInventory, getMealPlan, getOrders, getUserId } from '../services/api';
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

interface DataContextType {
  inventory: InventoryItem[];
  mealPlan: any | null;
  orders: any[];
  loading: boolean;
  lastScanImage: string | null;
  fridgeChanges: { delta: number; name: string }[];
  refreshInventory: () => Promise<void>;
  refreshMealPlan: () => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [mealPlan, setMealPlan] = useState<any | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading] = useState(false);
  const [lastScanImage] = useState<string | null>(null);
  const [fridgeChanges, setFridgeChanges] = useState<{ delta: number; name: string }[]>([]);

  const userId = getUserId();

  const refreshInventory = useCallback(async () => {
    if (!userId) return;
    try {
      const items = await getInventory(userId);
      setInventory(items);
    } catch (e) {
      /* silently fail */
    }
  }, [userId]);

  const refreshMealPlan = useCallback(async () => {
    if (!userId) return;
    try {
      const plan = await getMealPlan(userId);
      setMealPlan(plan);
    } catch (e) {
      /* silently fail */
    }
  }, [userId]);

  const refreshOrders = useCallback(async () => {
    if (!userId) return;
    try {
      const orderList = await getOrders(userId);
      setOrders(orderList);
    } catch (e) {
      /* silently fail */
    }
  }, [userId]);

  // Initial data fetch
  useEffect(() => {
    if (userId) {
      refreshInventory();
      refreshMealPlan();
      refreshOrders();
    }
  }, [userId, refreshInventory, refreshMealPlan, refreshOrders]);

  // Subscribe to SSE events
  useEffect(() => {
    eventStream.connect();

    const unsubInventory = eventStream.on('inventory_updated', (data) => {
      if (data.items) {
        // Calculate changes from previous inventory
        const newItems: InventoryItem[] = data.items;
        const changes: { delta: number; name: string }[] = [];

        for (const item of newItems) {
          const old = inventory.find((i) => i.name === item.name);
          if (!old) {
            changes.push({ delta: item.quantity, name: item.name });
          } else if (item.quantity !== old.quantity) {
            changes.push({ delta: item.quantity - old.quantity, name: item.name });
          }
        }
        // Items removed
        for (const old of inventory) {
          if (!newItems.find((i) => i.name === old.name)) {
            changes.push({ delta: -old.quantity, name: old.name });
          }
        }

        if (changes.length > 0) {
          setFridgeChanges(changes);
        }
        setInventory(newItems);
      }
    });

    const unsubMessage = eventStream.on('message_processed', () => {
      // Refresh all data when a message is processed
      refreshInventory();
      refreshMealPlan();
      refreshOrders();
    });

    return () => {
      unsubInventory();
      unsubMessage();
      eventStream.disconnect();
    };
  }, []);

  return (
    <DataContext.Provider
      value={{
        inventory,
        mealPlan,
        orders,
        loading,
        lastScanImage,
        fridgeChanges,
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
