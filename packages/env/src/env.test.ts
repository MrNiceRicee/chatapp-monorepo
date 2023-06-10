import { describe, expect, test } from 'vitest';
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
    const env = serverEnv({
      PORT: '3000',
      SERVER_HOST: 'localhost',
      REDIS_URL: 'http://www.example.com',
    });

    expect(env).toEqual({
      PORT: 3000,
      SERVER_HOST: 'localhost',
      NODE_ENV: 'production',
      REDIS_URL: 'http://www.example.com',
    });
  });
});
