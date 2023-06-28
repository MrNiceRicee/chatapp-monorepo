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
    <main className="min-h-screen overflow-hidden relative flex items-center justify-center py-4">
      <Background />
      <Glass className="grain-overlay container mx-auto max-w-2xl px-2 pb-6 pt-2 before:opacity-20">
        <h1>Silly Chat</h1>
        <Chat />
      </Glass>
    </main>
  );
}
