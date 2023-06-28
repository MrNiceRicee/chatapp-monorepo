import { lazy } from 'react';
import { atomWithStorage } from 'jotai/utils';
import { type PrimitiveAtom, useAtom } from 'jotai';
import { Glass } from './components/Glass';
import { Chat } from './components/Chat/Chat';
import { classNames } from './util/style';

export interface ChatState {
  hidden: boolean;
}

export const chatAtom: PrimitiveAtom<{
  hidden: boolean;
}> = atomWithStorage<ChatState>('chat', {
  hidden: false,
});

export type ChatAtom = typeof chatAtom;

const Background = lazy(() =>
  import('./components/Background').then((module) => ({
    default: module.Background,
  })),
);

export default function App() {
  const [{ hidden }, setHide] = useAtom(chatAtom);

  const onToggle = () => {
    setHide((prev) => {
      return {
        hidden: !prev.hidden,
      };
    });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden py-4">
      <Background />
      <Glass
        className={classNames(
          'grain-overlay container mx-auto max-w-2xl px-2 pb-6 pt-2 duration-500 before:opacity-20',
          hidden
            ? 'animate-out fade-out fill-mode-forwards slide-out-to-bottom-10'
            : 'animate-in fade-in fill-mode-forwards slide-in-from-bottom-10',
        )}
      >
        <h1>Silly Chat</h1>
        <Chat />
      </Glass>
      <button
        className={classNames(
          'fixed bottom-0 right-0 m-2 rounded-lg border border-zinc-50/10 p-2 text-zinc-50/70 shadow-sm shadow-stone-800/40 duration-200',
          'hover:bg-zinc-50/10 hover:text-zinc-50/90',
          'focus:outline-none focus:ring-2 focus:ring-zinc-50/50',
        )}
        onClick={onToggle}
      >
        {hidden ? 'Show chat' : 'Hide chat'}
      </button>
    </main>
  );
}
