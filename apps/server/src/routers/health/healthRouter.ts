import { createTRPCRouter, publicProcedure } from '../../trpc';

export const healthRouter = createTRPCRouter({
  status: publicProcedure.query(() => {
    return 'ok' as const;
  }),
});
