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

export const subscriptionMessageSubscribers = publicProcedure.subscription(
  async ({ ctx }) => {
    // user connected to the subscription
    const data = await ctx.redis.incr('publicMessageSubscribers');

    ctx.log.info(
      {
        data,
        event: 'publicMessageSubscribers',
      },
      'user connected to the subscription',
    );

    return observable<number>((observer) => {
      const onMessageSubscribers = (count: number) => {
        observer.next(count);
      };

      ctx.events.on('publicMessageSubscribers', onMessageSubscribers);

      return () => {
        ctx.events.off('publicMessageSubscribers', onMessageSubscribers);

        // user disconnected from the subscription
        void ctx.redis.decr('publicMessageSubscribers');
      };
    });
  },
);

export const subscriptionMessageSubscribersCount = publicProcedure.query(
  async ({ ctx }) => {
    const count = await ctx.redis.get('publicMessageSubscribers');

    return Number(count ?? 0);
  },
);
