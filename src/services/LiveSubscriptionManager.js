import { supabase } from '../lib/supabase';

class LiveSubscriptionManager {
  constructor() {
    this.subscriptions = new Map();
    this.listeners = new Map();
    this._listenerIdSeq = 0;
  }

  subscribe(matchId, callback) {
    if (!matchId || !supabase) return () => {};

    const listenerId = ++this._listenerIdSeq;

    if (!this.listeners.has(matchId)) {
      this.listeners.set(matchId, new Map());
    }
    this.listeners.get(matchId).set(listenerId, callback);

    if (!this.subscriptions.has(matchId)) {
      this._createChannel(matchId);
    }

    return () => {
      const matchListeners = this.listeners.get(matchId);
      if (matchListeners) {
        matchListeners.delete(listenerId);
        if (matchListeners.size === 0) {
          this.listeners.delete(matchId);
          this._destroyChannel(matchId);
        }
      }
    };
  }

  _createChannel(matchId) {
    const topic = `jdca:live:${matchId}`;
    const channel = supabase.channel(topic);
    let retryCount = 0;
    let retryTimer = null;
    let destroyed = false;

    const sub = { channel, retryTimer, destroyed };
    this.subscriptions.set(matchId, sub);

    channel.on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'deliveries',
      filter: `match_id=eq.${matchId}`
    }, (payload) => {
      this._notifyListeners(matchId, payload);
    });

    channel.on('system', { event: '*' }, (status) => {
      if (sub.destroyed) return;

      if (status.status === 'SUBSCRIBED') {
        retryCount = 0;
        this._notifyListeners(matchId, { _type: 'CONNECTED' });
      }

      if (status.status === 'CHANNEL_ERROR' || status.status === 'TIMED_OUT') {
        console.warn(`[LiveSub] Channel error for match ${matchId}:`, status.status);
        this._scheduleReconnect(matchId, retryCount++);
      }

      if (status.status === 'CLOSED') {
        if (!sub.destroyed) {
          this._scheduleReconnect(matchId, retryCount++);
        }
      }
    });

    channel.subscribe((status) => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        if (!sub.destroyed) {
          this._scheduleReconnect(matchId, retryCount++);
        }
      }
    });
  }

  _scheduleReconnect(matchId, retryCount) {
    const sub = this.subscriptions.get(matchId);
    if (!sub || sub.destroyed) return;

    if (sub.retryTimer) clearTimeout(sub.retryTimer);

    const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
    console.log(`[LiveSub] Reconnecting match ${matchId} in ${delay}ms (attempt ${retryCount + 1})`);

    sub.retryTimer = setTimeout(() => {
      if (sub.destroyed) return;
      if (!this.listeners.has(matchId) || this.listeners.get(matchId).size === 0) {
        this._destroyChannel(matchId);
        return;
      }
      this._destroyChannel(matchId);
      this._createChannel(matchId);
    }, delay);
  }

  _destroyChannel(matchId) {
    const sub = this.subscriptions.get(matchId);
    if (!sub) return;

    sub.destroyed = true;
    if (sub.retryTimer) clearTimeout(sub.retryTimer);

    try {
      supabase.removeChannel(sub.channel);
    } catch (e) {}

    this.subscriptions.delete(matchId);
  }

  _notifyListeners(matchId, payload) {
    const matchListeners = this.listeners.get(matchId);
    if (!matchListeners) return;
    for (const cb of matchListeners.values()) {
      try { cb(payload); } catch (e) {}
    }
  }

  getActiveMatchIds() {
    return [...this.subscriptions.keys()];
  }

  hasSubscribers(matchId) {
    const l = this.listeners.get(matchId);
    return l ? l.size > 0 : false;
  }
}

export const liveSubManager = new LiveSubscriptionManager();
