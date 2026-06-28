import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUp,
  RotateCcw,
  Ruler,
  Activity,
  User,
  Users,
  Sparkles,
  Moon,
  Dumbbell,
  Apple,
  Globe2,
  Footprints,
  HeartPulse,
  Baby,
  Cigarette,
  Pill,
  Languages,
} from "lucide-react";
import { DICTS, LANG_LABELS, type Dict, type Lang } from "@/lib/i18n";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GrowScope — How Tall Will You Be?" },
      {
        name: "description",
        content:
          "Answer questions about your age, height, parents, body measurements, growth, and lifestyle to get a personalized estimate of your adult height.",
      },
      { property: "og:title", content: "GrowScope — How Tall Will You Be?" },
      {
        property: "og:description",
        content:
          "Answer questions about your age, height, parents, body measurements, growth, and lifestyle to get a personalized estimate of your adult height.",
      },
    ],
  }),
  component: Index,
});

type Unit = "cm" | "ft";
type Gender = "boy" | "girl";
type ShoeSystem = "eu" | "uk" | "us-men" | "us-women";
type Ethnicity =
  | "european"
  | "east-asian"
  | "south-asian"
  | "south-east-asian"
  | "african"
  | "middle-eastern"
  | "latin-american"
  | "mixed-other"
  | "unknown";
type Sleep = "<7" | "7-8" | "8-9" | "9+" | "unknown";
type Exercise = "none" | "light" | "moderate" | "very" | "unknown";
type Nutrition = "needs-work" | "okay" | "balanced" | "very-healthy" | "unknown";
type StillGrowing = "yes" | "no" | "unknown";
type GrowthSpurt = "not-yet" | "now" | "done" | "unknown";
type YesNoUnknown = "yes" | "no" | "unknown";

const UNKNOWN = "unknown" as const;

interface FormState {
  unit: Unit;
  // Highly informative
  age: string;
  gender: Gender;
  ethnicity: Ethnicity;
  momHeight: string; // raw in current unit (cm or inches-total for ft we use ft.in split? Keep simple: cm or inches total)
  dadHeight: string;
  // Body measurements (optional)
  currentHeight: string;
  weightKg: string;
  sittingHeight: string;
  legLength: string;
  inseam: string;
  armSpan: string;
  shoulderWidth: string;
  handLength: string;
  shoeSize: string;
  shoeSystem: ShoeSystem;
  headCircumference: string;
  // Development
  spurtAge: string;
  stillGrowing: StillGrowing;
  yearlyGrowth: string;
  growthSpurt: GrowthSpurt;
  // Lifestyle
  sleep: Sleep;
  exercise: Exercise;
  nutrition: Nutrition;
  chronicIllness: YesNoUnknown;
  preterm: YesNoUnknown;
  smokingPregnancy: YesNoUnknown;
  hormoneTreatment: YesNoUnknown;
}

const initialForm: FormState = {
  unit: "cm",
  age: "",
  gender: "boy",
  ethnicity: "unknown",
  momHeight: "",
  dadHeight: "",
  currentHeight: "",
  weightKg: "",
  sittingHeight: "",
  legLength: "",
  inseam: "",
  armSpan: "",
  shoulderWidth: "",
  handLength: "",
  shoeSize: "",
  shoeSystem: "eu",
  headCircumference: "",
  spurtAge: "",
  stillGrowing: "unknown",
  yearlyGrowth: "",
  growthSpurt: "unknown",
  sleep: "unknown",
  exercise: "unknown",
  nutrition: "unknown",
  chronicIllness: "unknown",
  preterm: "unknown",
  smokingPregnancy: "unknown",
  hormoneTreatment: "unknown",
};

// Convert a user-typed length in the chosen unit to centimeters
function toCm(value: string, unit: Unit): number {
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return unit === "cm" ? n : n * 2.54; // ft mode: inputs are inches
}

