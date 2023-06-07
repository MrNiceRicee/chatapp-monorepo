import { observable } from '@trpc/server/observable';
import { publicProcedure } from '../../trpc';
import { type Message } from '../../types/types';

export const subscriptionMessage = publicProcedure.subscription(({ ctx }) => {
  return observable<Message[]>((observer) => {
    const onMessage = (message: Message) => {
      observer.next([message]);
    };

    ctx.events.on('addPublicMessage', onMessage);

    return () => {
      ctx.events.off('addPublicMessage', onMessage);
    };
  });
});
