import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword } from '../src/features/auth/auth.service.js';

test('password hashes verify only the original password', () => {
  const hash = hashPassword('senha-segura-123');
  assert.notEqual(hash, 'senha-segura-123');
  assert.equal(verifyPassword('senha-segura-123', hash), true);
  assert.equal(verifyPassword('senha-incorreta', hash), false);
});
