import { useEffect, useState } from 'react';
import { classNames } from '../util/style';

const leftMath = (size: number) =>
  Math.floor(Math.random() * (size * 1.5)) - size * 1.1;
const topMath = (size: number) =>
  Math.floor(Math.random() * (size * 1.5)) - size * 1.1;

const timingRange = [
  'duration-2001',
  'duration-3001',
  'duration-5001',
  'duration-7001',
];

export function GradientBubble({
  className,
  size = {
    height: 500,
    width: 500,
  },
  movementInterval = 30_000,
}: {
  className?: string;
  size?: {
    height: number;
    width: number;
  };
  movementInterval?: number;
}) {
  const [position, setPosition] = useState({
    left: leftMath(size.width),
    top: topMath(size.height),
  });

  useEffect(() => {
    const changePosition = setInterval(() => {
      setPosition({
        left: leftMath(size.width),
        top: topMath(size.height),
      });
    }, movementInterval);

    return () => clearInterval(changePosition);
  }, [size.height, size.width]);

  return (
    <div
      className={classNames(
        'repeat-infinite direction-alternate-reverse absolute inset-0 -z-10 animate-spin rounded-full from-indigo-500 from-30% to-fuchsia-700 opacity-90 blur-lg transition-all duration-700',
        timingRange[Math.floor(Math.random() * timingRange.length)],
        className,
      )}
      style={{
        height: size.height,
        width: size.width,
        left: position.left,
        top: position.top,
        backgroundImage: 'radial-gradient(circle, var(--tw-gradient-stops))',
      }}
    />
  );
}
