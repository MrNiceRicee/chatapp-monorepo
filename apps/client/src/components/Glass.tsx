import { Slot } from '@radix-ui/react-slot';
import React from 'react';

interface GlassProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export function Glass({ asChild, ...props }: GlassProps) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      className="rounded-lg border border-black/50 py-10 bg-blend-screen backdrop-blur-md"
      style={{
        boxShadow: `
            inset 1px 1px 3px -1px hsla(0, 0%, 100%, .8),
            inset -1px -1px 2px -1px hsla(0, 0%, 100%, .6),
            1px 1px 2px -1px hsla(0, 0%, 0%, 1)
          `,
      }}
      {...props}
    />
  );
}
