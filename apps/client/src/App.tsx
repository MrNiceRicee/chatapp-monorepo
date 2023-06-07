import { useEffect, useReducer, useRef, useState } from 'react';
import { RouterOutput, api } from './api/trpc';

function HealthStatus() {
  const test = api.health.status.useQuery();

  const determineStatus = () => {
    if (test.isInitialLoading) {
      return 'Loading...';
    }

    if (test.error) {
      return test.error.message;
    }

    return test.data ?? 'Unknown';
  };

  return <p className="text-2xl">Status: {determineStatus()}</p>;
}

function PostMessage() {
  const addMessage = api.chat.addMessage.useMutation();
  const messageRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get('message') as string;
    const username = formData.get('username') as string;

    addMessage.mutate({
      message,
      username,
      timestamp: new Date(Date.now()),
    });

    // reset message
    if (messageRef.current) {
      messageRef.current.value = '';
    }
  };

  // create a unique username by using the current timestamp

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col space-y-2 pt-4 text-left"
    >
      <div>
        <fieldset className="flex items-center space-x-2">
          <label htmlFor="message" className="w-full basis-1/2">
            Username
          </label>
          <input
            type="text"
            name="username"
            className=" w-full rounded-md border p-2"
          />
        </fieldset>
        {addMessage.error?.data?.zodError?.fieldErrors?.username && (
          <p className="text-sm text-red-900 ">
            {addMessage.error.data.zodError.fieldErrors.username.join(', ')}
          </p>
        )}
      </div>
      <div>
        <fieldset className="flex items-center space-x-2">
          <label htmlFor="message" className="w-full basis-1/2">
            Message
          </label>
          <input
            type="text"
            name="message"
            className="w-full rounded-md border p-2"
            ref={messageRef}
          />
        </fieldset>
        {addMessage.error?.data?.zodError?.fieldErrors?.message && (
          <p className="text-sm text-red-900 ">
            {addMessage.error.data.zodError.fieldErrors.message.join(', ')}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={addMessage.isLoading}
        className="ml-auto rounded-md border border-sky-500 bg-sky-50 px-4 py-2 text-sky-900"
      >
        {addMessage.isLoading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}

type MessageList = RouterOutput['chat']['listMessage'];
interface WebsocketData {
  data: MessageList;
  error: string | null;
  connected: boolean;
}

function WebsocketList({ messages }: { messages: MessageList }) {
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const scrollRef = useRef<HTMLUListElement>(null);
  const [model, setModel] = useReducer(
    (prev: WebsocketData, next: Partial<WebsocketData>) => ({
      ...prev,
      ...next,
    }),
    { data: messages ?? [], error: null, connected: false },
  );

  api.chat.subscriptionMessages.useSubscription(undefined, {
    onData(data) {
      const newData = [...model.data, ...data];

      setModel({ data: newData });
      setScrollToBottom(true);
    },
    onError(error) {
      setModel({ error: error.message });
    },
    onStarted() {
      setModel({ connected: true });
    },
  });

  useEffect(() => {
    if (scrollToBottom && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setScrollToBottom(false);
    }
  }, [scrollToBottom]);

  return (
    <div className="space-y-2 pt-4">
      <h2 className="text-2xl">Websocket Test</h2>
      <p className="text-lg">
        Status: {model.connected ? 'Connected' : 'Disconnected'}
      </p>
      <ul
        className="flex h-[40rem] max-w-sm flex-col space-y-2 overflow-auto rounded-md bg-gradient-to-t from-stone-100 to-stone-50 p-4 shadow-inner shadow-stone-300 dark:from-stone-900 dark:to-stone-900/70 dark:shadow-stone-800"
        ref={scrollRef}
      >
        {model.data.map((item, index) => (
          <li
            key={`item-${index}`}
            className="rounded-md border border-gray-300 p-2 text-left "
          >
            <p className="flex w-full justify-between font-medium">
              {item.username}
            </p>
            <p className="text-lg font-light">{item.message}</p>
            <span className="ml-auto text-sm font-light">
              {new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(item.timestamp)}
            </span>
          </li>
        ))}
      </ul>
      {model.data.length === 0 && <p className="text-lg">No messages yet</p>}
    </div>
  );
}

function WebsocketTest() {
  const messages = api.chat.listMessage.useQuery();

  if (messages.error) {
    return <p className="text-lg">Error: {messages.error.message}</p>;
  }

  if (messages.isInitialLoading) {
    return <p className="text-lg">Loading...</p>;
  }

  if (!messages.data) {
    return <p className="text-lg">No messages yet</p>;
  }

  return <WebsocketList messages={messages.data} />;
}

function App() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <section className="max-w-sm">
        <header>
          <h1 className="text-center text-4xl">Hello World</h1>
        </header>
        <section className="space-y-4 text-center">
          <HealthStatus />
          <WebsocketTest />
          <PostMessage />
        </section>
      </section>
    </main>
  );
}

export default App;
