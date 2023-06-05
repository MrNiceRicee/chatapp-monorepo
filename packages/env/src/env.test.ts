import { describe, test, expect } from 'vitest';
import { serverEnv } from './index';

describe('serverEnv test', () => {
  // error is to mimic no process.env
  test('should throw error if no process.env', () => {
    try {
      serverEnv();
      expect.fail('should throw error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('success', () => {
    const env = serverEnv({ SERVER_PORT: '3000', SERVER_HOST: 'localhost' });

    expect(env).toEqual({ SERVER_PORT: '3000', SERVER_HOST: 'localhost' });
  });
});
