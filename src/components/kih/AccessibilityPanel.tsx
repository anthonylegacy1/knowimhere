import { Check, Eye, Focus, RotateCcw, Search, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useApp, type TextSize } from "@/lib/app-store";

const TEXT_SIZES: { value: TextSize; label: string }[] = [
  { value: 0, label: "Standard" },
  { value: 1, label: "Large" },
  { value: 2, label: "Extra Large" },
];

export function AccessibilityPanel() {
  const {
    textSize,
    setTextSize,
    accessibilityPreferences,
    setAccessibilityPreference,
    resetAccessibility,
  } = useApp();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          aria-label="Open accessibility settings"
          variant="outline"
          size="icon"
          className="size-11 gap-0 rounded-full bg-cream text-xs font-extrabold"
        >
          <img src={zoomIcon.url} alt="" width={20} height={20} className="size-5 shrink-0" />
          <span aria-hidden>+</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[min(90dvh,46rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-xl bg-card p-5 [&>button]:grid [&>button]:size-11 [&>button]:place-items-center sm:p-7">
        <DialogHeader className="pr-10 text-left">
          <DialogTitle className="font-display text-2xl font-extrabold">Accessibility</DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Make Know I’m Here easier and more comfortable to use.
          </DialogDescription>
        </DialogHeader>

        <fieldset className="mt-1">
          <legend className="flex items-center gap-2 text-lg font-bold"><Type className="size-5 text-brand" /> Text Size</legend>
          <RadioGroup
            value={String(textSize)}
            onValueChange={(value) => setTextSize(Number(value) as TextSize)}
            className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3"
            aria-label="Text size"
          >
            {TEXT_SIZES.map((option) => (
              <label
                key={option.value}
                className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border-2 border-border bg-background px-4 py-3 font-bold has-[[data-state=checked]]:border-brand has-[[data-state=checked]]:bg-secondary"
              >
                <RadioGroupItem value={String(option.value)} className="size-5" />
                {option.label}
              </label>
            ))}
          </RadioGroup>
        </fieldset>

        <div className="grid gap-2" aria-label="Display preferences">
          <PreferenceRow
            id="high-contrast"
            icon={<Eye className="size-5" />}
            title="High Contrast"
            description="Make text, buttons, and cards stand out more."
            checked={accessibilityPreferences.highContrast}
            onCheckedChange={(checked) => setAccessibilityPreference("highContrast", checked)}
          />
          <PreferenceRow
            id="simplified-view"
            icon={<Focus className="size-5" />}
            title="Simplified View"
            description="Reduce decoration and make key actions easier to spot."
            checked={accessibilityPreferences.simplifiedView}
            onCheckedChange={(checked) => setAccessibilityPreference("simplifiedView", checked)}
          />
          <PreferenceRow
            id="reduce-motion"
            icon={<Check className="size-5" />}
            title="Reduce Motion"
            description="Stop automatic slides and unnecessary movement."
            checked={accessibilityPreferences.reduceMotion}
            onCheckedChange={(checked) => setAccessibilityPreference("reduceMotion", checked)}
          />
        </div>

        <DialogFooter className="mt-1 gap-2 border-t border-border pt-4 sm:justify-between sm:space-x-0">
          <Button type="button" variant="outline" className="min-h-12 text-base font-bold" onClick={resetAccessibility}>
            <RotateCcw className="size-5" /> Reset to Default
          </Button>
          <p className="self-center text-center text-sm font-semibold text-muted-foreground sm:text-right">Changes save automatically.</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PreferenceRow({
  id,
  icon,
  title,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex min-h-20 items-center gap-3 rounded-lg border border-border bg-background p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-md bg-aqua-soft text-sky" aria-hidden>{icon}</span>
      <label htmlFor={id} className="min-w-0 flex-1 cursor-pointer">
        <span className="block text-base font-bold text-foreground">{title}</span>
        <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">{description}</span>
      </label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="h-8 w-14 data-[state=checked]:bg-brand [&>span]:size-7 [&>span]:data-[state=checked]:translate-x-6"
        aria-label={title}
      />
    </div>
  );
}