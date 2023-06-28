import { lazy } from 'react';
import { Glass } from './components/Glass';
import { Chat } from './components/Chat/Chat';

const Background = lazy(() =>
  import('./components/Background').then((module) => ({
    default: module.Background,
  })),
);

export default function App() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Background />
      <Glass asChild>
        <section className="container mx-auto">
          <div className="flex items-center justify-center">
            <h1>Silly Chat</h1>
          </div>
          <Chat />
        </section>
      </Glass>
    </main>
  );
}
