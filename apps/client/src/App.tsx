export default function App() {
  return (
    <main className="relative min-h-screen flex justify-center items-center">
      {/* <div
        aria-hidden
        className="absolute -z-10 h-full w-full"
        style={{
          backgroundImage: `
          radial-gradient(
            circle,
            hsl(var(--muted)/50%),
            transparent
          )
          `,
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        }}
      /> */}
      {/* <div
        aria-hidden
        className="absolute -z-10 h-full w-full"
        style={{
          backgroundImage: `
          radial-gradient(
            circle,
            hsl(var(--muted)/50%) 1px,
            transparent 1px
          ),
          radial-gradient(
            circle,
            hsl(var(--muted)/50%) 1px,
            transparent 1px
          )
          `,
          backgroundSize: '5px 5px',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        }}
      /> */}
      {/* <div
        aria-hidden
        className="absolute -z-10 h-full w-full"
        style={{
          '--mask': `linear-gradient(red, transparent)`,
          background: `
            radial-gradient(
              #000,
              transparent)
              0 0/ 1em 1em space
          `,
          WebkitMaskImage: 'var(--mask)',
          mask: 'var(--mask)',
        }}
      /> */}
      <section className="container border mx-auto backdrop-blur-lg py-10 bg-blend-overlay">
        <h1>React App</h1>
      </section>
    </main>
  );
}
