import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

export function BrowserAgentOverlay() {
  const { browserAgent } = useData();

  if (browserAgent.status === 'idle') return null;

  const isActive = browserAgent.status === 'starting' || browserAgent.status === 'in_progress';
  const isDone = browserAgent.status === 'done';
  const isFailed = browserAgent.status === 'failed';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              isActive ? 'bg-green-500 animate-pulse' :
              isDone ? 'bg-blue-500' :
              'bg-red-500'
            }`} />
            <h2 className="font-semibold text-lg">
              {isActive ? 'Bobby is shopping...' :
               isDone ? 'Cart ready!' :
               'Shopping failed'}
            </h2>
            {isActive && (
              <span className="text-sm text-gray-500 ml-auto">
                Step {browserAgent.step}
              </span>
            )}
          </div>

          {/* Screenshot */}
          <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
            {browserAgent.screenshot ? (
              <img
                src={`data:image/png;base64,${browserAgent.screenshot}`}
                alt="Browser agent view"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                {isActive ? (
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-green-500 rounded-full mx-auto mb-3" />
                    <p>Starting browser agent...</p>
                  </div>
                ) : (
                  <p>No screenshot available</p>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {browserAgent.description || 'Working...'}
            </p>
          </div>

          {/* Actions */}
          {isDone && browserAgent.cartUrl && (
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <a
                href={browserAgent.cartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl text-center transition-colors"
              >
                Complete Checkout
              </a>
            </div>
          )}

          {(isDone || isFailed) && (
            <div className="px-6 pb-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
