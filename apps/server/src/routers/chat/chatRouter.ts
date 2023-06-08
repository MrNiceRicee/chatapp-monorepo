import { createTRPCRouter } from '../../trpc';
import {
  subscriptionMessage,
  subscriptionMessageSubscribers,
  subscriptionMessageSubscribersCount,
} from './subscriptionMessage';
import { addMessage } from './addMessage';
import { listMessage } from './listMessage';

export const chatRouter = createTRPCRouter({
  subscriptionMessages: subscriptionMessage,
  subscriptionMessageSubscribers,
  subscriptionMessageSubscribersCount,
  addMessage,
  listMessage,
});
