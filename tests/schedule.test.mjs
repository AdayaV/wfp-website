import assert from 'node:assert/strict';
import test from 'node:test';
import { buildScheduleItems } from '../src/data/schedule.ts';

const festival = {
  id: 'festival', phase: ['EVENT'], title: '学園祭',
  startDate: '2026-11-05T15:00:00Z', endDate: '2026-11-07T15:00:00Z',
};
const testDay = {
  id: 'test', phase: 'TEST', title: '走行日', startDate: '2026-11-11T00:00:00+09:00',
};
const nextIds = (now, entries = [festival, testDay]) => buildScheduleItems(entries, Date.parse(now))
  .filter(item => item.isNext).map(item => item.id);

test('a multi-day event stays next through its final Japanese calendar day', () => {
  for (const now of ['2026-11-05T12:00:00+09:00', '2026-11-07T12:00:00+09:00',
    '2026-11-08T12:00:00+09:00', '2026-11-08T23:59:59.999+09:00']) {
    assert.deepEqual(nextIds(now), ['festival']);
  }
});

test('the next event takes over at midnight after the final day', () => {
  assert.deepEqual(nextIds('2026-11-09T00:00:00+09:00'), ['test']);
});

test('a one-day event uses its start date even with another event coming up', () => {
  const later = { ...testDay, id: 'later', startDate: '2026-12-01T00:00:00+09:00' };
  assert.deepEqual(nextIds('2026-11-11T23:59:59.999+09:00', [testDay, later]), ['test']);
});

test('there is no next event after every event has ended or for an empty list', () => {
  const now = '2026-11-12T00:00:00+09:00';
  assert.deepEqual(nextIds(now), []);
  assert.deepEqual(nextIds(now, []), []);
});

test('both pages receive matching status and cutoff values when events overlap', () => {
  const overlapping = { ...testDay, startDate: '2026-11-08T10:00:00+09:00' };
  const cutoff = Date.parse('2026-11-09T00:00:00+09:00');
  const items = buildScheduleItems([festival, overlapping], cutoff - 1);
  assert.deepEqual(items.map(item => item.endsAt), [cutoff, cutoff]);
  assert.deepEqual(items.map(item => item.isComplete), [false, false]);
  assert.deepEqual(items.map(item => item.isNext), [true, false]);
  assert.equal(items[0].date, '2026.11.06–2026.11.08');
  assert.deepEqual(buildScheduleItems([festival, overlapping], cutoff)
    .map(item => [item.isComplete, item.isNext]), [[true, false], [true, false]]);
});
