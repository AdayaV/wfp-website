import test from 'node:test';
import assert from 'node:assert/strict';
import { getMachineImageAttributes } from '../src/utils/machineImages.ts';

test('microCMS image uses compressed WebP with a bounded fallback size', () => {
  const result = getMachineImageAttributes('https://images.microcms-assets.io/assets/abc/car.jpg');
  const url = new URL(result.src);
  assert.equal(url.searchParams.get('auto'), 'compress');
  assert.equal(url.searchParams.get('fm'), 'webp');
  assert.equal(url.searchParams.get('w'), '1440');
  assert.equal(url.pathname, '/assets/abc/car.jpg');
});

test('responsive candidate widths match their descriptors and sizes match the archive layout', () => {
  const result = getMachineImageAttributes('https://images.microcms-assets.io/assets/abc/car.jpg');
  const candidates = result.srcset.split(', ');
  assert.deepEqual(candidates.map((candidate) => Number(candidate.split(' ')[1].slice(0, -1))), [480, 768, 1200, 1600]);
  for (const candidate of candidates) {
    const [source, descriptor] = candidate.split(' ');
    assert.equal(new URL(source).searchParams.get('w'), descriptor.slice(0, -1));
  }
  assert.ok(result.sizes.includes('(max-width: 760px)'));
  assert.ok(result.sizes.endsWith('580px'));
});

test('existing crop, quality and other query values survive optimization', () => {
  const source = 'https://images.microcms-assets.io/assets/abc/car.png?rect=10%2C20%2C500%2C300&fit=crop&q=82&w=3000&fm=png&auto=format&tag=one&tag=two#photo';
  const result = getMachineImageAttributes(source);
  for (const output of [result.src, ...result.srcset.split(', ').map((item) => item.split(' ')[0])]) {
    const url = new URL(output);
    assert.equal(url.searchParams.get('rect'), '10,20,500,300');
    assert.equal(url.searchParams.get('fit'), 'crop');
    assert.equal(url.searchParams.get('q'), '82');
    assert.deepEqual(url.searchParams.getAll('tag'), ['one', 'two']);
    assert.equal(url.searchParams.get('fm'), 'webp');
    assert.equal(url.searchParams.get('auto'), 'compress');
    assert.equal(url.hash, '#photo');
  }
});

test('local, external, malformed and lookalike-host URLs are unchanged', () => {
  for (const source of [
    '/images/car.jpg',
    'https://example.com/car.jpg?width=99',
    'https://images.microcms-assets.io.example.com/car.jpg',
    'http://images.microcms-assets.io/assets/car.jpg',
    'not a url',
    '',
  ]) {
    assert.deepEqual(getMachineImageAttributes(source), { src: source });
  }
});