function cmToInches(cm: number): number {
  return Math.round((cm / 2.54) * 10) / 10;
}

function formatHeight(cm: number, unit: Unit): string {
  if (unit === "cm") return `${Math.round(cm)} cm`;
  const totalIn = cm / 2.54;
  const ft = Math.floor(totalIn / 12);
  const inches = Math.round((totalIn - ft * 12) * 10) / 10;
  return `${ft} ft ${inches} in`;
}

function shoeSizeToFootCm(size: string, system: ShoeSystem): number {
  const n = Number.parseFloat(size);
  if (!Number.isFinite(n) || n <= 0) return 0;
  let eu = n;
  if (system === "uk") eu = n + 33;
  else if (system === "us-men") eu = n + 32;
  else if (system === "us-women") eu = n + 31;
  return (eu * 2) / 3 - 1;
}


function ethnicityAdjust(eth: Ethnicity, _gender: Gender): number {
  switch (eth) {
    case "european":
      return 1;
    case "east-asian":
      return -1;
    case "south-asian":
      return -2;
    case "south-east-asian":
      return -2.5;
    case "african":
      return 0;
    case "middle-eastern":
      return 0;
    case "latin-american":
      return -1;
    case "mixed-other":
    case "unknown":
    default:
      return 0;
  }
}

function lifestyleAdjustment(
  sleep: Sleep,
  exercise: Exercise,
  nutrition: Nutrition,
  chronic: YesNoUnknown,
  preterm: YesNoUnknown,
  smoking: YesNoUnknown,
  hormones: YesNoUnknown,
): number {
  let adj = 0;
  if (sleep === "<7") adj -= 0.75;
  if (sleep === "8-9" || sleep === "9+") adj += 0.5;

  if (exercise === "none") adj -= 0.5;
  if (exercise === "moderate") adj += 0.5;
  if (exercise === "very") adj += 0.75;

  if (nutrition === "needs-work") adj -= 0.75;
  if (nutrition === "balanced") adj += 0.5;
  if (nutrition === "very-healthy") adj += 0.75;

  if (chronic === "yes") adj -= 1.5;
  if (preterm === "yes") adj -= 0.5;
  if (smoking === "yes") adj -= 1;
  if (hormones === "yes") adj += 0.5; // assume beneficial if prescribed

  return Math.max(-4, Math.min(3, adj));
}

interface Estimate {
  estimate: number;
  min: number;
  max: number;
}

