const SSE_URL = 'http://localhost:8000/events';

type EventHandler = (data: any) => void;

class EventStream {
  private source: EventSource | null = null;
  private handlers: Map<string, EventHandler[]> = new Map();

  connect() {
    if (this.source) return;
    this.source = new EventSource(SSE_URL);

    this.source.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        const { type, data } = parsed;
        const typeHandlers = this.handlers.get(type) || [];
        typeHandlers.forEach((handler) => handler(data));
        // Also fire wildcard handlers
        const wildcardHandlers = this.handlers.get('*') || [];
        wildcardHandlers.forEach((handler) => handler(parsed));
      } catch (e) {
        // ignore parse errors
      }
    };

    this.source.onerror = () => {
      // Auto-reconnect is built into EventSource
    };
  }

  on(eventType: string, handler: EventHandler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
    return () => {
      const list = this.handlers.get(eventType);
      if (list) {
        this.handlers.set(eventType, list.filter((h) => h !== handler));
      }
    };
  }

  disconnect() {
    this.source?.close();
    this.source = null;
  }
}

export const eventStream = new EventStream();
