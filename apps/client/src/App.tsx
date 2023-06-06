import { useReducer } from 'react';
import { api } from './api/trpc';

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

interface WebsocketData {
  data: { random: number }[];
  error: string | null;
  connected: boolean;
}

function WebsocketTest() {
  const [model, setModel] = useReducer(
    (prev: WebsocketData, next: Partial<WebsocketData>) => ({
      ...prev,
      ...next,
    }),
    { data: [], error: null, connected: false },
  );

  api.chat.messages.useSubscription(undefined, {
    onData(data) {
      // data is {random: number}
      const currentNumbers = model.data;

      if (currentNumbers.length > 10) {
        currentNumbers.shift();
      }

      setModel({ data: [...currentNumbers, data] });
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
          <li key={`${item.random}-${index}`} className="font-light">
            {item.random}
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <main className="w-full h-screen flex justify-center items-center">
      <section>
        <h1 className="text-4xl text-center">Hello World</h1>
        <section className="text-center space-y-4 divide-y">
          <HealthStatus />
          <WebsocketTest />
        </section>
      </section>
    </main>
  );
}

export default App;
