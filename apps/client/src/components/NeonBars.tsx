import { classNames } from '../util/style';

export function NeonBars({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <>
      <div
        aria-hidden
        className={classNames(
          'absolute inset-0 h-full w-full border border-sky-200 blur-[1px] duration-200',
          'mix-blend-overlay pointer-events-none select-none',
          className,
        )}
        style={style}
      />
      <div
        aria-hidden
        className={classNames(
          'absolute inset-0 h-full w-full -translate-x-2 scale-[1.01] border border-sky-200 blur-[2px] duration-200',
          'mix-blend-overlay pointer-events-none select-none',
          className,
        )}
        style={style}
      />
      <div
        aria-hidden
        className={classNames(
          'absolute inset-0 h-full w-full -translate-x-2 border border-sky-200 blur-[3px] duration-200',
          'mix-blend-overlay pointer-events-none select-none',
          className,
        )}
        style={style}
      />
      {/* <div
        aria-hidden
        className={classNames(
          'absolute inset-0 h-full w-full -translate-x-2 border-2 border-sky-200 blur-[6px] duration-200',
          'mix-blend-overlay',
          className,
        )}
      />
      <div
        aria-hidden
        className={classNames(
          'absolute inset-0 h-full w-full -translate-x-2 border-4 border-sky-200 blur-[8px] duration-200',
          'mix-blend-overlay',
          className,
        )}
        style={style}
      /> */}
    </>
  );
}
