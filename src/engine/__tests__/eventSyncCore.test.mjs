// Stage 3 tests for the pure sync decision core (error taxonomy + mapping).
import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyError, toServerRow, escalateIfExhausted, SYNC_RESULT, MAX_ATTEMPTS } from '../../services/eventSyncCore.js';

test('classifyError: offline / network is transient', () => {
  assert.equal(classifyError({ message: 'Failed to fetch' }), SYNC_RESULT.TRANSIENT);
  assert.equal(classifyError({ code: '500' }, { isOnline: true }), SYNC_RESULT.TRANSIENT);
  assert.equal(classifyError({ code: '42501' }, { isOnline: false }), SYNC_RESULT.TRANSIENT); // offline overrides
});

test('classifyError: auth → AUTH', () => {
  assert.equal(classifyError({ code: '401' }), SYNC_RESULT.AUTH);
  assert.equal(classifyError({ message: 'JWT expired' }), SYNC_RESULT.AUTH);
});

test('classifyError: own duplicate id is success (exactly-once)', () => {
  assert.equal(classifyError({ code: '23505', message: 'duplicate key (id)=(evt-1)', details: 'evt-1' }, { eventId: 'evt-1' }), SYNC_RESULT.OK);
  assert.equal(classifyError({ code: '23505', message: 'match_event_log_pkey' }, { eventId: 'evt-x' }), SYNC_RESULT.OK);
});

test('classifyError: a different ball on our seq → SEQ_CONFLICT', () => {
  assert.equal(classifyError({ code: '23505', message: 'uq_match_event_log_innings_seq' }, { eventId: 'evt-9' }), SYNC_RESULT.SEQ_CONFLICT);
});

test('classifyError: deleted match → DROP', () => {
  assert.equal(classifyError({ code: '23503', message: 'violates foreign key constraint on match_id' }), SYNC_RESULT.DROP);
  assert.equal(classifyError({ code: 'MATCH_MISSING' }), SYNC_RESULT.DROP);
});

test('classifyError: RLS / missing column / bad data → PERMANENT (quarantine)', () => {
  assert.equal(classifyError({ code: '42501', message: 'row-level security' }), SYNC_RESULT.PERMANENT);
  assert.equal(classifyError({ code: '42703', message: 'column foo does not exist' }), SYNC_RESULT.PERMANENT);
  assert.equal(classifyError({ code: '23514', message: 'violates check constraint' }), SYNC_RESULT.PERMANENT);
});

test('escalate: transient becomes permanent only after the attempt cap', () => {
  assert.equal(escalateIfExhausted(SYNC_RESULT.TRANSIENT, 0), SYNC_RESULT.TRANSIENT);
  assert.equal(escalateIfExhausted(SYNC_RESULT.TRANSIENT, MAX_ATTEMPTS - 1), SYNC_RESULT.PERMANENT);
  assert.equal(escalateIfExhausted(SYNC_RESULT.PERMANENT, 0), SYNC_RESULT.PERMANENT);
});

test('toServerRow: maps camel/snake + stamps uploader as created_by for RLS', () => {
  const row = toServerRow({ id: 'evt-1', matchId: 'M', inningsNumber: 2, seq: 5, type: 'DELIVERY', payload: { a: 1 }, voided: false }, 'user-7');
  assert.deepEqual(row, { id: 'evt-1', match_id: 'M', innings_number: 2, seq: 5, type: 'DELIVERY', payload: { a: 1 }, voided: false, created_by: 'user-7' });
  const mLevel = toServerRow({ id: 'evt-2', matchId: 'M', type: 'MATCH_STARTED', payload: {} }, 'user-7');
  assert.equal(mLevel.innings_number, null);
  assert.equal(mLevel.seq, null);
});
