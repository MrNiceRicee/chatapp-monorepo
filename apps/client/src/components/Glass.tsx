import { Slot } from '@radix-ui/react-slot';
import React from 'react';
import { classNames } from '../util/style';

interface GlassProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export function Glass({ asChild, className, ...props }: GlassProps) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      className={classNames(
        'rounded-lg border border-black/50 p-2 bg-blend-screen backdrop-blur-[5px]',
        className,
      )}
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
