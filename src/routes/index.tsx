import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";

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
import { ArrowUp, RotateCcw, Ruler, Activity, User, Users, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GrowScope — How Tall Will You Be?" },
      {
        name: "description",
        content:
          "Answer a few quick questions about your age, current height, parents' heights, and recent growth to get a fun estimate of your adult height.",
      },
      { property: "og:title", content: "GrowScope — How Tall Will You Be?" },
      {
        property: "og:description",
        content:
          "Answer a few quick questions about your age, current height, parents' heights, and recent growth to get a fun estimate of your adult height.",
      },
    ],
  }),
  component: Index,
});

type Unit = "cm" | "ft";
type Gender = "boy" | "girl";

interface HeightFtIn {
  ft: string;
  in: string;
}

interface FormState {
  gender: Gender;
  age: string;
  unit: Unit;
  currentHeightCm: string;
  currentHeightFt: HeightFtIn;
  momHeightCm: string;
  momHeightFt: HeightFtIn;
  dadHeightCm: string;
  dadHeightFt: HeightFtIn;
  yearlyGrowthCm: string;
  yearlyGrowthIn: string;
}

const EMPTY_FT: HeightFtIn = { ft: "", in: "" };

const initialForm: FormState = {
  gender: "boy",
  age: "",
  unit: "cm",
  currentHeightCm: "",
  currentHeightFt: { ...EMPTY_FT },
  momHeightCm: "",
  momHeightFt: { ...EMPTY_FT },
  dadHeightCm: "",
  dadHeightFt: { ...EMPTY_FT },
  yearlyGrowthCm: "",
  yearlyGrowthIn: "",
};

function ftInToCm(ft: string, inch: string): number {
  const f = Number.parseFloat(ft) || 0;
  const i = Number.parseFloat(inch) || 0;
  return (f * 30.48) + (i * 2.54);
}

function cmToFtIn(cm: number): { ft: number; in: number } {
  const totalInches = cm / 2.54;
  const ft = Math.floor(totalInches / 12);
  const inches = Math.round((totalInches - ft * 12) * 10) / 10;
  return { ft, in: inches };
}

function formatHeight(cm: number, unit: Unit): string {
  if (unit === "cm") {
    return `${Math.round(cm)} cm`;
  }
  const { ft, in: inches } = cmToFtIn(cm);
  return `${ft} ft ${inches} in`;
}

function estimateAdultHeight(gender: Gender, age: number, currentCm: number, momCm: number, dadCm: number, yearlyGrowthCm: number): { estimate: number; min: number; max: number } {
  // Mid-parental height (target adult height from genetics)
  const geneticTarget = gender === "boy" ? (momCm + dadCm + 13) / 2 : (momCm + dadCm - 13) / 2;

  // Typical age when growth plates close
  const stopAge = gender === "boy" ? 18 : 16;
  const yearsRemaining = Math.max(0, stopAge - age);

  // Project remaining growth with a realistic slowdown each year
  let remainingGrowth = 0;
  let growth = yearlyGrowthCm;
  for (let i = 0; i < yearsRemaining; i++) {
    remainingGrowth += growth;
    growth *= 0.65;
  }

  // Very young children: if no recent growth given, use a default based on age
  const effectiveGrowth = yearlyGrowthCm > 0 ? yearlyGrowthCm : Math.max(4, 12 - age * 0.5);
  if (yearlyGrowthCm <= 0) {
    let projected = 0;
    let g = effectiveGrowth;
    for (let i = 0; i < yearsRemaining; i++) {
      projected += g;
      g *= 0.65;
    }
    remainingGrowth = projected;
  }

  const growthProjection = currentCm + remainingGrowth;

  // Blend: younger kids rely more on genetics; older teens rely more on current trajectory
  let geneticWeight = 0.7;
  if (age >= 15) geneticWeight = 0.25;
  else if (age >= 13) geneticWeight = 0.45;
  else if (age >= 11) geneticWeight = 0.6;
  else if (age >= 8) geneticWeight = 0.65;

  const estimate = geneticWeight * geneticTarget + (1 - geneticWeight) * growthProjection;

  // Uncertainty is larger for younger users and for users without a recent growth number
  const baseUncertainty = yearlyGrowthCm > 0 ? 6.5 : 8.5;
  const ageUncertainty = Math.max(0, 16 - age) * 0.35;
  const range = baseUncertainty + ageUncertainty;

  return {
    estimate,
    min: estimate - range,
    max: estimate + range,
  };
}

