import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AccessPref, CategoryId, TransportMode } from "@/data/resources";

export interface Profile {
  name: string;
  neighborhood: string;
  ageRange: string;
  interests: CategoryId[];
  transportation: TransportMode[];
  accessibility: AccessPref[];
  lowCost: boolean;
  onboarded: boolean;
  isDemo?: boolean;
}

export interface CheckIn {
  resourceId: string;
  resourceName: string;
  category: CategoryId;
  neighborhood: string;
  date: string;
  sharing: "private" | "family" | "caregiver";
}

export type TextSize = 0 | 1 | 2;

interface AppState {
  profile: Profile;
  saved: string[];
  interested: string[];
  dismissed: string[];
  checkIns: CheckIn[];
  followed: string[];
  textSize: TextSize;
  hydrated: boolean;
}

interface AppStore extends AppState {
  setProfile: (p: Partial<Profile>) => void;
  toggleSaved: (id: string) => void;
  markInterested: (id: string) => void;
  dismiss: (id: string) => void;
  addCheckIn: (c: CheckIn) => void;
  toggleFollow: (org: string) => void;
  cycleTextSize: () => void;
  resetAll: () => void;
}

export const EMPTY_PROFILE: Profile = {
  name: "",
  neighborhood: "",
  ageRange: "",
  interests: [],
  transportation: [],
  accessibility: [],
  lowCost: true,
  onboarded: false,
};

const initialState: AppState = {
  profile: EMPTY_PROFILE,
  saved: [],
  interested: [],
  dismissed: [],
  checkIns: [],
  followed: [],
  textSize: 0,
  hydrated: false,
};

const KEY = "kih:v1";
const Ctx = createContext<AppStore | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AppState>;
        setState({ ...initialState, ...parsed, hydrated: true });
      } else {
        setState((s) => ({ ...s, hydrated: true }));
      }
    } catch {
      setState((s) => ({ ...s, hydrated: true }));
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const { hydrated: _h, ...persist } = state;
    void _h;
    window.localStorage.setItem(KEY, JSON.stringify(persist));
    const root = document.documentElement;
    root.classList.toggle("text-plus", state.textSize === 1);
    root.classList.toggle("text-plus-plus", state.textSize === 2);
  }, [state]);

  const setProfile = useCallback(
    (p: Partial<Profile>) => setState((s) => ({ ...s, profile: { ...s.profile, ...p } })),
    [],
  );
  const toggleSaved = useCallback(
    (id: string) =>
      setState((s) => ({
        ...s,
        saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id],
      })),
    [],
  );
  const markInterested = useCallback(
    (id: string) =>
      setState((s) => ({ ...s, interested: s.interested.includes(id) ? s.interested : [...s.interested, id] })),
    [],
  );
  const dismiss = useCallback(
    (id: string) => setState((s) => ({ ...s, dismissed: [...s.dismissed.filter((x) => x !== id), id] })),
    [],
  );
  const addCheckIn = useCallback((c: CheckIn) => setState((s) => ({ ...s, checkIns: [c, ...s.checkIns] })), []);
  const toggleFollow = useCallback(
    (org: string) =>
      setState((s) => ({
        ...s,
        followed: s.followed.includes(org) ? s.followed.filter((x) => x !== org) : [...s.followed, org],
      })),
    [],
  );
  const cycleTextSize = useCallback(
    () => setState((s) => ({ ...s, textSize: ((s.textSize + 1) % 3) as TextSize })),
    [],
  );
  const resetAll = useCallback(() => setState({ ...initialState, hydrated: true }), []);

  const value = useMemo<AppStore>(
    () => ({
      ...state,
      setProfile,
      toggleSaved,
      markInterested,
      dismiss,
      addCheckIn,
      toggleFollow,
      cycleTextSize,
      resetAll,
    }),
    [state, setProfile, toggleSaved, markInterested, dismiss, addCheckIn, toggleFollow, cycleTextSize, resetAll],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function greeting(name?: string) {
  const h = new Date().getHours();
  const part = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return name ? `${part}, ${name}.` : `${part}.`;
}
