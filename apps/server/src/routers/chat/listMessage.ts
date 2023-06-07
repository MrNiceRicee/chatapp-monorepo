import { publicProcedure } from '../../trpc';
import { type Message } from '../../types/types';

export const listMessage = publicProcedure.query(async ({ ctx }) => {
  const messages = await ctx.redis.lrange('public-messages', 0, -1);

  return messages.map((message) => JSON.parse(message) as Message).reverse();
});