function estimateAdultHeight(form: FormState): {
  result: Estimate | null;
  error: "age" | "height" | null;
} {
  const age = Number.parseFloat(form.age);
  if (!Number.isFinite(age) || age < 2 || age > 25) {
    return { result: null, error: "age" };
  }

  const unit = form.unit;
  const currentCm = toCm(form.currentHeight, unit);
  const momCm = toCm(form.momHeight, unit);
  const dadCm = toCm(form.dadHeight, unit);

  if (currentCm <= 30) {
    return { result: null, error: "height" };
  }


  // Mid-parental height — fall back to population averages when unknown
  const gender = form.gender;
  const momEffective = momCm > 0 ? momCm : 165; // population avg
  const dadEffective = dadCm > 0 ? dadCm : 178;
  const sexAdjust = gender === "boy" ? 13 : gender === "girl" ? -13 : 0;
  const geneticTarget = (momEffective + dadEffective + sexAdjust) / 2;

  // Growth projection
  const stopAge = gender === "boy" ? 18 : gender === "girl" ? 16 : 17;
  const stillGrowing = form.stillGrowing;
  let yearsRemaining = Math.max(0, stopAge - age);
  if (stillGrowing === "no") yearsRemaining = 0;
  if (form.growthSpurt === "done") yearsRemaining = Math.min(yearsRemaining, 1.5);

  const yearlyCm = toCm(form.yearlyGrowth, unit);
  const effectiveGrowth = yearlyCm > 0 ? yearlyCm : Math.max(4, 12 - age * 0.5);

  let projected = 0;
  let g = effectiveGrowth;
  for (let i = 0; i < yearsRemaining; i++) {
    projected += g;
    g *= 0.65;
  }
  // If user is mid-growth-spurt, give a small bump
  if (form.growthSpurt === "now") projected += 2;

  const growthProjection = currentCm + projected;

  // Optional body-measurement hints
  const armSpanCm = toCm(form.armSpan, unit);
  const footLenCm = shoeSizeToFootCm(form.shoeSize, form.shoeSystem);
  const measurementEstimates: number[] = [];
  if (armSpanCm > 80) {
    // Arm span ≈ adult height
    measurementEstimates.push(armSpanCm);
  }
  if (footLenCm > 10) {
    // Foot length ~15% of adult height
    measurementEstimates.push(footLenCm / 0.152);
  }

  // Blend genetics & growth trajectory
  let geneticWeight = 0.7;
  if (age >= 15) geneticWeight = 0.25;
  else if (age >= 13) geneticWeight = 0.45;
  else if (age >= 11) geneticWeight = 0.6;
  else if (age >= 8) geneticWeight = 0.65;
  if (momCm <= 0 && dadCm <= 0) geneticWeight = Math.min(geneticWeight, 0.2);

  let base = geneticWeight * geneticTarget + (1 - geneticWeight) * growthProjection;

  if (measurementEstimates.length > 0) {
    const avgMeas = measurementEstimates.reduce((a, b) => a + b, 0) / measurementEstimates.length;
    base = base * 0.85 + avgMeas * 0.15;
  }

  base += ethnicityAdjust(form.ethnicity, gender);
  base += lifestyleAdjustment(
    form.sleep,
    form.exercise,
    form.nutrition,
    form.chronicIllness,
    form.preterm,
    form.smokingPregnancy,
    form.hormoneTreatment,
  );

  // Uncertainty grows when key data is missing
  let range = yearlyCm > 0 ? 6.5 : 8.5;
  range += Math.max(0, 16 - age) * 0.35;
  if (momCm <= 0) range += 2;
  if (dadCm <= 0) range += 2;
  

  return {
    result: { estimate: base, min: base - range, max: base + range },
    error: null,
  };
}

