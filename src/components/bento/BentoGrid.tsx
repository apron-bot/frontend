import { useState, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import CardHeader, { type NavTab } from './CardHeader';
import ScanFridgeBox from './ScanFridgeBox';
import ShoppingListBox from './ShoppingListBox';
import MealPlanBox from './MealPlanBox';
import DeliveryTimelineBox from './DeliveryTimelineBox';
import DeliveryDashboard from './DeliveryDashboard';
import PantryPage from '../pages/PantryPage';
import RecipesPage from '../pages/RecipesPage';
import OrdersPage from '../pages/OrdersPage';

export default function BentoGrid() {
  const { isDayMode } = useTheme();
  const [activePage, setActivePage] = useState<NavTab>('Dashboard');

  const handlePageChange = useCallback((page: NavTab) => {
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
      <div style={{ flexShrink: 0 }}>
        <CardHeader activePage={activePage} onPageChange={handlePageChange} />
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {activePage === 'Dashboard' ? (
          isDayMode ? (
            /* Cooking mode dashboard */
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
          ) : (
            /* Delivery mode dashboard */
            <DeliveryDashboard />
          )
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
