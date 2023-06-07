import { publicProcedure } from '../../trpc';
import { type Message } from '../../types/types';

export const listMessage = publicProcedure.query(async ({ ctx }) => {
  return ctx.redis.lrange<Message>('public-messages', 0, -1);
});
