import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SlideUpSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function SlideUpSheet({
  isOpen,
  onClose,
  children,
}: SlideUpSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.4)",
              zIndex: 40,
            }}
          />

          {/* Sheet content */}
          <motion.div
            initial={{ translateY: "100%" }}
            animate={{ translateY: "0%" }}
            exit={{ translateY: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: "90vh",
              background: "var(--background)",
              borderTop: "1px solid var(--border)",
              borderTopLeftRadius: "var(--radius-lg)",
              borderTopRightRadius: "var(--radius-lg)",
              zIndex: 50,
              padding: 16,
              overflowY: "auto",
            }}
          >
            {/* Drag handle */}
            <div
              style={{
                width: 40,
                height: 4,
                background: "var(--foreground-hint)",
                borderRadius: 9999,
                margin: "0 auto 12px auto",
              }}
            />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
