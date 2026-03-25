import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import bobbyChef from '../../assets/bobby.png';
import bobbyDelivery from '../../assets/delivery_bobby.png';

export default function Bobby({ size = 80 }: { size?: number }) {
  const { isDayMode } = useTheme();

  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <AnimatePresence mode="wait">
        <motion.img
          key={isDayMode ? 'chef' : 'delivery'}
          src={isDayMode ? bobbyChef : bobbyDelivery}
          alt="Bobby the cat"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0 }}
        />
      </AnimatePresence>
    </div>
  );
}
