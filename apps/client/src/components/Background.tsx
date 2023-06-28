import { GradientBubble } from './GradientBubble';

const colors = [
  'from-rose-500',
  'from-amber-500',
  'from-emerald-500',
  'from-pink-500',
  'from-fuchsia-500',
  'from-indigo-500',
  'from-violet-500',
  'from-purple-500',
  'from-blue-500',
  'from-sky-500',
  'from-lime-500 to-sky-500',
  'from-green-500 to-cyan-500',
  'from-teal-500',
  'from-cyan-500',
  'from-orange-500',
  'from-yellow-500',
  'from-[hsl(0,80%,50%)] to-[hsl(300,70%,50%)]',
];

function GradientBubbleFactory() {
  return (
    <>
      {colors.map((color, index) => {
        const size = Math.floor(Math.random() * 1000) + 500;

        return (
          <GradientBubble
            key={`${color}-${index}`}
            className={color}
            size={{
              height: size,
              width: size * 1.005,
            }}
            movementInterval={Math.floor(Math.random() * 30_000) + 8_000}
            resizeInterval={Math.floor(Math.random() * 25_000) + 10_000}
          />
        );
      })}
    </>
  );
}

export function Background() {
  return (
    <>
      <GradientBubbleFactory />
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
