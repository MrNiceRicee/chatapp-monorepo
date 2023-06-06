import { createTRPCRouter } from '../../trpc';
import { message } from './messages';

export const chatRouter = createTRPCRouter({
  messages: message,
});
