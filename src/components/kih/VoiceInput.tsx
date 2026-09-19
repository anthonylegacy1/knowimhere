import { Mic, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Status = "ready" | "listening" | "processing" | "transcript" | "denied" | "error";

interface RecognitionEventLike {
  results: { isFinal: boolean; 0: { transcript: string } }[];
}

interface RecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: RecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

function getRecognitionCtor(): (new () => RecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, new () => RecognitionLike>;
  return w["SpeechRecognition"] ?? w["webkitSpeechRecognition"] ?? null;
}

/**
 * Talk-to-text for Ask KIH. The microphone only turns on when the resident taps
 * it, nothing is recorded or stored, and the transcript is placed in the normal
 * Ask KIH input for review before the resident submits it.
 */
export function VoiceInput({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [supported, setSupported] = useState(true);
  const [status, setStatus] = useState<Status>("ready");
  const [heard, setHeard] = useState("");
  const recRef = useRef<RecognitionLike | null>(null);
  const heardRef = useRef("");
  const failedRef = useRef(false);

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null);
    return () => recRef.current?.stop();
  }, []);

  function start() {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setSupported(false);
      return;
    }
    const rec = new Ctor();
    recRef.current = rec;
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = true;
    let finalText = "";
    rec.onresult = (e) => {
      let text = "";
      for (const r of Array.from(e.results)) text += r[0].transcript;
      heardRef.current = text;
      setHeard(text);
      if (Array.from(e.results).some((r) => r.isFinal)) finalText = text;
    };
    rec.onerror = (e) => {
      failedRef.current = true;
      setStatus(e.error === "not-allowed" || e.error === "service-not-allowed" ? "denied" : "error");
    };
    rec.onend = () => {
      recRef.current = null;
      if (failedRef.current) return;
      const text = (finalText || heardRef.current).trim();
      if (!text) {
        setStatus("error");
        return;
      }
      setHeard(text);
      onTranscript(text);
      setStatus("transcript");
    };
    setHeard("");
    heardRef.current = "";
    failedRef.current = false;
    setStatus("listening");
    rec.start();
  }

  function stop() {
    setStatus("processing");
    recRef.current?.stop();
  }

  if (!supported) {
    return (
      <p className="px-3 pt-2 text-xs text-muted-foreground">
        Voice input isn&apos;t supported in this browser. You can still type your question.
      </p>
    );
  }

  const listening = status === "listening" || status === "processing";

  return (
    <div className="px-1">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => (listening ? stop() : start())}
          aria-label={listening ? "Stop voice input" : "Start voice input"}
          aria-pressed={listening}
          className={`btn-base btn-sm min-h-11 min-w-11 gap-2 ${listening ? "bg-ink text-cream" : "btn-outline"}`}
        >
          {listening ? <Square className="size-4" aria-hidden /> : <Mic className="size-4" aria-hidden />}
          {listening ? "Stop" : "Tap to speak"}
        </button>
        <span aria-live="polite" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {status === "listening"
            ? "Listening… speak now"
            : status === "processing"
              ? "Turning your speech into text…"
              : status === "transcript"
                ? "Transcript ready — review your question"
                : status === "denied"
                  ? "Microphone access is off. You can still type your question."
                  : status === "error"
                    ? "We couldn't hear that clearly. Try again or type your question."
                    : "Tap to speak, or type your question."}
        </span>
      </div>

      {(status === "denied" || status === "error") && (
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" className="btn-base btn-outline btn-sm" onClick={start}>
            Try Again
          </button>
          <button type="button" className="btn-base btn-outline btn-sm" onClick={() => setStatus("ready")}>
            Continue Typing
          </button>
        </div>
      )}

      {heard && (status === "listening" || status === "transcript") && (
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
