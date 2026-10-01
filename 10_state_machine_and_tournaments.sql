-- ============================================================
-- JDCA State Machine & Identity Enforcement
-- Phase 1 Remediation
-- ============================================================

-- 1. Tournament Identity Constraint
-- Enforces T-02: A tournament identity is unique by name, season, age category, and gender.
create unique index if not exists tournaments_identity_unique_idx
on tournaments (name, season, age_category_id, gender);


-- 2. Match State Machine Trigger
-- Enforces M-01: Strict transition matrix for match_status

create or replace function check_valid_match_transition()
returns trigger
language plpgsql
as $$
begin
  -- If status hasn't changed, allow the update (avoids blocking unrelated field updates)
  if NEW.status = OLD.status then
    return NEW;
  end if;

  -- 1. Immutable Terminal States
  if OLD.status in ('COMPLETED', 'ABANDONED', 'CANCELLED') then
    raise exception 'State Transition Error: Cannot transition out of a terminal state (%)', OLD.status;
  end if;

  -- 2. Legal Transitions from SCHEDULED
  if OLD.status = 'SCHEDULED' then
    if NEW.status not in ('IN_PROGRESS', 'CANCELLED', 'ABANDONED') then
      raise exception 'State Transition Error: SCHEDULED match can only transition to IN_PROGRESS, CANCELLED, or ABANDONED (Attempted: %)', NEW.status;
    end if;
  end if;

  -- 3. Legal Transitions from IN_PROGRESS
  if OLD.status = 'IN_PROGRESS' then
    if NEW.status not in ('INNINGS_BREAK', 'COMPLETED', 'ABANDONED') then
      raise exception 'State Transition Error: IN_PROGRESS match can only transition to INNINGS_BREAK, COMPLETED, or ABANDONED (Attempted: %)', NEW.status;
    end if;
  end if;

  -- 4. Legal Transitions from INNINGS_BREAK
  if OLD.status = 'INNINGS_BREAK' then
    if NEW.status not in ('IN_PROGRESS', 'COMPLETED', 'ABANDONED') then
      raise exception 'State Transition Error: INNINGS_BREAK match can only transition to IN_PROGRESS, COMPLETED, or ABANDONED (Attempted: %)', NEW.status;
    end if;
  end if;

  return NEW;
end;
$$;

drop trigger if exists trg_match_state_machine on matches;
create trigger trg_match_state_machine
before update on matches
for each row
execute function check_valid_match_transition();