function Index() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [result, setResult] = useState<{ estimate: number; min: number; max: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentHeightCm = useMemo(() => {
    if (form.unit === "cm") return Number.parseFloat(form.currentHeightCm) || 0;
    return ftInToCm(form.currentHeightFt.ft, form.currentHeightFt.in);
  }, [form.unit, form.currentHeightCm, form.currentHeightFt]);

  const momHeightCm = useMemo(() => {
    if (form.unit === "cm") return Number.parseFloat(form.momHeightCm) || 0;
    return ftInToCm(form.momHeightFt.ft, form.momHeightFt.in);
  }, [form.unit, form.momHeightCm, form.momHeightFt]);

  const dadHeightCm = useMemo(() => {
    if (form.unit === "cm") return Number.parseFloat(form.dadHeightCm) || 0;
    return ftInToCm(form.dadHeightFt.ft, form.dadHeightFt.in);
  }, [form.unit, form.dadHeightCm, form.dadHeightFt]);

  const yearlyGrowthCm = useMemo(() => {
    if (form.unit === "cm") return Number.parseFloat(form.yearlyGrowthCm) || 0;
    const inches = Number.parseFloat(form.yearlyGrowthIn) || 0;
    return inches * 2.54;
  }, [form.unit, form.yearlyGrowthCm, form.yearlyGrowthIn]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  function updateFtIn(field: "currentHeightFt" | "momHeightFt" | "dadHeightFt", key: keyof HeightFtIn, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], [key]: value },
    }));
    setError(null);
  }

  function handleCalculate() {
    const age = Number.parseFloat(form.age);
    if (!Number.isFinite(age) || age < 2 || age > 21) {
      setError("Please enter an age between 2 and 21 years.");
      setResult(null);
      return;
    }
    if (currentHeightCm <= 30 || currentHeightCm > 250) {
      setError("Please enter a realistic current height.");
      setResult(null);
      return;
    }
    if (momHeightCm <= 30 || momHeightCm > 250 || dadHeightCm <= 30 || dadHeightCm > 250) {
      setError("Please enter realistic heights for both parents.");
      setResult(null);
      return;
    }
    if (yearlyGrowthCm < 0 || yearlyGrowthCm > 30) {
      setError("Please enter a realistic amount of growth in the last year.");
      setResult(null);
      return;
    }

    setError(null);
    setResult(estimateAdultHeight(form.gender, age, currentHeightCm, momHeightCm, dadHeightCm, yearlyGrowthCm));
  }

  function handleReset() {
    setForm(initialForm);
    setResult(null);
    setError(null);
  }

  const inputWrapper = "space-y-2";

  return (
    <main className="min-h-screen bg-background px-4 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl">
        {/* Hero */}
        <div className="mb-10 text-center sm:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Fun height estimate for kids & teens</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            How tall will <span className="text-primary">you</span> grow?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Tell us a few things about yourself and your family, and we'll estimate your adult height. Remember — this is just for fun, not a medical prediction!
          </p>
        </div>

        {/* Form card */}
        <Card className="overflow-hidden border border-border bg-card shadow-xl">
          <CardHeader className="bg-secondary/30 pb-6">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-card-foreground sm:text-2xl">
              <Ruler className="h-5 w-5 text-primary" />
              Your growth profile
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Fill in the details below. You can switch between centimeters and feet/inches.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Unit toggle */}
            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 p-3">
              <span className="text-sm font-medium text-secondary-foreground">Measurement unit</span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={form.unit === "cm" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateField("unit", "cm")}
                >
                  cm
                </Button>
                <Button
                  type="button"
                  variant={form.unit === "ft" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateField("unit", "ft")}
                >
                  ft/in
                </Button>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Gender */}
              <div className={inputWrapper}>
                <Label htmlFor="gender" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  You are
                </Label>
                <Select value={form.gender} onValueChange={(value) => updateField("gender", value as Gender)}>
                  <SelectTrigger id="gender" className="bg-background/50">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boy">A boy</SelectItem>
                    <SelectItem value="girl">A girl</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Age */}
              <div className={inputWrapper}>
                <Label htmlFor="age" className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Your age
                </Label>
                <div className="relative">
                  <Input
                    id="age"
                    type="number"
                    min={2}
                    max={21}
                    step={0.1}
                    placeholder="e.g. 13"
                    value={form.age}
                    onChange={(e) => updateField("age", e.target.value)}
                    className="bg-background/50 pr-14"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    yrs
                  </span>
                </div>
              </div>

              {/* Current height */}
              <div className={inputWrapper}>
                <Label htmlFor="currentHeight" className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-primary" />
                  Your current height
                </Label>
                {form.unit === "cm" ? (
                  <div className="relative">
                    <Input
                      id="currentHeight"
                      type="number"
                      min={30}
                      max={250}
                      step={0.1}
                      placeholder="e.g. 150"
                      value={form.currentHeightCm}
                      onChange={(e) => updateField("currentHeightCm", e.target.value)}
                      className="bg-background/50 pr-12"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      cm
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        min={1}
                        max={8}
                        placeholder="ft"
                        value={form.currentHeightFt.ft}
                        onChange={(e) => updateFtIn("currentHeightFt", "ft", e.target.value)}
                        className="bg-background/50 pr-8"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        ft
                      </span>
                    </div>
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        min={0}
                        max={11}
                        step={0.1}
                        placeholder="in"
                        value={form.currentHeightFt.in}
                        onChange={(e) => updateFtIn("currentHeightFt", "in", e.target.value)}
                        className="bg-background/50 pr-8"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        in
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Yearly growth */}
              <div className={inputWrapper}>
                <Label htmlFor="yearlyGrowth" className="flex items-center gap-2">
                  <ArrowUp className="h-4 w-4 text-primary" />
                  How much you grew last year
                </Label>
                {form.unit === "cm" ? (
                  <div className="relative">
                    <Input
                      id="yearlyGrowth"
                      type="number"
                      min={0}
                      max={30}
                      step={0.1}
                      placeholder="e.g. 6"
                      value={form.yearlyGrowthCm}
                      onChange={(e) => updateField("yearlyGrowthCm", e.target.value)}
                      className="bg-background/50 pr-12"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      cm
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      id="yearlyGrowth"
                      type="number"
                      min={0}
                      max={12}
                      step={0.1}
                      placeholder="e.g. 2.4"
                      value={form.yearlyGrowthIn}
                      onChange={(e) => updateField("yearlyGrowthIn", e.target.value)}
                      className="bg-background/50 pr-12"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      in
                    </span>
                  </div>
                )}
              </div>

              {/* Mom height */}
              <div className={inputWrapper}>
                <Label htmlFor="momHeight" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Mom's height
                </Label>
                {form.unit === "cm" ? (
                  <div className="relative">
                    <Input
                      id="momHeight"
                      type="number"
                      min={30}
                      max={250}
                      step={0.1}
                      placeholder="e.g. 165"
                      value={form.momHeightCm}
                      onChange={(e) => updateField("momHeightCm", e.target.value)}
                      className="bg-background/50 pr-12"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      cm
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        min={1}
                        max={8}
                        placeholder="ft"
                        value={form.momHeightFt.ft}
                        onChange={(e) => updateFtIn("momHeightFt", "ft", e.target.value)}
                        className="bg-background/50 pr-8"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        ft
                      </span>
                    </div>
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        min={0}
                        max={11}
                        step={0.1}
                        placeholder="in"
                        value={form.momHeightFt.in}
                        onChange={(e) => updateFtIn("momHeightFt", "in", e.target.value)}
                        className="bg-background/50 pr-8"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        in
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Dad height */}
              <div className={inputWrapper}>
                <Label htmlFor="dadHeight" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Dad's height
                </Label>
                {form.unit === "cm" ? (
                  <div className="relative">
                    <Input
                      id="dadHeight"
                      type="number"
                      min={30}
                      max={250}
                      step={0.1}
                      placeholder="e.g. 180"
                      value={form.dadHeightCm}
                      onChange={(e) => updateField("dadHeightCm", e.target.value)}
                      className="bg-background/50 pr-12"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      cm
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        min={1}
                        max={8}
                        placeholder="ft"
                        value={form.dadHeightFt.ft}
                        onChange={(e) => updateFtIn("dadHeightFt", "ft", e.target.value)}
                        className="bg-background/50 pr-8"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        ft
                      </span>
                    </div>
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        min={0}
                        max={11}
                        step={0.1}
                        placeholder="in"
                        value={form.dadHeightFt.in}
                        onChange={(e) => updateFtIn("dadHeightFt", "in", e.target.value)}
                        className="bg-background/50 pr-8"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        in
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
                {error}
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
                Estimate my height
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleReset}
                className="w-full gap-2 sm:w-auto"
              >
                <RotateCcw className="h-4 w-4" />
                Start over
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="overflow-hidden border border-primary/30 bg-gradient-to-br from-card to-secondary/40 shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-card-foreground sm:text-2xl">
                  Your estimated adult height
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Based on your family heights, age, and recent growth.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center gap-1 py-4">
                  <span className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
                    {formatHeight(result.estimate, form.unit)}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground sm:text-base">
                    likely range: {formatHeight(result.min, form.unit)} — {formatHeight(result.max, form.unit)}
                  </span>
                </div>

                {/* Visual bar */}
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
                  <p className="text-center text-xs text-muted-foreground">
                    The middle of the bar shows your most likely height
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-background/40 p-4 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Remember:</strong> this is a fun estimate, not a doctor's
                    prediction. Real adult height depends on nutrition, sleep, exercise, genetics, and when you hit
                    puberty. Keep eating well, sleeping enough, and staying active!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer disclaimer */}
        <p className="mt-10 text-center text-xs text-muted-foreground">
          Not medical advice. For health concerns, talk to a pediatrician or doctor.
        </p>
      </div>
    </main>
  );
}
