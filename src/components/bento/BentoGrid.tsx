import { useRef, useCallback } from 'react';
import CardHeader from './CardHeader';
import ScanFridgeBox from './ScanFridgeBox';
import ShoppingListBox from './ShoppingListBox';
import MealPlanBox from './MealPlanBox';
import DeliveryTimelineBox from './DeliveryTimelineBox';

export default function BentoGrid() {
  const openOverlayRef = useRef<((tab: 'Dashboard' | 'Pantry' | 'Recipes' | 'Orders') => void) | null>(null);

  const handleOverlayChange = useCallback((openFn: (tab: 'Dashboard' | 'Pantry' | 'Recipes' | 'Orders') => void) => {
    openOverlayRef.current = openFn;
  }, []);

  const handleOpenPantry = useCallback(() => {
    openOverlayRef.current?.('Pantry');
  }, []);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gridTemplateRows: 'auto 1fr 1fr',
        gridTemplateAreas: `
          "header   header"
          "fridge   shopping"
          "meal     delivery"
        `,
        gap: 10,
        padding: 16,
        height: '100%',
        width: '100%',
      }}
    >
      <div style={{ gridArea: 'header' }}>
        <CardHeader onOverlayChange={handleOverlayChange} />
      </div>
      <div style={{ gridArea: 'fridge', minHeight: 0 }}>
        <ScanFridgeBox onOpenPantry={handleOpenPantry} />
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
  );
}
