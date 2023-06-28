import { useEffect, useRef } from 'react';
import { api, isTRPCClientError } from '../../api/trpc';

function ErrorMessage({ error }: { error: unknown }) {
  if (!isTRPCClientError(error)) {
    return (
      <div className="mx-auto w-fit text-red-500">
        <p>Unknown error</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-fit text-red-500">
      <p>{error.message}</p>
    </div>
  );
}

export function Chat() {
  const messages = api.chat.listMessage.useQuery(undefined, {
    retry: false,
  });
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.data]);

  if (messages.error) {
    return <ErrorMessage error={messages.error} />;
  }

  if (messages.isInitialLoading) {
    return (
      <div className="mx-auto w-fit animate-pulse">
        <p className="text-sm font-light text-zinc-300">Loading...</p>
      </div>
    );
  }

  if (!messages.data) {
    return (
      <div className="mx-auto w-fit">
        <p className="text-sm font-light text-zinc-300">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-fit">
      <h1>some messages</h1>
    </div>
  );
}
