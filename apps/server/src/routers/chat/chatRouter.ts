import { createTRPCRouter } from '../../trpc';
import { subscriptionMessage } from './subscriptionMessage';
import { addMessage } from './addMessage';
import { listMessage } from './listMessage';

export const chatRouter = createTRPCRouter({
  subscriptionMessages: subscriptionMessage,
  addMessage,
  listMessage,
});
