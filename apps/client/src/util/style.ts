import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const classNames = (...classes: ClassValue[]): string => {
  return twMerge(clsx(classes));
};
