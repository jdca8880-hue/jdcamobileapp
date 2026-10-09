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
    SUPER_ADMIN:     { label: 'Super Admin',      bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: 'rgba(239, 68, 68, 0.35)' },
    DISTRICT_ADMIN:  { label: 'District Admin',   bg: 'rgba(163, 230, 53, 0.15)', color: '#A3E635', border: 'rgba(163, 230, 53, 0.35)' },
    SCORER:          { label: 'Scorer',           bg: 'rgba(249, 115, 22, 0.15)', color: '#F97316', border: 'rgba(249, 115, 22, 0.35)' },
    UMPIRE:          { label: 'Match Umpire',     bg: 'rgba(168, 85, 247, 0.15)', color: '#C084FC', border: 'rgba(168, 85, 247, 0.35)' },
    SELECTOR:        { label: 'Selection Staff',  bg: 'rgba(6, 182, 212, 0.15)', color: '#22D3EE', border: 'rgba(6, 182, 212, 0.35)' },
    VIEWER:          { label: 'Viewer',           bg: 'rgba(100, 116, 139, 0.15)', color: '#94A3B8', border: 'rgba(100, 116, 139, 0.25)' },
    
    // Legacy fallback just in case
    SuperAdmin:      { label: 'Super Admin',      bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: 'rgba(239, 68, 68, 0.35)' },
    Admin:           { label: 'Admin',            bg: 'rgba(163, 230, 53, 0.15)', color: '#A3E635', border: 'rgba(163, 230, 53, 0.35)' },
    'District Admin':{ label: 'District Admin',   bg: 'rgba(163, 230, 53, 0.15)', color: '#A3E635', border: 'rgba(163, 230, 53, 0.35)' },
    Umpire:          { label: 'Match Umpire',     bg: 'rgba(168, 85, 247, 0.15)', color: '#C084FC', border: 'rgba(168, 85, 247, 0.35)' },
    Player:          { label: 'Player',           bg: 'rgba(100, 116, 139, 0.15)', color: '#94A3B8', border: 'rgba(100, 116, 139, 0.25)' },
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
