import { useState } from 'react';
import { motion } from 'framer-motion';
import bobbyChef from '../assets/bobby.png';

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
        {/* Bobby + Title */}
        <div className="mb-8">
          <img
            src={bobbyChef}
            alt="Bobby the cat chef"
            style={{ width: 100, height: 100, objectFit: 'contain', margin: '0 auto 12px' }}
          />
          <h1
            className="font-pixel"
            style={{ color: 'var(--accent)', fontSize: '1.4rem', letterSpacing: '-0.5px' }}
          >
            KittyCook
          </h1>
          <p style={{ color: 'var(--foreground-muted)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
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
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                background: 'var(--background-secondary)',
                color: 'var(--foreground)',
                fontSize: '1rem',
                fontFamily: 'Nunito, sans-serif',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            <p style={{ color: 'var(--foreground-hint)', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'left' }}>
              Send <strong>/start</strong> to Bobby on Telegram, then enter your Chat ID here.
              You can find it by sending <strong>/id</strong> to <strong>@userinfobot</strong> on Telegram.
            </p>
          </div>

          {error && (
            <p style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !chatId.trim()}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-lg)',
              background: loading ? 'var(--foreground-hint)' : 'var(--accent)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              fontFamily: 'Nunito, sans-serif',
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
              borderRadius: 'var(--radius-lg)',
              background: 'transparent',
              color: 'var(--foreground-muted)',
              fontWeight: 500,
              fontSize: '0.875rem',
              fontFamily: 'Nunito, sans-serif',
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
