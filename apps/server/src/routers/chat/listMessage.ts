import { publicProcedure } from '../../trpc';
import { type Message } from '../../types/types';

export const listMessage = publicProcedure.query(async ({ ctx }) => {
  // return ctx.redis.lrange('public-messages', 0, -1) as unknown as Promise<
  //   Message[]
  // >;
  // return ctx.redis.listPublicMessages('public-messages');
  const messages = await ctx.redis.lrange('public-messages', 0, -1);

  return messages.map((message) => JSON.parse(message) as Message);
});
