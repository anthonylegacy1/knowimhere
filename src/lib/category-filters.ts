import { useSyncExternalStore } from "react";
import type { CategoryId } from "@/data/resources";

/**
 * ONE category filter state shared by For You Today and the nearby map.
 * Persisted under the existing For You filter key so a resident's selections
 * follow them between the list view and the map view.
 */

const KEY = "kih:for-you:filters:v1";

interface FilterState {
  categories: CategoryId[];
  savedOnly: boolean;
}

let state: FilterState = { categories: [], savedOnly: false };
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<FilterState>;
      state = {
        categories: Array.isArray(parsed.categories) ? parsed.categories : [],
        savedOnly: Boolean(parsed.savedOnly),
      };
    }
  } catch {
    /* unreadable storage — start with no filters */
  }
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — filters simply do not persist */
  }
}

function set(next: FilterState) {
  state = next;
  persist();
  emit();
}

function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const SERVER_SNAPSHOT: FilterState = { categories: [], savedOnly: false };

export function useCategoryFilters() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => {
      load();
      return state;
    },
    () => SERVER_SNAPSHOT,
  );

  return {
    selectedCategories: snapshot.categories,
    savedOnly: snapshot.savedOnly,
    toggleCategory: (c: CategoryId) =>
      set({
        ...state,
        categories: state.categories.includes(c)
          ? state.categories.filter((x) => x !== c)
          : [...state.categories, c],
      }),
    setSavedOnly: (v: boolean) => set({ ...state, savedOnly: v }),
    clearFilters: () => set({ categories: [], savedOnly: false }),
  };
}
