import { useEffect, useState } from 'react';
import { Glass } from './components/Glass';
import { classNames } from './util/style';

function MovingGradientBubble({
  className,
  size = {
    height: 500,
    width: 500,
  },
}: {
  className?: string;
  size?: {
    height: number;
    width: number;
  };
}) {
  const timingRange = [
    // 'duration-75',
    // 'duration-100',
    // 'duration-150',
    // 'duration-200',
    // 'duration-300',
    // 'duration-500',
    // 'duration-700',
    'duration-1000',
    // 'duration-1500',
    'duration-2000',
    'duration-3000',
    'duration-5000',
    'duration-7000',
  ];
  const [position, setPosition] = useState({
    left: Math.floor(Math.random() * (size.width * 1.5)) - size.width * 1.1,
    top: Math.floor(Math.random() * (size.height * 1.5)) - size.height * 1.1,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        left: Math.floor(Math.random() * (size.width * 1.5)) - size.width * 1.1,
        top:
          Math.floor(Math.random() * (size.height * 1.5)) - size.height * 1.1,
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [size.height, size.width]);

  return (
    <div
      className={classNames(
        'repeat-infinite absolute inset-0 -z-10 animate-spin rounded-full from-indigo-500 from-30% to-fuchsia-700 blur-lg transition-all duration-700',
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

function Background() {
  return (
    <>
      <MovingGradientBubble
        className="from-emerald-500"
        size={{
          height: 1005,
          width: 1000,
        }}
      />
      <MovingGradientBubble
        className="from-rose-500"
        size={{
          height: 1000,
          width: 1005,
        }}
      />
      <MovingGradientBubble
        size={{
          height: 1000,
          width: 995,
        }}
      />
      <MovingGradientBubble
        className="from-amber-500"
        size={{
          height: 800,
          width: 802,
        }}
      />
      <MovingGradientBubble
        className="from-cyan-500"
        size={{
          height: 850,
          width: 853,
        }}
      />
      <MovingGradientBubble
        className="from-pink-500"
        size={{
          height: 750,
          width: 753,
        }}
      />
      <div
        aria-hidden
        className="absolute -z-10 h-full w-full"
        style={{
          backgroundImage:
            'radial-gradient(circle, hsl(var(--muted)/10%), transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        }}
      />
      {/* <div
        aria-hidden
        className="absolute -z-10 h-full w-full"
        style={{
          backgroundImage:
            'radial-gradient(circle, hsla(274, 66%, 32%, .3), hsla(274, 66%, 32%, .1))',
          // WebkitMaskImage:
          // 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        }}
      /> */}
      <div
        aria-hidden
        className="absolute -z-10 h-full w-full"
        style={{
          backgroundImage:
            'radial-gradient(circle, hsl(var(--muted)/50%) 1px, transparent 1px), radial-gradient(circle, hsl(var(--muted)/20%) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Background />
      <Glass asChild>
        <section>
          <div className="flex items-center justify-center">
            <h1>React App</h1>
          </div>
        </section>
      </Glass>
    </main>
  );
}
