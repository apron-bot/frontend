import { useState } from 'react';
import { motion } from 'framer-motion';

interface ConnectScreenProps {
  onConnect: (chatId: string) => void;
  onSkip: () => void;
  error: string | null;
  loading: boolean;
}

export function ConnectScreen({ onConnect, onSkip, error, loading }: ConnectScreenProps) {
  const [chatId, setChatId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatId.trim()) {
      onConnect(chatId.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center h-full w-full p-8"
    >
      <div className="max-w-md w-full text-center">
        {/* Logo / Title */}
        <div className="mb-8">
          <div className="text-6xl mb-4">👨‍🍳</div>
          <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '2rem', fontWeight: 700 }}>
            Apron
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Connect your Telegram to see your kitchen dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="Your Telegram Chat ID"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: 'var(--radius-lg, 12px)',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent, #e07a5f)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'left' }}>
              Send <strong>/start</strong> to Bobby on Telegram, then enter your Chat ID here.
              You can find it by sending <strong>/id</strong> to <strong>@userinfobot</strong> on Telegram.
            </p>
          </div>

          {error && (
            <p style={{ color: '#e07a5f', fontSize: '0.875rem' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !chatId.trim()}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-lg, 12px)',
              background: loading ? 'var(--border)' : 'var(--accent, #e07a5f)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1rem',
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Connecting...' : 'Connect'}
          </button>

          <button
            type="button"
            onClick={onSkip}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-lg, 12px)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              fontSize: '0.875rem',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            Skip — use first available account
          </button>
        </form>
      </div>
    </motion.div>
  );
}
