import fastify from 'fastify';
import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';

import { appRouter, createTRPCContext } from '@rice/api';
import env from '~/config/env';

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
};

async function server() {
  const app = fastify({
    logger: envToLogger[env.NODE_ENV] || true,
    maxParamLength: 5000,
  });

  app.get('/health', (_request, reply) => {
    return reply.send('ok');
  });

  await app.register(cors, {
    // options
  });

  void app.register(fastifyTRPCPlugin, {
    prefix: '/api',
    trpcOptions: { router: appRouter, createContext: createTRPCContext },
  });

  return app;
}

async function main() {
  const app = await server();

  try {
    await app.listen({
      port: env.SERVER_PORT,
      host: env.SERVER_HOST,
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

void main();
