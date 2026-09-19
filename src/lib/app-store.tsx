import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AccessPref, CategoryId, LifeStage, TransportMode } from "@/data/resources";

export interface Profile {
  name: string;
  neighborhood: string;
  ageRange: string;
  /** Multi-select: a resident can be a working adult AND a parent AND a caregiver. */
  lifeStages: LifeStage[];
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
  /** How this check-in was confirmed. Never inferred without resident action. */
  status?: "verified" | "self_reported";
  verificationMethod?: "geolocation" | "resident_confirmation";
  /** Distance in meters at the moment of a verified check-in. No coordinates stored. */
  distanceAtCheckin?: number;
}

export type TextSize = 0 | 1 | 2;

export interface AccessibilityPreferences {
  highContrast: boolean;
  simplifiedView: boolean;
  reduceMotion: boolean;
}

export interface ImHere {
  on: boolean;
  radiusMiles: number;
}

interface AppState {
  profile: Profile;
  saved: string[];
  interested: string[];
  dismissed: string[];
  checkIns: CheckIn[];
  followed: string[];
  textSize: TextSize;
  accessibilityPreferences: AccessibilityPreferences;
  imHere: ImHere;
  hydrated: boolean;
}

interface AppStore extends AppState {
  setImHere: (v: Partial<ImHere>) => void;
  setProfile: (p: Partial<Profile>) => void;
  toggleSaved: (id: string) => void;
  markInterested: (id: string) => void;
  dismiss: (id: string) => void;
  addCheckIn: (c: CheckIn) => void;
  toggleFollow: (org: string) => void;
  cycleTextSize: () => void;
  setTextSize: (size: TextSize) => void;
  setAccessibilityPreference: <K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) => void;
  resetAccessibility: () => void;
  resetAll: () => void;
}

export const EMPTY_PROFILE: Profile = {
  name: "",
  neighborhood: "",
  ageRange: "",
  lifeStages: [],
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
  accessibilityPreferences: { highContrast: false, simplifiedView: false, reduceMotion: false },
  imHere: { on: false, radiusMiles: 3 },
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
        // Older saves stored a single life stage. Carry it into the array.
        const legacy = parsed.profile as (Partial<Profile> & { lifeStage?: LifeStage | "" }) | undefined;
        const profile: Profile = {
          ...EMPTY_PROFILE,
          ...legacy,
          lifeStages:
            legacy?.lifeStages && Array.isArray(legacy.lifeStages)
              ? legacy.lifeStages
              : legacy?.lifeStage
                ? [legacy.lifeStage]
                : [],
        };
        setState({
          ...initialState,
          ...parsed,
          profile,
          accessibilityPreferences: {
            ...initialState.accessibilityPreferences,
            ...parsed.accessibilityPreferences,
          },
          hydrated: true,
        });
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
    root.classList.toggle("high-contrast", state.accessibilityPreferences.highContrast);
    root.classList.toggle("simplified-view", state.accessibilityPreferences.simplifiedView);
    root.classList.toggle("reduce-motion", state.accessibilityPreferences.reduceMotion);
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
  const setTextSize = useCallback((textSize: TextSize) => setState((s) => ({ ...s, textSize })), []);
  const setAccessibilityPreference = useCallback(
    <K extends keyof AccessibilityPreferences,>(key: K, value: AccessibilityPreferences[K]) =>
      setState((s) => ({
        ...s,
        accessibilityPreferences: { ...s.accessibilityPreferences, [key]: value },
      })),
    [],
  );
  const resetAccessibility = useCallback(
    () => setState((s) => ({ ...s, textSize: 0, accessibilityPreferences: initialState.accessibilityPreferences })),
    [],
  );
  const setImHere = useCallback(
    (v: Partial<ImHere>) => setState((s) => ({ ...s, imHere: { ...s.imHere, ...v } })),
    [],
  );
  const resetAll = useCallback(() => setState({ ...initialState, hydrated: true }), []);

  const value = useMemo<AppStore>(
    () => ({
      ...state,
      setImHere,
      setProfile,
      toggleSaved,
      markInterested,
      dismiss,
      addCheckIn,
      toggleFollow,
      cycleTextSize,
      setTextSize,
      setAccessibilityPreference,
      resetAccessibility,
      resetAll,
    }),
    [state, setImHere, setProfile, toggleSaved, markInterested, dismiss, addCheckIn, toggleFollow, cycleTextSize, setTextSize, setAccessibilityPreference, resetAccessibility, resetAll],
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
