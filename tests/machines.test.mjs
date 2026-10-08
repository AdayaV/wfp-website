import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeMachine } from '../src/data/machines.ts';

test('legacy records gain a WFP name without invented specifications', () => {
  const machine = normalizeMachine({ id: 'legacy', year: 2026, image: { url: 'https://example.com/car.jpg', width: 1000, height: 750 } });
  assert.equal(machine.name, 'WFP2026');
  assert.equal(machine.image, 'https://example.com/car.jpg');
  assert.deepEqual(machine.specifications, []);
  assert.deepEqual(machine.awards, []);
});
test('missing photos stay blank', () => {
  for (const image of [undefined, null, {}]) assert.equal(normalizeMachine({ id: 'blank', year: 2011, image }).image, undefined);
});
test('supports actual historical names and fixes a year-only name', () => {
  assert.equal(normalizeMachine({ id: 'early', year: 2010, name: ' WF-02 ' }).name, 'WF-02');
  assert.equal(normalizeMachine({ id: 'year', year: 2026, name: '2026' }).name, 'WFP2026');
});
test('parses specifications with Japanese or ASCII colons', () => {
  const machine = normalizeMachine({ id: 'spec', year: 2026, specifications: ' テスト項目：サンプル値\r\n区切り文字:A:B\n\nエンジン：\n確認中' });
  assert.deepEqual(machine.specifications, [{ label: 'テスト項目', value: 'サンプル値' }, { label: '区切り文字', value: 'A:B' }]);
});
test('awards and results are editable, including intentional blanks', () => {
  assert.deepEqual(normalizeMachine({ id: 'award', year: 2026, awards: ' ベストエアロ賞 3位\n\n ' }).awards, ['ベストエアロ賞 3位']);
  const blank = normalizeMachine({ id: 'empty', year: 2026, awards: '', description: '', competitionResult: '' });
  assert.deepEqual(blank.awards, []);
  assert.equal(blank.competitionResult, undefined);
});
test('invalid years are not rendered', () => {
  for (const year of [undefined, null, NaN, 2026.5, 100, 'bad']) assert.equal(normalizeMachine({ id: 'invalid', year }), null);
});
