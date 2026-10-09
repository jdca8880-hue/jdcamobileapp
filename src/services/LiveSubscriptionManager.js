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

  _createChannel(matchId, initialRetryCount = 0) {
    const topic = `jdca:live:${matchId}`;
    const channel = supabase.channel(topic);

    // retryCount lives on the sub so it SURVIVES channel recreation. Previously
    // it was a local closure variable that reset to 0 every reconnect, so the
    // exponential backoff never escalated — under a sustained outage it would
    // hammer a reconnect roughly every second forever instead of backing off.
    const sub = { channel, retryTimer: null, destroyed: false, retryCount: initialRetryCount };
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
        sub.retryCount = 0;
        this._notifyListeners(matchId, { _type: 'CONNECTED' });
      }

      if (status.status === 'CHANNEL_ERROR' || status.status === 'TIMED_OUT') {
        console.warn(`[LiveSub] Channel error for match ${matchId}:`, status.status);
        this._scheduleReconnect(matchId);
      }

      if (status.status === 'CLOSED') {
        this._scheduleReconnect(matchId);
      }
    });

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        sub.retryCount = 0;
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        if (!sub.destroyed) {
          this._scheduleReconnect(matchId);
        }
      }
    });
  }

  _scheduleReconnect(matchId) {
    const sub = this.subscriptions.get(matchId);
    if (!sub || sub.destroyed) return;

    // Coalesce: if a reconnect is already scheduled, don't stack another
    // (both the 'system' and subscribe() callbacks can fire for one error).
    if (sub.retryTimer) return;

    const attempt = sub.retryCount;
    const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
    console.log(`[LiveSub] Reconnecting match ${matchId} in ${delay}ms (attempt ${attempt + 1})`);

    sub.retryTimer = setTimeout(() => {
      sub.retryTimer = null;
      if (sub.destroyed) return;
      if (!this.listeners.has(matchId) || this.listeners.get(matchId).size === 0) {
        this._destroyChannel(matchId);
        return;
      }
      const nextRetry = sub.retryCount + 1;
      this._destroyChannel(matchId);
      this._createChannel(matchId, nextRetry);
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
