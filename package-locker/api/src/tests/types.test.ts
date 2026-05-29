import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Size, lockerFitsPackage } from '../domain/types';

describe('lockerFitsPackage', () => {
  it('allows same size', () => {
    assert.equal(lockerFitsPackage(Size.Small, Size.Small), true);
    assert.equal(lockerFitsPackage(Size.Medium, Size.Medium), true);
    assert.equal(lockerFitsPackage(Size.Large, Size.Large), true);
  });

  it('allows a larger locker for a smaller package', () => {
    assert.equal(lockerFitsPackage(Size.Medium, Size.Small), true);
    assert.equal(lockerFitsPackage(Size.Large, Size.Small), true);
    assert.equal(lockerFitsPackage(Size.Large, Size.Medium), true);
  });

  it('rejects a smaller locker for a larger package', () => {
    assert.equal(lockerFitsPackage(Size.Small, Size.Medium), false);
    assert.equal(lockerFitsPackage(Size.Small, Size.Large), false);
    assert.equal(lockerFitsPackage(Size.Medium, Size.Large), false);
  });
});