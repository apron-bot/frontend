import { useState, useCallback } from 'react';
import CardHeader from './CardHeader';
import ScanFridgeBox from './ScanFridgeBox';
import ShoppingListBox from './ShoppingListBox';
import MealPlanBox from './MealPlanBox';
import DeliveryTimelineBox from './DeliveryTimelineBox';
import PantryPage from '../pages/PantryPage';
import RecipesPage from '../pages/RecipesPage';
import OrdersPage from '../pages/OrdersPage';

type ActivePage = 'Dashboard' | 'Pantry' | 'Recipes' | 'Orders';

export default function BentoGrid() {
  const [activePage, setActivePage] = useState<ActivePage>('Dashboard');

  const handlePageChange = useCallback((page: ActivePage) => {
    setActivePage(page);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        padding: 16,
        gap: 10,
      }}
    >
      {/* Header — always visible */}
      <div style={{ flexShrink: 0 }}>
        <CardHeader activePage={activePage} onPageChange={handlePageChange} />
      </div>

      {/* Content area — either bento grid or a full page */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {activePage === 'Dashboard' ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gridTemplateAreas: `
                "fridge   shopping"
                "meal     delivery"
              `,
              gap: 10,
              height: '100%',
              width: '100%',
            }}
          >
            <div style={{ gridArea: 'fridge', minHeight: 0 }}>
              <ScanFridgeBox onOpenPantry={() => handlePageChange('Pantry')} />
            </div>
            <div style={{ gridArea: 'shopping', minHeight: 0 }}>
              <ShoppingListBox />
            </div>
            <div style={{ gridArea: 'meal', minHeight: 0 }}>
              <MealPlanBox />
            </div>
            <div style={{ gridArea: 'delivery', minHeight: 0 }}>
              <DeliveryTimelineBox />
            </div>
          </div>
        ) : activePage === 'Pantry' ? (
          <PantryPage />
        ) : activePage === 'Recipes' ? (
          <RecipesPage />
        ) : activePage === 'Orders' ? (
          <OrdersPage />
        ) : null}
      </div>
    </div>
  );
}
