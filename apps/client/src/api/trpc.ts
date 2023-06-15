import { type AppRouter } from '@rice/server';
import { createTRPCReact, TRPCClientError } from '@trpc/react-query';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export const api = createTRPCReact<AppRouter>();

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}
