import React from 'react';

/**
 * JDCA Badge - semantic status / category indicator
 * variant: 'live' | 'upcoming' | 'completed' | 'cancelled' | 'mango' | 'cobalt' | 'jade' | 'coral'
 */
export function Badge({ variant = 'completed', children, dot = false, className = '' }) {
  const classes = {
    live:      'badge badge-live',
    upcoming:  'badge badge-upcoming',
    completed: 'badge badge-completed',
    cancelled: 'badge badge-cancelled',
    mango:     'badge badge-mango',
    cobalt:    'badge badge-upcoming',
    jade:      'badge badge-live',
    coral:     'badge badge-cancelled',
  };

  return (
    <span className={`${classes[variant] || 'badge badge-completed'} ${className}`}>
      {dot && variant === 'live' && <span className="live-dot" style={{ width: 6, height: 6 }} />}
      {children}
    </span>
  );
}

/**
 * JDCA RoleBadge - user role display
 */
export function RoleBadge({ role }) {
  const config = {
    SUPER_ADMIN:     { label: 'Super Admin',      bg: '#fef0ee', color: '#b83428', border: '#fcd9d5' },
    DISTRICT_ADMIN:  { label: 'District Admin',   bg: '#eef2fd', color: '#1b41a8', border: '#d5e0fa' },
    SCORER:          { label: 'Scorer',           bg: '#fef9ea', color: '#b88920', border: '#fdf0c2' },
    SELECTOR:        { label: 'Selection Staff',  bg: '#e8f8ef', color: '#0a7d4e', border: '#c2edda' },
    VIEWER:          { label: 'Viewer',           bg: '#f1f3f5', color: '#596579', border: '#dde1e8' },
    
    // Legacy fallback just in case
    SuperAdmin:      { label: 'Super Admin',      bg: '#fef0ee', color: '#b83428', border: '#fcd9d5' },
    Admin:           { label: 'Admin',            bg: '#eef2fd', color: '#1b41a8', border: '#d5e0fa' },
    'District Admin':{ label: 'District Admin',   bg: '#eef2fd', color: '#1b41a8', border: '#d5e0fa' },
    Player:          { label: 'Player',           bg: '#f1f3f5', color: '#596579', border: '#dde1e8' },
  };
  const c = config[role] || config['VIEWER'];
  return (
    <span
      className="badge"
      style={{ background: c.bg, color: c.color, borderColor: c.border }}
    >
      {c.label}
    </span>
  );
}

/**
 * JDCA MatchStatusBadge - for match cards
 */
export function MatchStatusBadge({ status }) {
  if (status === 'LIVE' || status === 'IN_PROGRESS') {
    return (
      <span className="badge badge-live" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <span className="live-dot" />
        LIVE
      </span>
    );
  }
  if (status === 'UPCOMING' || status === 'SCHEDULED') return <span className="badge badge-upcoming">Upcoming</span>;
  if (status === 'COMPLETED' || status === 'FINISHED')  return <span className="badge badge-completed">Completed</span>;
  if (status === 'CANCELLED') return <span className="badge badge-cancelled">Cancelled</span>;
  return <span className="badge badge-completed">{status}</span>;
}

export default Badge;
