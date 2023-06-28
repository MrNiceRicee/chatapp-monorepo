import { classNames } from '../util/style';
export function Glow({ className }: { className?: string }) {
  return (
    <div
      className={classNames(
        'absolute inset-0 h-full w-[calc(200%_+_2px)] -translate-x-[calc(50%_-_2px)] bg-sky-50 bg-blend-multiply blur-[4px] duration-200',
        className,
      )}
      aria-hidden
    />
  );
}
