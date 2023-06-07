import { type Callback, Redis, Result } from 'ioredis';
import env from './env';
// const client = new Redis("redis://default:ad11782d4b2b4f1e8d51979ddfb85610@glowing-python-37293.upstash.io:37293");

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
