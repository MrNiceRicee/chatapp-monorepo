import { useState } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import superjson from 'superjson';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './trpc';
import env from '../config/env';

export function QueryProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: env.VITE_SERVER_URL,
        }),
      ],
      transformer: superjson,
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
