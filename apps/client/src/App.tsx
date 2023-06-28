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
    <main className="grain-overlay py-4 before:opacity-50 relative flex items-center justify-center">
      <Background />
      <Glass className="grain-overlay before:opacity-20 container mx-auto flex max-w-2xl flex-col items-center justify-center px-2 pb-6 pt-2">
        <h1>Silly Chat</h1>
        <Chat />
      </Glass>
    </main>
  );
}
