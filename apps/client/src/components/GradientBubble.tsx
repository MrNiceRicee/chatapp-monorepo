import { useEffect, useState } from 'react';
import { classNames } from '../util/style';

const randomMinMax = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const timingRange = [
  'duration-2000',
  'duration-3000',
  'duration-5000',
  'duration-7000',
];

export function GradientBubble({
  className,
  size = {
    height: 500,
    width: 500,
  },
  movementInterval = 30_000,
  resizeInterval = 25_000,
}: {
  className?: string;
  size?: {
    height: number;
    width: number;
  };
  movementInterval?: number;
  resizeInterval?: number;
}) {
  const [model, setModel] = useState({
    // left: randomPosition(),
    // top: randomPosition(),
    left: randomMinMax(-125, 125),
    top: randomMinMax(-125, 125),
    initialSize: {
      height: size.height,
      width: size.width,
    },
    variableSize: {
      height: size.height,
      width: size.width,
    },
  });

  useEffect(() => {
    const changePosition = setInterval(() => {
      setModel((old) => {
        return {
          ...old,
          // left: randomPosition(),
          // top: randomPosition(),
          left: randomMinMax(-125, 125),
          top: randomMinMax(-125, 125),
        };
      });
    }, movementInterval);

    return () => clearInterval(changePosition);
  }, [movementInterval]);

  useEffect(() => {
    const changeSize = setInterval(() => {
      const newScale = randomMinMax(0.9, 1.1);

      setModel((old) => {
        return {
          ...old,
          variableSize: {
            height: old.initialSize.height * newScale,
            width: old.initialSize.width * newScale,
          },
        };
      });
    }, resizeInterval);

    return () => clearInterval(changeSize);
  }, [resizeInterval]);

  return (
    <div
      className={classNames(
        'repeat-infinite direction-alternate-reverse absolute inset-0 -z-10 origin-center animate-spin rounded-full from-indigo-500 from-30% to-fuchsia-700 opacity-90 blur-lg transition-all duration-700',
        timingRange[Math.floor(Math.random() * timingRange.length)],
        className,
      )}
      style={{
        // height: size.height,
        // width: size.width,
        height: model.variableSize.height,
        width: model.variableSize.width,
        left: `${model.left}%`,
        top: `${model.top}%`,
        backgroundImage: 'radial-gradient(circle, var(--tw-gradient-stops))',
      }}
    />
  );
}
