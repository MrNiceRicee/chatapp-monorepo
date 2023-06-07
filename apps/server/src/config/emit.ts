// emitter class
import { EventEmitter } from 'events';
import { type Message } from '../types/types';

const emitter = new EventEmitter();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericFunction<Args extends any[] = any[], Return = any> = (
  ...args: Args
) => Return;

export interface EventList {
  addPublicMessage: GenericFunction<[Message], void>;
}

// type-safe EventEmitter
const emit = <T extends keyof EventList>(
  event: T,
  ...args: Parameters<EventList[T]>
) => {
  emitter.emit(event, ...args);
};

const on = <T extends keyof EventList, K extends GenericFunction>(
  event: T,
  listener: K,
) => {
  emitter.on(event, listener);
};

const off = <T extends keyof EventList, K extends GenericFunction>(
  event: T,
  listener: K,
) => {
  emitter.off(event, listener);
};

const events = {
  emit,
  on,
  off,
};

export default events;
