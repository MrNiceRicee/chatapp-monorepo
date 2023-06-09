import { type Callback, Redis, Result } from 'ioredis';
import env from './env';

const redis = new Redis(env.REDIS_URL);

redis.defineCommand('addPublicMessage', {
  numberOfKeys: 1,
  lua: `
    local key = KEYS[1]
    local argv = ARGV[1]
    local message = cjson.decode(argv)
    redis.call('lpush', key, argv)
    redis.call('publish', key, argv)
    return message
  `,
});

redis.defineCommand('listPublicMessages', {
  numberOfKeys: 1,
  lua: `
    local key = KEYS[1]
    local messages = redis.call('lrange', key, 0, -1)
    return messages
  `,
});

// track # of subscribers
redis.defineCommand('publicMessageSubscribers', {
  numberOfKeys: 0,
  lua: `
    local key = 'public-messages-subscribers'
    local count = redis.call('incr', key)
    return count
  `,
});

declare module 'ioredis' {
  interface RedisCommander<Context> {
    addPublicMessage(
      key: string,
      argv: string,
      callback?: Callback<string>,
    ): Result<string, Context>;
    listPublicMessages(
      key: string,
      callback?: Callback<string>,
    ): Result<string[], Context>;
  }
}

export { redis };
