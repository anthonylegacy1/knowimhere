import { PhoneCall } from "lucide-react";

export function EmergencyNotice() {
  return (
    <div role="alert" className="rounded-3xl border-4 border-destructive bg-card p-6 text-center">
      <PhoneCall className="mx-auto size-10 text-destructive" aria-hidden />
      <p className="mt-3 font-display text-3xl font-bold">For emergencies, call 911.</p>
      <p className="mt-2 text-lg text-foreground/70">Know I&apos;m Here is not an emergency-response platform.</p>
      <a href="tel:911" className="btn-base mt-5 bg-destructive text-destructive-foreground">
        Call 911
      </a>
    </div>
  );
}
