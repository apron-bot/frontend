import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import truckBobby from '../assets/truck_bobby.png';

export function BrowserAgentOverlay() {
  const { browserAgent } = useData();

  if (browserAgent.status === 'idle') return null;

  const isActive = browserAgent.status === 'starting' || browserAgent.status === 'in_progress';
  const isDone = browserAgent.status === 'done';
  const isFailed = browserAgent.status === 'failed';

  const statusColor = isActive
    ? 'var(--accent)'
    : isDone
    ? 'var(--success)'
    : 'var(--danger)';

  const statusLabel = isActive
    ? 'Bobby is shopping...'
    : isDone
    ? 'Cart ready!'
    : 'Shopping failed';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(61, 43, 31, 0.6)', backdropFilter: 'blur(6px)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          transition={{ type: 'spring', damping: 24, stiffness: 260 }}
          style={{
            background: 'var(--background)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)',
            boxShadow: '0 12px 48px var(--shadow)',
            maxWidth: 640,
            width: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <img
              src={truckBobby}
              alt="Bobby shopping"
              style={{ width: 52, height: 52, objectFit: 'contain' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  className={isActive ? 'pulse-dot' : ''}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: statusColor,
                    flexShrink: 0,
                  }}
                />
                <span
                  className="font-pixel"
                  style={{ fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '-0.3px' }}
                >
                  KittyCook
                </span>
              </div>
              <p
                className="font-body font-bold"
                style={{ fontSize: '0.95rem', color: 'var(--foreground)', marginTop: 2 }}
              >
                {statusLabel}
              </p>
            </div>
            {isActive && (
              <span
                className="font-body font-bold"
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--foreground-hint)',
                  background: 'var(--background-secondary)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                Step {browserAgent.step}
              </span>
            )}
          </div>

          {/* Screenshot area */}
          <div
            style={{
              position: 'relative',
              aspectRatio: '16/9',
              background: 'var(--background-secondary)',
              overflow: 'hidden',
            }}
          >
            {browserAgent.screenshot ? (
              <img
                src={`data:image/png;base64,${browserAgent.screenshot}`}
                alt="Browser agent view"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  gap: 12,
                  color: 'var(--foreground-hint)',
                }}
              >
                {isActive ? (
                  <>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        border: '3px solid var(--border)',
                        borderTopColor: 'var(--accent)',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }}
                    />
                    <p className="font-body" style={{ fontSize: '0.85rem' }}>
                      Opening the store...
                    </p>
                  </>
                ) : (
                  <p className="font-body" style={{ fontSize: '0.85rem' }}>
                    No screenshot available
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid var(--border)',
            }}
          >
            <p
              className="font-body"
              style={{
                fontSize: '0.85rem',
                color: 'var(--foreground-muted)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {browserAgent.description || 'Working...'}
            </p>
          </div>

          {/* Actions */}
          {isDone && browserAgent.cartUrl && (
            <div style={{ padding: '0 20px 16px' }}>
              <a
                href={browserAgent.cartUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--success)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  fontFamily: 'Nunito, sans-serif',
                  textAlign: 'center',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
              >
                Complete Checkout
              </a>
            </div>
          )}

          {(isDone || isFailed) && (
            <div style={{ padding: '0 20px 16px' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'transparent',
                  color: 'var(--foreground-hint)',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  fontFamily: 'Nunito, sans-serif',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                Dismiss
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
