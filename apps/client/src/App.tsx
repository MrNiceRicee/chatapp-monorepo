import { api } from './api/trpc';

function App() {
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

  return (
    <main className="w-full h-screen flex justify-center items-center">
      <section>
        <h1 className="text-4xl text-center">Hello World</h1>
        <section className="text-center">
          <p className="text-2xl">Status: {determineStatus()}</p>
        </section>
      </section>
    </main>
  );
}

export default App;
