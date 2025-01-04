import { store } from '../store';
import type { Config } from '../types';
import { initStore } from './init';

initStore();
export function config(c: Partial<Config>) {
  store.send({
    type: 'config.update',
    ...c,
  });
}
