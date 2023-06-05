import { publicProcedure, createTRPCRouter } from "~/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => {
    return 'ok';
  })
})

// export type definition of the API
export type AppRouter = typeof appRouter;