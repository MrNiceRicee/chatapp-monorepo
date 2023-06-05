import { publicProcedure, createTRPCRouter } from '../../trpc';

export const healthRouter = createTRPCRouter({
  status: publicProcedure.query(() => {
    return 'ok';
  }),
});
