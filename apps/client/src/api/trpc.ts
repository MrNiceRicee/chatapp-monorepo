import { type AppRouter } from '@rice/server';
import { createTRPCReact } from '@trpc/react-query';

export const api = createTRPCReact<AppRouter>();
