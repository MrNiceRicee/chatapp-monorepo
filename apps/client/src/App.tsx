export default function App() {
  return (
    <main className="relative flex min-h-screen items-center justify-center">
      <div
        aria-hidden
        className="absolute -z-10 h-full w-full"
        style={{
          backgroundImage: `
          radial-gradient(
            circle,
            hsl(var(--muted)/10%),
            transparent
          )
          `,
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        }}
      />
      <div
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
            hsl(var(--muted)/20%) 1px,
            transparent 1px
          )
          `,
          backgroundSize: '30px 30px',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        }}
      />
      {/* <div
        aria-hidden
        className="absolute -z-10 h-full w-full"
        style={{
          '--mask': `linear-gradient(30deg, red, transparent)`,
          background: `
            radial-gradient(
              #000,
              transparent)
              0 0/ 2em 2em space
          `,
          WebkitMaskImage: 'var(--mask)',
          mask: 'var(--mask)',
        }}
      /> */}
      <section
        className="container mx-auto rounded-md border border-black/50 py-10 bg-blend-screen shadow-white backdrop-blur-sm"
        style={{
          // inset
          boxShadow: `
            inset 1px 1px 3px -2px hsla(0, 0%, 100%, 0.5),
            inset -1px -1px 3px -2px hsla(0, 0%, 100%, 0.5),
            1px 1px 2px -1px hsla(0, 0%, 0%, .8)
          `,
        }}
      >
        <div className="flex items-center justify-center">
          <h1>React App</h1>
        </div>
      </section>
    </main>
  );
}
