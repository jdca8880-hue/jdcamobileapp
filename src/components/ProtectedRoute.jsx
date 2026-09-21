import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCricket } from '../context/CricketContext';

const PLAYER_ROUTES = [
  '/home', '/matches', '/match-overview', '/match-detail', '/scorecard', '/player-profile',
  '/teams', '/tournaments', '/news', '/players'
];

const SCORER_ROUTES = [
  ...PLAYER_ROUTES,
  '/match-setup', '/scoring', '/innings-break', '/match-result'
];

const SELECTOR_ROUTES = [
  ...SCORER_ROUTES,
  '/players', '/player-registration', '/selection',
  '/scouting', '/selectors' // legacy aliases
];

const ADMIN_ROUTES = [
  ...SELECTOR_ROUTES,
  '/administration', '/access-control'
];

// ─── Role → Allowed Routes ─────────────────────────────────────────────────
export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: '*', // full access
  DISTRICT_ADMIN: ADMIN_ROUTES,
  SELECTOR: SELECTOR_ROUTES,
  SCORER: SCORER_ROUTES,
  VIEWER: PLAYER_ROUTES,
};

// ─── Role → Default Landing Page After Login ──────────────────────────────
export const ROLE_HOME = {
  SUPER_ADMIN: '/home',
  DISTRICT_ADMIN: '/home',
  SELECTOR: '/home',
  SCORER: '/home',
  VIEWER: '/home',
};

// ─── Helper: does a role have access to a given path? ────────────────────
export function roleCanAccess(role, path) {
  const allowed = ROLE_PERMISSIONS[role];
  if (!allowed) return false;
  if (allowed === '*') return true;
  return allowed.includes(path);
}

// ─── ProtectedRoute Component ────────────────────────────────────────────
export default function ProtectedRoute({ path, element }) {
  const { isAuthenticated, userRole } = useCricket();

  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (!roleCanAccess(userRole, path)) {
    return <Navigate to={ROLE_HOME[userRole] || '/home'} replace />;
  }

  return element;
}
