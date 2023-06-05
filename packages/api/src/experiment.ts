export function hello(name: string) {
  if (!name) {
    throw new Error('no name provided');
  }

  return `hello ${name}`;
}

export function goodbye(name: string) {
  if (!name) {
    throw new Error('no name provided');
  }

  return `goodbye ${name}`;
}