import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCricket } from '../context/CricketContext';

// The live-scoring workflow is a SINGLE unit: every step must be reachable by
// anyone who can reach the first step, or a user gets stranded (e.g. bounced to
// home when they tap "Review Match & Finalize"). Define it once and reuse it so
// the steps can never drift between role lists.
const SCORING_FLOW_ROUTES = ['/match-setup', '/scoring', '/innings-break', '/match-result'];

// View-only routes. These are read-only screens for spectators; they must NOT
// include the scoring console (/scoring), otherwise a viewer can open it, watch
// a match end, and hit a finalize step they have no permission for.
const PLAYER_ROUTES = [
  '/home', '/matches', '/match-overview', '/match-detail', '/scorecard', '/player-profile',
  '/teams', '/tournaments', '/players', '/selection'
];

const SCORER_ROUTES = [
  ...PLAYER_ROUTES,
  ...SCORING_FLOW_ROUTES,
  '/administration'
];

const SELECTOR_ROUTES = [
  ...SCORER_ROUTES,
  '/players', '/player-registration', '/selection',
  '/scouting', '/selectors' // legacy aliases
];

const ADMIN_ROUTES = [
  ...SELECTOR_ROUTES,
  '/administration', '/access-control', '/officials', '/match-officials'
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
  SCORER: '/matches',
  VIEWER: '/home',
};

// Routes unlocked by the can_score capability flag, regardless of role: the full
// scoring workflow plus the read-only scorecard. Reuses SCORING_FLOW_ROUTES so a
// can_score user always gets every step, finalize included.
const SCORING_CAPABILITY_ROUTES = [...SCORING_FLOW_ROUTES, '/scorecard'];

// ─── Helper: does a role have access to a given path? ────────────────────
export function roleCanAccess(role, path, canScore = false) {
  if (canScore && SCORING_CAPABILITY_ROUTES.includes(path)) return true;
  const allowed = ROLE_PERMISSIONS[role];
  if (!allowed) return false;
  if (allowed === '*') return true;
  return allowed.includes(path);
}

// ─── ProtectedRoute Component ────────────────────────────────────────────
export default function ProtectedRoute({ path, element }) {
  const { isAuthenticated, userRole, userPermissions } = useCricket();

  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (!roleCanAccess(userRole, path, userPermissions?.can_score)) {
    return <Navigate to={ROLE_HOME[userRole] || '/home'} replace />;
  }

  return element;
}
