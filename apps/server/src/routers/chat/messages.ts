import { observable } from '@trpc/server/observable';
import { publicProcedure } from '../../trpc';

export const message = publicProcedure.subscription(() => {
  return observable<{
    random: number;
  }>((emit) => {
    const timer = setInterval(() => {
      const randomNumber = Math.random();

      emit.next({
        random: Math.floor(randomNumber * 100),
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  });
});
