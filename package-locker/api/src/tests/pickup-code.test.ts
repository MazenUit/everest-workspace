import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generatePickupCode } from '../domain/pickup-code';

describe('generatePickupCode', () => {
  it('returns a 6-character code', () => {
    const code = generatePickupCode();
    assert.equal(code.length, 6);
  });

  it('uses only uppercase letters and digits', () => {
    const code = generatePickupCode();
    assert.match(code, /^[A-Z0-9]{6}$/);
  });

  it('generates different codes on repeated calls', () => {
    const a = generatePickupCode();
    const b = generatePickupCode();
    assert.notEqual(a, b);
  });
});