function Index() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [result, setResult] = useState<Estimate | null>(null);
  const [errorKey, setErrorKey] = useState<"age" | "height" | null>(null);
  const [lang, setLang] = useState<Lang>("en");
  const t: Dict = DICTS[lang];

  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {

    setForm((prev) => {
      // When switching units, convert numeric height-like fields
      if (key === "unit" && value !== prev.unit) {
        const newUnit = value as Unit;
        const convert = (v: string) => {
          const n = Number.parseFloat(v);
          if (!Number.isFinite(n) || n <= 0) return "";
          return newUnit === "ft"
            ? String(cmToInches(n)) // cm → inches
            : String(Math.round(n * 2.54)); // inches → cm
        };
        return {
          ...prev,
          unit: newUnit,
          momHeight: convert(prev.momHeight),
          dadHeight: convert(prev.dadHeight),
          currentHeight: convert(prev.currentHeight),
          sittingHeight: convert(prev.sittingHeight),
          legLength: convert(prev.legLength),
          inseam: convert(prev.inseam),
          armSpan: convert(prev.armSpan),
          shoulderWidth: convert(prev.shoulderWidth),
          handLength: convert(prev.handLength),
          
          headCircumference: convert(prev.headCircumference),
          yearlyGrowth: convert(prev.yearlyGrowth),
        };
      }
      return { ...prev, [key]: value };
    });
    setErrorKey(null);
  }, []);

  const lenUnit = form.unit === "cm" ? t.unit_cm : "in";

  const handleCalculate = () => {
    const { result: r, error: e } = estimateAdultHeight(form);
    setResult(r);
    setErrorKey(e);
  };

  const handleReset = () => {
    setForm(initialForm);
    setResult(null);
    setErrorKey(null);
  };


  return (
    <main className="min-h-screen bg-background px-4 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl">
        {/* Language switcher */}
        <div className="mb-6 flex items-center justify-end gap-2">
          <Languages className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">{t.language}</span>
          {(Object.keys(LANG_LABELS) as Lang[]).map((code) => (
            <Button
              key={code}
              type="button"
              size="sm"
              variant={lang === code ? "default" : "outline"}
              onClick={() => setLang(code)}
              aria-label={code}
              className="h-8 px-2.5 text-xs"
            >
              {LANG_LABELS[code]}
            </Button>
          ))}
        </div>

        {/* Hero */}
        <div className="mb-10 text-center sm:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t.h1_part1}
            <span className="text-primary">{t.h1_tall}</span>
            {t.h1_part2}
            <span className="text-primary">{t.h1_grow}</span>
            {t.h1_q}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            {t.intro}
          </p>
        </div>

        {/* Form */}
        <Card className="overflow-hidden border border-border bg-card shadow-xl">
          <CardHeader className="bg-secondary/30 pb-6">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-card-foreground sm:text-2xl">
              <Ruler className="h-5 w-5 text-primary" />
              {t.card_title}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t.card_desc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            {/* Unit toggle */}
            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 p-3">
              <span className="text-sm font-medium text-secondary-foreground">
                {t.unit_label}
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={form.unit === "cm" ? "default" : "outline"}
                  size="sm"
                  onClick={() => update("unit", "cm")}
                >
                  {t.unit_cm}
                </Button>
                <Button
                  type="button"
                  variant={form.unit === "ft" ? "default" : "outline"}
                  size="sm"
                  onClick={() => update("unit", "ft")}
                >
                  {t.unit_in}
                </Button>
              </div>
            </div>

            {/* Section 1 — Most important */}
            <Section title={t.sec1_title} subtitle={t.sec1_sub}>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label={t.age} icon={<Activity className="h-4 w-4 text-primary" />}>
                  <NumberWithSuffix
                    value={form.age}
                    onChange={(v) => update("age", v)}
                    suffix={t.yrs}
                    placeholder={t.age_ph}
                    min={2}
                    max={25}
                  />
                </Field>

                <Field label={t.gender} icon={<User className="h-4 w-4 text-primary" />}>
                  <SelectField
                    value={form.gender}
                    onChange={(v) => update("gender", v as Gender)}
                    options={[
                      { value: "boy", label: t.male },
                      { value: "girl", label: t.female },
                    ]}
                  />
                </Field>

                <Field
                  label={t.ethnicity}
                  icon={<Globe2 className="h-4 w-4 text-primary" />}
                >
                  <SelectField
                    value={form.ethnicity}
                    onChange={(v) => update("ethnicity", v as Ethnicity)}
                    options={[
                      { value: "european", label: t.eth_european },
                      { value: "east-asian", label: t.eth_east_asian },
                      { value: "south-asian", label: t.eth_south_asian },
                      { value: "south-east-asian", label: t.eth_se_asian },
                      { value: "african", label: t.eth_african },
                      { value: "middle-eastern", label: t.eth_middle_eastern },
                      { value: "latin-american", label: t.eth_latin },
                      { value: "mixed-other", label: t.eth_mixed },
                      { value: UNKNOWN, label: t.dont_know },
                    ]}
                  />
                </Field>

                <Field
                  label={t.current_height}
                  icon={<Ruler className="h-4 w-4 text-primary" />}
                >
                  <NumberWithSuffix
                    value={form.currentHeight}
                    onChange={(v) => update("currentHeight", v)}
                    suffix={lenUnit}
                    placeholder={form.unit === "cm" ? "150" : "59"}
                  />
                </Field>

                <Field
                  label={t.mom_height}
                  icon={<Users className="h-4 w-4 text-primary" />}
                  hint={t.leave_blank}
                >
                  <NumberWithSuffix
                    value={form.momHeight}
                    onChange={(v) => update("momHeight", v)}
                    suffix={lenUnit}
                    placeholder={form.unit === "cm" ? "165" : "65"}
                  />
                </Field>

                <Field
                  label={t.dad_height}
                  icon={<Users className="h-4 w-4 text-primary" />}
                  hint={t.leave_blank}
                >
                  <NumberWithSuffix
                    value={form.dadHeight}
                    onChange={(v) => update("dadHeight", v)}
                    suffix={lenUnit}
                    placeholder={form.unit === "cm" ? "180" : "71"}
                  />
                </Field>
              </div>
            </Section>

            {/* Section 2 — Body measurements */}
            <Section title={t.sec2_title} subtitle={t.sec2_sub}>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Field label={t.weight} icon={<Activity className="h-4 w-4 text-primary" />}>
                  <NumberWithSuffix
                    value={form.weightKg}
                    onChange={(v) => update("weightKg", v)}
                    suffix={form.unit === "cm" ? "kg" : "lb"}
                    placeholder={t.optional}
                  />
                </Field>
                <Field label={t.sitting_height} icon={<Ruler className="h-4 w-4 text-primary" />}>
                  <NumberWithSuffix
                    value={form.sittingHeight}
                    onChange={(v) => update("sittingHeight", v)}
                    suffix={lenUnit}
                    placeholder={t.optional}
                  />
                </Field>
                <Field label={t.leg_length} icon={<Ruler className="h-4 w-4 text-primary" />}>
                  <NumberWithSuffix
                    value={form.legLength}
                    onChange={(v) => update("legLength", v)}
                    suffix={lenUnit}
                    placeholder={t.optional}
                  />
                </Field>
                <Field label={t.inseam} icon={<Ruler className="h-4 w-4 text-primary" />}>
                  <NumberWithSuffix
                    value={form.inseam}
                    onChange={(v) => update("inseam", v)}
                    suffix={lenUnit}
                    placeholder={t.optional}
                  />
                </Field>
                <Field
                  label={t.arm_span}
                  icon={<Ruler className="h-4 w-4 text-primary" />}
                  hint={t.arm_span_hint}
                >
                  <NumberWithSuffix
                    value={form.armSpan}
                    onChange={(v) => update("armSpan", v)}
                    suffix={lenUnit}
                    placeholder={t.optional}
                  />
                </Field>
                <Field label={t.shoulder} icon={<Ruler className="h-4 w-4 text-primary" />}>
                  <NumberWithSuffix
                    value={form.shoulderWidth}
                    onChange={(v) => update("shoulderWidth", v)}
                    suffix={lenUnit}
                    placeholder={t.optional}
                  />
                </Field>
                <Field label={t.hand_length} icon={<Ruler className="h-4 w-4 text-primary" />}>
                  <NumberWithSuffix
                    value={form.handLength}
                    onChange={(v) => update("handLength", v)}
                    suffix={lenUnit}
                    placeholder={t.optional}
                  />
                </Field>
                <Field
                  label={t.shoe_size}
                  icon={<Footprints className="h-4 w-4 text-primary" />}
                  hint={t.shoe_size_hint}
                >
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step={0.5}
                      placeholder="42"
                      value={form.shoeSize}
                      onChange={(e) => update("shoeSize", e.target.value)}
                      className="flex-1 bg-background/50"
                    />
                    <div className="w-36">
                      <SelectField
                        value={form.shoeSystem}
                        onChange={(v) => update("shoeSystem", v as ShoeSystem)}
                        options={[
                          { value: "eu", label: "EU" },
                          { value: "uk", label: "UK" },
                          { value: "us-men", label: "US (men)" },
                          { value: "us-women", label: "US (women)" },
                        ]}
                      />
                    </div>
                  </div>
                </Field>
                <Field
                  label={t.head_circ}
                  icon={<Ruler className="h-4 w-4 text-primary" />}
                >
                  <NumberWithSuffix
                    value={form.headCircumference}
                    onChange={(v) => update("headCircumference", v)}
                    suffix={lenUnit}
                    placeholder={t.optional}
                  />
                </Field>
              </div>
            </Section>

            {/* Section 3 — Development */}
            <Section title={t.sec3_title} subtitle={t.sec3_sub}>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field
                  label={t.spurt_age}
                  icon={<ArrowUp className="h-4 w-4 text-primary" />}
                >
                  <NumberWithSuffix
                    value={form.spurtAge}
                    onChange={(v) => update("spurtAge", v)}
                    suffix={t.yrs}
                    placeholder={t.optional}
                  />
                </Field>
                <Field
                  label={t.still_growing}
                  icon={<Activity className="h-4 w-4 text-primary" />}
                >
                  <SelectField
                    value={form.stillGrowing}
                    onChange={(v) => update("stillGrowing", v as StillGrowing)}
                    options={[
                      { value: "yes", label: t.yes },
                      { value: "no", label: t.no_stopped },
                      { value: UNKNOWN, label: t.dont_know },
                    ]}
                  />
                </Field>
                <Field
                  label={t.growth_last_year}
                  icon={<ArrowUp className="h-4 w-4 text-primary" />}
                >
                  <NumberWithSuffix
                    value={form.yearlyGrowth}
                    onChange={(v) => update("yearlyGrowth", v)}
                    suffix={lenUnit}
                    placeholder={form.unit === "cm" ? "6" : "2.4"}
                  />
                </Field>
                <Field
                  label={t.growth_spurt}
                  icon={<ArrowUp className="h-4 w-4 text-primary" />}
                >
                  <SelectField
                    value={form.growthSpurt}
                    onChange={(v) => update("growthSpurt", v as GrowthSpurt)}
                    options={[
                      { value: "not-yet", label: t.spurt_not_yet },
                      { value: "now", label: t.spurt_now },
                      { value: "done", label: t.spurt_done },
                      { value: UNKNOWN, label: t.dont_know },
                    ]}
                  />
                </Field>
              </div>
            </Section>

            {/* Section 4 — Lifestyle */}
            <Section title={t.sec4_title} subtitle={t.sec4_sub}>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Field label={t.nutrition} icon={<Apple className="h-4 w-4 text-primary" />}>
                  <SelectField
                    value={form.nutrition}
                    onChange={(v) => update("nutrition", v as Nutrition)}
                    options={[
                      { value: "needs-work", label: t.nut_needs_work },
                      { value: "okay", label: t.nut_okay },
                      { value: "balanced", label: t.nut_balanced },
                      { value: "very-healthy", label: t.nut_very_healthy },
                      { value: UNKNOWN, label: t.dont_know },
                    ]}
                  />
                </Field>
                <Field label={t.sleep} icon={<Moon className="h-4 w-4 text-primary" />}>
                  <SelectField
                    value={form.sleep}
                    onChange={(v) => update("sleep", v as Sleep)}
                    options={[
                      { value: "<7", label: t.sleep_lt7 },
                      { value: "7-8", label: t.sleep_7_8 },
                      { value: "8-9", label: t.sleep_8_9 },
                      { value: "9+", label: t.sleep_9p },
                      { value: UNKNOWN, label: t.dont_know },
                    ]}
                  />
                </Field>
                <Field label={t.exercise} icon={<Dumbbell className="h-4 w-4 text-primary" />}>
                  <SelectField
                    value={form.exercise}
                    onChange={(v) => update("exercise", v as Exercise)}
                    options={[
                      { value: "none", label: t.ex_none },
                      { value: "light", label: t.ex_light },
                      { value: "moderate", label: t.ex_moderate },
                      { value: "very", label: t.ex_very },
                      { value: UNKNOWN, label: t.dont_know },
                    ]}
                  />
                </Field>
                <Field
                  label={t.chronic}
                  icon={<HeartPulse className="h-4 w-4 text-primary" />}
                >
                  <YesNoSelect
                    value={form.chronicIllness}
                    onChange={(v) => update("chronicIllness", v)}
                    t={t}
                  />
                </Field>
                <Field label={t.preterm} icon={<Baby className="h-4 w-4 text-primary" />}>
                  <YesNoSelect value={form.preterm} onChange={(v) => update("preterm", v)} t={t} />
                </Field>
                <Field
                  label={t.smoking}
                  icon={<Cigarette className="h-4 w-4 text-primary" />}
                >
                  <YesNoSelect
                    value={form.smokingPregnancy}
                    onChange={(v) => update("smokingPregnancy", v)}
                    t={t}
                  />
                </Field>
                <Field
                  label={t.hormones}
                  icon={<Pill className="h-4 w-4 text-primary" />}
                >
                  <YesNoSelect
                    value={form.hormoneTreatment}
                    onChange={(v) => update("hormoneTreatment", v)}
                    t={t}
                  />
                </Field>
              </div>
            </Section>

            {errorKey && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
                {errorKey === "age" ? t.err_age : t.err_height}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button
                type="button"
                size="lg"
                onClick={handleCalculate}
                className="w-full gap-2 bg-gradient-to-r from-primary to-accent font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 sm:w-auto"
              >
                <Sparkles className="h-4 w-4" />
                {t.estimate_btn}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleReset}
                className="w-full gap-2 sm:w-auto"
              >
                <RotateCcw className="h-4 w-4" />
                {t.reset_btn}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="overflow-hidden border border-primary/30 bg-gradient-to-br from-card to-secondary/40 shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-card-foreground sm:text-2xl">
                  {t.result_title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {t.result_desc}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center gap-1 py-4">
                  <span className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
                    {formatHeight(result.estimate, form.unit)}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground sm:text-base">
                    {t.likely_range} {formatHeight(result.min, form.unit)} —{" "}
                    {formatHeight(result.max, form.unit)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatHeight(result.min, form.unit)}</span>
                    <span>{formatHeight(result.max, form.unit)}</span>
                  </div>
                  <div className="h-4 w-full overflow-hidden rounded-full bg-secondary/60">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out"
                      style={{ width: "50%", marginLeft: "25%" }}
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-background/40 p-4 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">{t.remember_label}</strong>
                    {t.remember_text}
                  </p>
                  <p className="mt-2">
                    {t.method_text_pre}
                    <strong className="text-foreground">{t.method_text_strong}</strong>
                    {t.method_text_post}
                  </p>
                  <p className="mt-2">
                    {t.important_pre}
                    <strong className="text-foreground">{t.important_strong}</strong>
                    {t.important_post}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </main>
  );
}


/* ---------- small UI helpers ---------- */

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border pt-6 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">{title}</h3>
      {subtitle && <p className="mt-1 mb-4 text-xs text-muted-foreground">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      {children}
    </div>
  );
}

function Field({
  label,
  icon,
  hint,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        {icon}
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function NumberWithSuffix({
  value,
  onChange,
  suffix,
  placeholder,
  min,
  max,
}: {
  value: string;
  onChange: (v: string) => void;
  suffix: string;
  placeholder?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div className="relative">
      <Input
        type="number"
        min={min}
        max={max}
        step={0.1}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-background/50 pr-14"
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        {suffix}
      </span>
    </div>
  );
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-background/50">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function YesNoSelect({
  value,
  onChange,
}: {
  value: YesNoUnknown;
  onChange: (v: YesNoUnknown) => void;
}) {
  return (
    <SelectField
      value={value}
      onChange={(v) => onChange(v as YesNoUnknown)}
      options={[
        { value: "no", label: "No" },
        { value: "yes", label: "Yes" },
        { value: UNKNOWN, label: "I don't know" },
      ]}
    />
  );
}
