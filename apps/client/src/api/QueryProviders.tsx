import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import superjson from 'superjson';
import {
  httpBatchLink,
  wsLink,
  createWSClient,
  loggerLink,
} from '@trpc/client';
import { api } from './trpc';
import env from '../config/env';

const queryClient = new QueryClient();
const wsEndpoint = () => {
  let url = env.VITE_SERVER_URL;

  if (url.match(/^https?:\/\//)) {
    // replace http or https with ws or wss
    url = url.replace(/^https?:\/\//, 'ws://');
  }

  return url;
};
const wsClient = createWSClient({
  url: wsEndpoint(),
});

const trpcClient = api.createClient({
  links: [
    loggerLink({
      enabled: (opts) =>
        (process.env.NODE_ENV === 'development' &&
          typeof window !== 'undefined') ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    wsLink({
      client: wsClient,
    }),
    httpBatchLink({
      url: env.VITE_SERVER_URL,
    }),
  ],
  transformer: superjson,
});

export function QueryProviders({ children }: { children: React.ReactNode }) {
  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
