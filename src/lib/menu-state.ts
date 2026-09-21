import { useSyncExternalStore } from "react";

// Tiny shared store so the floating Ask KIH bar can hide while the menu is open.
let open = false;
const listeners = new Set<() => void>();

export function setMenuOpen(value: boolean) {
  if (open === value) return;
  open = value;
  listeners.forEach((l) => l());
}

export function useMenuOpen() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => open,
    () => false,
  );
}
