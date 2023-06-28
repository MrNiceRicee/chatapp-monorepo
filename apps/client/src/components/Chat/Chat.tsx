import { useEffect, useReducer, useRef } from 'react';
import { api, isTRPCClientError, type RouterOutput } from '../../api/trpc';
import { classNames } from '../../util/style';
import { StatusIndication } from '../StatusIndicator';
import { NeonBars } from '../NeonBars';
import { Glow } from '../Glow';

type MessageList = RouterOutput['chat']['listMessage'];

function ErrorMessage({ error }: { error: unknown }) {
  if (!isTRPCClientError(error)) {
    return (
      <section className="mx-auto w-fit text-red-500">
        <p>Unknown error</p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-fit text-red-500">
      <p>{error.message}</p>
    </section>
  );
}

function Message({ messageData }: { messageData: MessageList[number] }) {
  const { color, message, timestamp, username } = messageData;

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(timestamp);

  return (
    <li className="relative flex items-center space-x-2 rounded-md border-2 border-cyan-500 px-2 py-4">
      <NeonBars className="rounded-md border-cyan-100 mix-blend-color-dodge" />
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span
            className="relative font-bold"
            style={{
              color,
            }}
          >
            <Glow className="-z-[1] w-full translate-x-0 opacity-20 blur-md" />
            {username}
          </span>
          <span className="text-gray-400">•</span>
          <span className="relative font-thin text-gray-400">
            <Glow className="-z-[1] w-full translate-x-0 bg-stone-900 opacity-10 blur-md" />
            {formattedDate}
          </span>
        </div>
        <p>{message}</p>
      </div>
    </li>
  );
}

interface WebsocketData {
  error: string | null;
  connected: boolean;
  online: boolean;
}

function ChatList({
  messageData,
  scrollToBottom,
}: {
  messageData: MessageList;
  scrollToBottom: () => void;
}) {
  const apiContext = api.useContext();
  const [model, setModel] = useReducer(
    (prev: WebsocketData, next: Partial<WebsocketData>) => ({
      ...prev,
      ...next,
    }),
    {
      error: null,
      connected: false,
      online: navigator.onLine,
    },
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
      scrollToBottom();
    },
    onError(error) {
      setModel({
        error: error.message,
      });
    },
    onStarted() {
      setModel({
        connected: true,
      });
    },
  });

  useEffect(() => {
    function handleOnline() {
      setModel({
        online: true,
      });
    }

    function handleOffline() {
      setModel({
        online: false,
      });
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div>
      <div className="flex space-x-8 p-4">
        <StatusIndication
          title={model.connected ? 'Connected' : 'Connecting...'}
          container={{
            className: classNames(
              'mr-2 rounded-sm border border-[.4px] lg:w-[6px]',
              !model.connected && 'bg-zinc-800',
            ),
          }}
          glow={{
            className: classNames(!model.connected && 'bg-transparent'),
          }}
        />
        <StatusIndication
          title={model.online ? 'Online' : 'Offline'}
          container={{
            className: classNames(
              'mr-2 rounded-sm border border-[.4px] lg:w-[6px]',
              !model.online && 'bg-red-500',
            ),
          }}
          glow={{
            className: classNames(!model.online && 'bg-red-500'),
          }}
        />
      </div>
      <ul className="space-y-3">
        {messageData.map((message, mIndex) => {
          // return <li key={`${message.timestamp}-${mIndex}`}>yo</li>;
          return (
            <Message
              key={`${message.timestamp}-${mIndex}`}
              messageData={message}
            />
          );
        })}
      </ul>
    </div>
  );
}

export function Chat() {
  const messages = api.chat.listMessage.useQuery(undefined, {
    retry: false,
  });
  // const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (!bottomRef.current) {
      return;
    }
    // if (initial) {
    //   containerRef.current.scrollTop =
    //     bottomRef.current.offsetTop - containerRef.current.offsetTop;

    //   return;
    // }
    // containerRef.current.scrollTo({
    //   top: bottomRef.current.offsetTop - containerRef.current.offsetTop,
    //   behavior: 'smooth',
    // });

    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.data]);

  if (messages.error) {
    return <ErrorMessage error={messages.error} />;
  }

  if (messages.isInitialLoading) {
    return (
      <section className="mx-auto w-fit animate-pulse">
        <p className="text-sm font-light text-zinc-300">Loading...</p>
      </section>
    );
  }

  if (!messages.data) {
    return (
      <section className="mx-auto w-fit">
        <p className="text-sm font-light text-zinc-300">No messages yet</p>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col items-center justify-center">
      <ChatList messageData={messages.data} scrollToBottom={scrollToBottom} />
      <div ref={bottomRef} aria-hidden />
    </section>
  );
}
