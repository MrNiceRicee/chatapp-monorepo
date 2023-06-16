import { type RefObject, useEffect, useReducer, useRef, useState } from 'react';
import { atomWithStorage } from 'jotai/utils';
import { useAtom } from 'jotai';
import { api, RouterOutput } from './api/trpc';
import {
  getContrastColor,
  getContrastSameColor,
  hexToRGB,
  RGBToHSL,
} from './util/color';
import { classNames } from './util/style';

interface UserAtom {
  username: string | null;
  color: string | null;
}

const userAtom = atomWithStorage<UserAtom>('user', {
  username: null,
  color: null,
});

function PostMessage() {
  const apiContext = api.useContext();
  const [users, setUsers] = useState<number>(0);
  const initialUsers =
    api.chat.subscriptionMessageSubscribersCount.useQuery(undefined);
  const [user, setUser] = useAtom(userAtom);
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
    const color = formData.get('usercolor') as string;

    addMessage.mutate({
      message,
      username,
      color,
      timestamp: new Date(Date.now()),
    });

    void apiContext.chat.subscriptionMessageSubscribersCount.invalidate();

    // reset message
    if (messageRef.current) {
      messageRef.current.value = '';
    }
  };

  const onChangeHandler =
    (field: keyof UserAtom) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setUser((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col">
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
      <div className="w-full space-y-4 overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
        <div className="flex space-x-1">
          <fieldset className="flex flex-col justify-end pl-2">
            <label htmlFor="usercolor" className="sr-only">
              User Color
            </label>
            <div className="h-6 w-6 overflow-hidden rounded-full border-2">
              <input
                type="color"
                name="usercolor"
                defaultValue={user.color ?? '#000000'}
                placeholder="User Color (ex: #000000)"
                onBlur={onChangeHandler('color')}
                className="block h-10 w-10 -translate-x-1/2 scale-125 appearance-none border-none bg-transparent outline-none"
              />
            </div>
          </fieldset>
          <fieldset className="flex items-center space-x-2">
            <label htmlFor="message" className="sr-only">
              Username
            </label>
            <input
              type="text"
              name="username"
              defaultValue={user.username ?? ''}
              placeholder="Username (ex: Josh)"
              onChange={onChangeHandler('username')}
              className="block w-full border-0 bg-inherit pt-2.5 text-lg font-medium placeholder:text-gray-400 focus:outline-none focus:ring-0"
            />
          </fieldset>
        </div>
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
            disabled={addMessage.isLoading}
            className="rounded-full border border-teal-500 bg-teal-50 px-4 py-2 text-teal-900 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-teal-950 dark:text-teal-50"
          >
            {addMessage.isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </form>
  );
}

function Avatar({ username, color }: { username: string; color?: string }) {
  const containerColors = hexToRGB(color ?? '#27272A');
  const containerHSL = RGBToHSL(containerColors);

  return (
    <div
      className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full p-[1.5px] text-white shadow-sm shadow-black/40 backdrop-blur-sm dark:bg-zinc-800 lg:h-14 lg:w-14"
      style={{
        backgroundColor: getContrastSameColor(color, 0.9),
        // borderColor: getContrastSameColor(color, 0.5),
      }}
    >
      <div
        className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full backdrop-blur-sm"
        style={{
          backgroundColor: `rgba(${containerColors[0]}, ${containerColors[1]}, ${containerColors[2]}, 0.9)`,
          boxShadow: `
            0.5px .5px 1px 0 hsl(${containerHSL[0]},${color ? '60%' : '0%'},${
            color ? '90%' : '95%'
          },0.3) inset,
            0px -1px 1px 0 hsl(260,0%,0%,0.3) inset,
            0 10px 15px -3px hsl(260,0%,0%,0.3),
            0 4px 6px -2px hsl(260,0%,0%,0.3)
          `,
        }}
      >
        <div
          className="absolute inset-0 -z-10 h-full w-full select-none rounded-full"
          style={{
            // radial-gradient
            background: `
            radial-gradient(
              40% 50% at center 100%,
              hsl(270 0% 72% / 0.05),
              transparent
            ),
            radial-gradient(
              80% 100% at center 120%,
              hsl(260 0% 70% / 0.1),
              transparent
            )
          `,
          }}
          aria-hidden
        />
        <span
          className="bg-transparent text-sm font-bold lg:text-xl"
          style={{
            color: getContrastSameColor(color),
          }}
        >
          {username.slice(0, 2)}
        </span>
      </div>
    </div>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

function Card({ children, color, className }: CardProps) {
  const containerColors = hexToRGB(color ?? '#27272A');
  const containerHSL = RGBToHSL(containerColors);

  return (
    <div
      className={classNames(
        'relative flex items-center justify-center overflow-hidden rounded-sm backdrop-blur-sm',
        className,
      )}
      style={{
        backgroundColor: `rgba(${containerColors[0]}, ${containerColors[1]}, ${containerColors[2]}, 0.9)`,
        boxShadow: `
            0.5px .5px 1px 0 hsl(${containerHSL[0]},${color ? '60%' : '0%'},${
          color ? '90%' : '95%'
        },0.3) inset,
            0px -1px 1px 0 hsl(260,0%,0%,0.3) inset,
            0 10px 15px -3px hsl(260,0%,0%,0.3),
            0 4px 6px -2px hsl(260,0%,0%,0.3)
          `,
      }}
    >
      {/* <div
        className="absolute inset-0 -z-10 h-full w-full select-none"
        style={{
          // radial-gradient
          background: `
            radial-gradient(
              40% 50% at center 100%,
              hsl(270 0% 72% / 0.05),
              transparent
            ),
            radial-gradient(
              80% 100% at center 120%,
              hsl(260 0% 70% / 0.1),
              transparent
            )
          `,
        }}
        aria-hidden
      /> */}
      {children}
    </div>
  );
}

type MessageList = RouterOutput['chat']['listMessage'];

function DisplayMessage({ messageData }: { messageData: MessageList[number] }) {
  const { message, username, timestamp, color } = messageData;

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(timestamp);

  return (
    <li className="flex items-center space-x-2">
      <Avatar username={username} color={color} />
      <div className="flex flex-grow flex-col">
        <div className="flex justify-between text-sm">
          <span>{username}</span>
          <span>{formattedDate}</span>
        </div>
        <Card color={color} className="rounded-md px-2 py-1">
          <p
            className="w-full text-left text-sm lg:text-xl"
            style={{
              color: getContrastColor(color),
            }}
          >
            {message}
          </p>
        </Card>
      </div>
    </li>
  );
}

interface WebsocketData {
  // data: MessageList;
  error: string | null;
  connected: boolean;
}

function ChatList({
  messages,
  scrollRef,
}: {
  messages: MessageList;
  scrollRef: RefObject<HTMLDivElement>;
}) {
  const apiContext = api.useContext();
  const [model, setModel] = useReducer(
    (prev: WebsocketData, next: Partial<WebsocketData>) => ({
      ...prev,
      ...next,
    }),
    { error: null, connected: false },
  );

  api.chat.subscriptionMessages.useSubscription(undefined, {
    onData(data) {
      apiContext.chat.listMessage.setData(undefined, (oldData) => {
        if (!oldData) {
          return data;
        }
        const newMessageList = [...oldData, ...data];

        // sort by timestamp
        newMessageList.sort((a, b) => {
          return a.timestamp - b.timestamp;
        });

        return newMessageList;
      });
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      <ul className="space-y-1">
        {messages.map((item, index) => (
          <DisplayMessage key={index} messageData={item} />
        ))}
      </ul>
      {messages.length === 0 && <p className="text-lg">No messages yet</p>}
    </div>
  );
}

function Chat() {
  const messages = api.chat.listMessage.useQuery();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    <section className="mx-auto max-w-sm space-y-2 px-2 lg:max-w-xl">
      <ChatList messages={messages.data} scrollRef={bottomRef} />
      <PostMessage />
      <div ref={bottomRef} />
    </section>
  );
}

function App() {
  return (
    <main className="relative pb-2">
      <div
        className="absolute inset-0 -z-10 h-full w-full bg-stone-50 dark:bg-stone-800"
        aria-hidden
      />
      <header className="sticky">
        <h1 className="text-center text-4xl">Idk some chat app</h1>
      </header>
      <Chat />
    </main>
  );
}

export default App;
