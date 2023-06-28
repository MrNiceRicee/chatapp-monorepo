import { useEffect, useState } from 'react';
import { classNames } from '../util/style';

const leftMath = (size: number) =>
  Math.floor(Math.random() * (size * 1.5)) - size * 1.1;
const topMath = (size: number) =>
  Math.floor(Math.random() * (size * 1.5)) - size * 1.1;

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
  const timingRange = [
    // 'duration-1000',
    'duration-2000',
    'duration-3000',
    'duration-5000',
    'duration-7000',
  ];
  const [position, setPosition] = useState({
    // left: Math.floor(Math.random() * (size.width * 1.5)) - size.width * 1.1,
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
        'repeat-infinite opacity-90 direction-alternate-reverse absolute inset-0 -z-10 animate-spin rounded-full from-indigo-500 from-30% to-fuchsia-700 blur-lg transition-all duration-700',
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
