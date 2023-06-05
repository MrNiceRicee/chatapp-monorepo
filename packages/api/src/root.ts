import { createTRPCRouter } from '~/trpc';
import { healthRouter } from './routers/health/healthRouter';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  health: healthRouter,
});

// export type definition of the API
export type AppRouter = typeof appRouter;
