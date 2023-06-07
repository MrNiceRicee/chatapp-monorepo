import { useReducer } from 'react';
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
  };

  // create a unique username by using the current timestamp

  return (
    <form onSubmit={onSubmit} className="space-y-2 pt-4 text-left flex flex-col">
      <div>
        <fieldset className="flex space-x-2 items-center">
          <label htmlFor="message" className="basis-1/2 w-full">
            Username
          </label>
          <input
            type="text"
            name="username"
            className=" border rounded-md p-2 w-full"
          />
        </fieldset>
        {addMessage.error?.data?.zodError?.fieldErrors?.username && (
          <p className="text-sm text-red-900 ">
            {addMessage.error.data.zodError.fieldErrors.username.join(', ')}
          </p>
        )}
      </div>
      <div>
        <fieldset className="flex space-x-2 items-center">
          <label htmlFor="message" className="basis-1/2 w-full">
            Message
          </label>
          <input
            type="text"
            name="message"
            className="w-full border rounded-md p-2"
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
        className="ml-auto px-4 py-2 bg-sky-50 border border-sky-500 rounded-md text-sky-900"
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
    },
    onError(error) {
      setModel({ error: error.message });
    },
    onStarted() {
      setModel({ connected: true });
    },
  });

  return (
    <div className="space-y-2 pt-4">
      <h2 className="text-2xl">Websocket Test</h2>
      <p className="text-lg">
        Status: {model.connected ? 'Connected' : 'Disconnected'}
      </p>
      <ul className="space-y-2">
        {model.data.map((item, index) => (
          <li
            key={`item-${index}`}
            className="border border-gray-300 rounded-md p-2"
          >
            <p className="text w-full text-left">{item.username}</p>
            <p className="text-lg">{item.message}</p>
            <p className="text-sm">
              {new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(item.timestamp)}
            </p>
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
    <main className="w-full h-screen flex justify-center items-center">
      <section className="max-w-sm">
        <h1 className="text-4xl text-center">Hello World</h1>
        <section className="text-center space-y-4 divide-y divide-stone-400">
          <HealthStatus />
          <PostMessage />
          <WebsocketTest />
        </section>
      </section>
    </main>
  );
}

export default App;
