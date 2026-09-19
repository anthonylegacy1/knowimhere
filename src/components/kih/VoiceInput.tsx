import { Mic, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Status = "ready" | "starting" | "listening" | "processing" | "transcript" | "denied" | "error" | "slow";

interface RecognitionEventLike {
  results: { isFinal: boolean; 0: { transcript: string } }[];
}

interface RecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort?: () => void;
  onstart: (() => void) | null;
  onaudiostart: (() => void) | null;
  onresult: ((e: RecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

function getRecognitionCtor(): (new () => RecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, new () => RecognitionLike>;
  return w["SpeechRecognition"] ?? w["webkitSpeechRecognition"] ?? null;
}

const STARTUP_TIMEOUT_MS = 3500;

const ERROR_COPY: Record<Status, string> = {
  ready: "Tap to speak, or type your question.",
  starting: "Starting microphone…",
  listening: "Speak now.",
  processing: "Turning speech into text…",
  transcript: "Review your question.",
  denied: "Microphone access is off. You can still type your question.",
  error: "Voice input isn't available right now. You can still type.",
  slow: "Voice input is taking longer than expected.",
};

/**
 * Talk-to-text for Ask KIH. The microphone only turns on when the resident taps
 * it, nothing is recorded or stored, and the transcript is placed in the normal
 * Ask KIH input for review before the resident submits it. Typing always works.
 */
export function VoiceInput({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [supported, setSupported] = useState(true);
  const [status, setStatus] = useState<Status>("ready");
  const [message, setMessage] = useState(ERROR_COPY.ready);
  const [heard, setHeard] = useState("");
  const recRef = useRef<RecognitionLike | null>(null);
  const activeRef = useRef(false);
  const startedRef = useRef(false);
  const failedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const cleanup = useCallback(() => {
    clearTimer();
    const rec = recRef.current;
    recRef.current = null;
    activeRef.current = false;
    if (!rec) return;
    rec.onstart = null;
    rec.onaudiostart = null;
    rec.onresult = null;
    rec.onerror = null;
    rec.onend = null;
    try {
      rec.abort ? rec.abort() : rec.stop();
    } catch {
      /* already stopped */
    }
  }, [clearTimer]);

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null);
    return cleanup;
  }, [cleanup]);

  const set = useCallback((next: Status, text?: string) => {
    setStatus(next);
    setMessage(text ?? ERROR_COPY[next]);
  }, []);

  const start = useCallback(() => {
    if (activeRef.current) return; // single active session — ignore extra taps
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setSupported(false);
      return;
    }

    // Immediate feedback in the same interaction, before permission work begins.
    setHeard("");
    failedRef.current = false;
    startedRef.current = false;
    activeRef.current = true;
    set("starting");

    let rec: RecognitionLike;
    try {
      rec = new Ctor();
    } catch {
      activeRef.current = false;
      set("error");
      return;
    }
    recRef.current = rec;
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;

    const began = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      clearTimer();
      set("listening");
    };
    rec.onstart = began;
    rec.onaudiostart = began;

    let finalText = "";
    rec.onresult = (e) => {
      let text = "";
      for (const r of Array.from(e.results)) text += r[0].transcript;
      finalText = text;
      set("processing");
    };
    rec.onerror = (e) => {
      failedRef.current = true;
      clearTimer();
      if (e.error === "not-allowed" || e.error === "service-not-allowed") set("denied");
      else if (e.error === "no-speech") set("error", "We didn't hear anything. Try again or type your question.");
      else if (e.error === "audio-capture") set("error", "We couldn't access the microphone.");
      else if (e.error === "aborted") set("ready");
      else set("error", "Voice input isn't available right now. You can still type.");
    };
    rec.onend = () => {
      clearTimer();
      recRef.current = null;
      activeRef.current = false;
      if (failedRef.current) return;
      const text = finalText.trim();
      if (!text) {
        set("error", "We didn't hear anything. Try again or type your question.");
        return;
      }
      setHeard(text);
      onTranscript(text);
      set("transcript");
    };

    timerRef.current = setTimeout(() => {
      if (startedRef.current || failedRef.current) return;
      cleanup();
      set("slow");
    }, STARTUP_TIMEOUT_MS);

    try {
      rec.start();
    } catch {
      cleanup();
      set("error");
    }
  }, [cleanup, clearTimer, onTranscript, set]);

  const stop = useCallback(() => {
    if (!activeRef.current) return;
    set("processing");
    try {
      recRef.current?.stop();
    } catch {
      cleanup();
      set("ready");
    }
  }, [cleanup, set]);

  if (!supported) {
    return (
      <p className="px-3 pt-2 text-xs text-muted-foreground">
        Voice input isn&apos;t supported in this browser. You can still type your question.
      </p>
    );
  }

  const busy = status === "starting" || status === "listening" || status === "processing";
  const showFallback = status === "denied" || status === "error" || status === "slow";

  return (
    <div className="px-1">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => (busy ? stop() : start())}
          aria-label={busy ? "Stop voice input" : "Start voice input"}
          aria-pressed={busy}
          className={`btn-base btn-sm min-h-11 min-w-11 gap-2 ${busy ? "bg-ink text-cream" : "btn-outline"}`}
        >
          {busy ? <Square className="size-4" aria-hidden /> : <Mic className="size-4" aria-hidden />}
          {status === "starting" ? "Starting microphone…" : status === "listening" ? "Listening…" : busy ? "Stop" : "Tap to speak"}
        </button>
        <span aria-live="polite" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {message}
        </span>
      </div>

      {showFallback && (
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" className="btn-base btn-outline btn-sm min-h-11" onClick={start}>
            Try Again
          </button>
          <button type="button" className="btn-base btn-outline btn-sm min-h-11" onClick={() => set("ready")}>
            Continue Typing
          </button>
        </div>
      )}

      {heard && status === "transcript" && (
        <p className="mt-2 text-sm">
          <span className="text-xs font-extrabold uppercase tracking-wide text-brand">I heard:</span>{" "}
          <span className="font-semibold">“{heard}”</span>
        </p>
      )}

      <p className="mt-1 text-[11px] text-muted-foreground">
        Voice input is used to turn your spoken question into text. The microphone only turns on when you tap it, and no
        recording is saved.
      </p>
    </div>
  );
}
