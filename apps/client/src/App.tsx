import { useEffect, useReducer, useRef, useState } from 'react';
import { RouterOutput, api } from './api/trpc';
import { atomWithStorage } from 'jotai/utils';

const userAtom = atomWithStorage<{
  username: string | null;
  color: string | null;
}>('user', {
  username: null,
  color: null,
});

function PostMessage() {
  const apiContext = api.useContext();
  const [users, setUsers] = useState<number>(0);
  const initialUsers =
    api.chat.subscriptionMessageSubscribersCount.useQuery(undefined);
  const addMessage = api.chat.addMessage.useMutation();
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setUsers(initialUsers.data ?? 0);
  }, [initialUsers.data]);

  api.chat.subscriptionMessageSubscribers.useSubscription(undefined, {
    onData(data) {
      setUsers(data);
    },
  });

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

    void apiContext.chat.subscriptionMessageSubscribersCount.invalidate();

    // reset message
    if (messageRef.current) {
      messageRef.current.value = '';
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col">
      <div className="w-full space-y-4 overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
        <fieldset className="flex items-center space-x-2">
          <label htmlFor="message" className="sr-only">
            Username
          </label>
          <input
            type="text"
            name="username"
            placeholder="Username (ex: Josh)"
            className="block w-full border-0 bg-inherit pt-2.5 text-lg font-medium placeholder:text-gray-400 focus:outline-none focus:ring-0"
          />
        </fieldset>
        <fieldset className="flex items-center space-x-2">
          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <textarea
            rows={2}
            name="message"
            className="block w-full resize-none border-0 bg-inherit py-0 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="write anything"
            ref={messageRef}
          />
        </fieldset>
        <div className="flex items-center justify-between border-t border-zinc-500 p-2">
          <div className="flex h-full items-center rounded-full border border-teal-500 px-4 py-2 text-sm">
            <p className="space-x-2">
              <span>Users</span>
              <span className="">{users}</span>
            </p>
          </div>
          <button
            type="submit"
            disabled={addMessage.isLoading || addMessage.error !== null}
            className="rounded-full border border-teal-500 bg-teal-50 px-4 py-2 text-teal-900 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-teal-950 dark:text-teal-50"
          >
            {addMessage.isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
      <div className="flex flex-col space-y-2 text-left text-sm text-red-900 dark:text-red-400">
        {addMessage.error?.data?.zodError?.fieldErrors?.message && (
          <p>{addMessage.error.data.zodError.fieldErrors.message.join(', ')}</p>
        )}
        {addMessage.error?.data?.zodError?.fieldErrors?.username && (
          <p>
            {addMessage.error.data.zodError.fieldErrors.username.join(', ')}
          </p>
        )}
      </div>
    </form>
  );
}

type MessageList = RouterOutput['chat']['listMessage'];

const DisplayMessage = ({
  messageData,
}: {
  messageData: MessageList[number];
}) => {
  const { message, username, timestamp } = messageData;
  const avatar = username[0]?.toUpperCase();

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(timestamp);

  return (
    <li className="flex items-center space-x-2">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-teal-500 bg-teal-950 text-white">
        <span className="text-sm font-bold">{avatar}</span>
      </div>
      <article className="flex-grow">
        <div className="text-sm font-medium">{username}</div>
        <div className="text-sm text-gray-500">{formattedDate}</div>
        <div className="mt-1 text-lg">{message}</div>
      </article>
    </li>
  );
};

interface WebsocketData {
  data: MessageList;
  error: string | null;
  connected: boolean;
}

function WebsocketList({ messages }: { messages: MessageList }) {
  const apiContext = api.useContext();
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
      void apiContext.chat.subscriptionMessageSubscribersCount.invalidate();
    },
    onError(error) {
      setModel({ error: error.message });
    },
    onStarted() {
      setModel({ connected: true });
    },
  });

  return (
    <div className="flex h-full flex-col">
      <p className="text-lg">
        Chat is {model.connected ? 'connected' : 'disconnected'}
      </p>
      <ul className="my-2 space-y-2 overflow-auto rounded-md bg-gradient-to-t from-stone-100 to-stone-50 p-4 shadow-inner shadow-stone-300 dark:from-stone-900 dark:to-stone-900/70 dark:shadow-stone-800">
        {model.data.map((item, index) => (
          <DisplayMessage key={index} messageData={item} />
        ))}
      </ul>
      {model.data.length === 0 && <p className="text-lg">No messages yet</p>}
      <div className="mt-auto">
        <PostMessage />
      </div>
    </div>
  );
}

function WebsocketTest() {
  const messages = api.chat.listMessage.useQuery();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // if (messages.data?.length === 0) {
    // return;
    // }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.data]);

  if (messages.error) {
    return <p className="text-lg">Error: {messages.error.message}</p>;
  }

  if (messages.isInitialLoading) {
    return <p className="text-lg">Loading...</p>;
  }

  if (!messages.data) {
    return <p className="text-lg">No messages yet</p>;
  }

  return (
    <>
      <WebsocketList messages={messages.data} />
      <div ref={bottomRef} />
    </>
  );
}

function App() {
  return (
    <main className="relative">
      <header className="sticky">
        <h1 className="text-center text-4xl">Idk some chat app</h1>
      </header>
      <section className="mx-auto h-full max-w-sm space-y-2 px-2">
        <WebsocketTest />
      </section>
    </main>
  );
}

export default App;
