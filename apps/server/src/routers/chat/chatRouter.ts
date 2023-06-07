import { createTRPCRouter } from '../../trpc';
import { message } from './messages';
import { addMessage } from './addMessage';
import { listMessage } from './listMessage';

export const chatRouter = createTRPCRouter({
  subscriptionMessages: message,
  addMessage,
  listMessage,
});
