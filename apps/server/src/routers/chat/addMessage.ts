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
  color: z.string().refine(
    (v) => {
      return /^#[0-9A-F]{6}$/i.test(v);
    },
    {
      message: 'Color must be a hex color code',
    },
  ),
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
    color: input.color,
    timestamp: input.timestamp?.getTime() ?? Date.now(),
  };

  await ctx.redis.addPublicMessage('public-messages', JSON.stringify(message));

  ctx.log.info({ message }, 'added message');
  ctx.events.emit('addPublicMessage', message);

  return true;
};

export const addMessage = publicProcedure
  .input(addMessageInput)
  .mutation(addMessageMain);
