// add a message to the redis list

import { z } from 'zod';
import { publicProcedure, type TRPCContext } from '../../trpc';

const addMessageInput = z.object({
  message: z
    .string()
    .min(1, {
      message: 'Message cannot be empty',
    })
    .trim(),
  username: z
    .string()
    .min(1, {
      message: 'Username cannot be empty',
    })
    .trim(),
  timestamp: z.date().optional(),
});

const addMessageMain = async ({
  ctx,
  input,
}: {
  ctx: TRPCContext;
  input: z.infer<typeof addMessageInput>;
}) => {
  ctx.log.info({ input }, 'addMessage');
  const message = {
    message: input.message,
    username: input.username,
    timestamp: input.timestamp?.getTime() ?? Date.now(),
  };

  await ctx.redis.lpush('public-messages', message);

  ctx.log.info({ message }, 'added message');
  ctx.events.emit('addPublicMessage', message);

  return true;
};

export const addMessage = publicProcedure
  .input(addMessageInput)
  .mutation(addMessageMain);
