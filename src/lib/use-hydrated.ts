import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/** Avoids SSR/client mismatch for state that is persisted to localStorage. */
export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
