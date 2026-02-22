import { useSyncExternalStore } from 'react';

export const create = (createState) => {
  let state;
  const listeners = new Set();

  const setState = (partial, replace = false) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial;
    const computed = replace ? nextState : { ...state, ...nextState };
    if (Object.is(computed, state)) return;
    state = computed;
    listeners.forEach((listener) => listener());
  };

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const api = {
    setState,
    getState,
    subscribe,
    destroy: () => listeners.clear(),
  };

  state = createState(setState, getState, api);

  const useStore = (selector = (s) => s) =>
    useSyncExternalStore(subscribe, () => selector(state), () => selector(state));

  Object.assign(useStore, api);
  return useStore;
};
