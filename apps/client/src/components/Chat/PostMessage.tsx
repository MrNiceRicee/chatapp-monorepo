import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { atomWithStorage } from 'jotai/utils';
import { api } from '../../api/trpc';

interface UserAtom {
  username: string | null;
  color: string | null;
}

const userAtom = atomWithStorage<UserAtom>('user', {
  username: null,
  color: null,
});

export function PostMessage() {
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
    <form onSubmit={onSubmit} className="flex w-full flex-col mt-4">
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
            <label htmlFor="username" className="sr-only">
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
