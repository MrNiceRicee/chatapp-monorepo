import { classNames } from '../util/style';
import { Glow } from './Glow';

interface StatusIndicationProps {
  container?: {
    className?: string;
  };
  glow?: {
    className?: string;
  };
}

export function StatusIndication(
  props:
    | (StatusIndicationProps & {
        title: string;
        children?: undefined;
      })
    | (StatusIndicationProps & {
        children: React.ReactNode;
        title?: undefined;
      }),
) {
  return (
    <div className="flex items-center">
      <div
        className={classNames(
          'relative h-[14px] w-[3px] bg-zinc-100',
          props.container?.className,
        )}
      >
        {Array.from({ length: 2 }).map((_, i) => (
          <Glow
            key={`glow-${i}`}
            className={classNames(
              'bg-[hsl(186,100%,92%)]',
              props.glow?.className,
            )}
          />
        ))}
      </div>
      {props.title ? (
        <p className="font-light">{props.title}</p>
      ) : (
        props.children
      )}
    </div>
  );
}
