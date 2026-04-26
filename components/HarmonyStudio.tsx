"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAtom } from "jotai";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { planAtom, showAnalysisAtom, showSchemaAtom, showWarningsAtom } from "@/lib/state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ComposerId, GenerateOptions, TextureId } from "@/types/music";
import { ScoreRenderer } from "@/components/ScoreRenderer";
import { playPlan, stopPlan } from "@/lib/audio/playback";

const composers: ComposerId[] = ["beethoven", "schubert", "hummel", "chopin", "mendelssohn", "schumann", "brahms", "wagner", "rachmaninoff", "scriabin"];
const textures: TextureId[] = ["chorale", "piano-reduction", "grand-staff-arpeggiated", "satb", "bass-figures"];

const formSchema = z.object({
  composer: z.enum(composers as [ComposerId, ...ComposerId[]]),
  key: z.string().min(1),
  mode: z.enum(["major", "minor", "auto"]),
  complexity: z.coerce.number().min(1).max(5),
  texture: z.enum(textures as [TextureId, ...TextureId[]]),
  tempo: z.coerce.number().min(40).max(220),
  seed: z.coerce.number().int()
});

type FormValues = z.infer<typeof formSchema>;

export function HarmonyStudio() {
  const [plan, setPlan] = useAtom(planAtom);
  const [showAnalysis, setShowAnalysis] = useAtom(showAnalysisAtom);
  const [showSchema, setShowSchema] = useAtom(showSchemaAtom);
  const [showWarnings, setShowWarnings] = useAtom(showWarningsAtom);
  const [loading, setLoading] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { composer: "beethoven", key: "C", mode: "minor", complexity: 3, texture: "chorale", tempo: 72, seed: 1701 }
  });

  useEffect(() => {
    workerRef.current = new Worker(new URL("../workers/harmonyWorker.ts", import.meta.url));
    workerRef.current.onmessage = (event) => {
      setPlan(event.data);
      setLoading(false);
    };
    return () => workerRef.current?.terminate();
  }, [setPlan]);

  const submit = form.handleSubmit((values) => {
    setLoading(true);
    workerRef.current?.postMessage({ ...values, complexity: values.complexity as 1 | 2 | 3 | 4 | 5 } as GenerateOptions);
  });

  const phraseBars = useMemo(() => [1, 2, 3, 4, 5, 6, 7, 8], []);

  return (
    <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-[300px_1fr_360px]">
      <Card>
        <h1 className="mb-3 text-xl font-semibold">Romantic Harmony Generator</h1>
        <form onSubmit={submit} className="space-y-3">
          <select className="w-full rounded-md bg-black/30 p-2" {...form.register("composer")}>{composers.map((c) => <option key={c} value={c}>{c}</option>)}</select>
          <Input {...form.register("key")} />
          <select className="w-full rounded-md bg-black/30 p-2" {...form.register("mode")}><option>major</option><option>minor</option><option>auto</option></select>
          <select className="w-full rounded-md bg-black/30 p-2" {...form.register("texture")}>{textures.map((t) => <option key={t} value={t}>{t}</option>)}</select>
          <label className="block text-xs">Complexity {form.watch("complexity")}</label>
          <input type="range" min={1} max={5} className="w-full" {...form.register("complexity")} />
          <Input type="number" {...form.register("tempo")} />
          <Input type="number" {...form.register("seed")} />
          <div className="grid grid-cols-2 gap-2">
            <Button type="submit" disabled={loading}>{loading ? "Generating…" : "Generate"}</Button>
            <Button type="button" onClick={() => form.setValue("seed", Math.floor(Math.random() * 1e9))}>Regenerate variation</Button>
            <Button type="button" onClick={() => plan && playPlan(plan)}>Play</Button>
            <Button type="button" onClick={() => stopPlan()}>Stop</Button>
          </div>
        </form>
      </Card>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mb-4">
          {plan ? <ScoreRenderer xml={plan.musicXml} /> : <div className="min-h-[300px] place-content-center text-center text-muted">Generate an 8-bar study.</div>}
        </Card>
        <Card>
          <div className="mb-2 text-sm">Phrase strip 2 + 2 + 4</div>
          <div className="grid grid-cols-8 gap-1">{phraseBars.map((bar) => <div key={bar} className={`rounded p-2 text-center text-xs ${bar <= 2 ? "bg-blue-500/30" : bar <= 4 ? "bg-purple-500/30" : "bg-emerald-500/30"}`}>Bar {bar}</div>)}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" onClick={() => setShowAnalysis((v) => !v)}>Show analysis</Button>
            <Button type="button" onClick={() => setShowSchema((v) => !v)}>Show bass schema</Button>
            <Button type="button" onClick={() => setShowWarnings((v) => !v)}>Show voice-leading warnings</Button>
            <Button type="button" onClick={() => navigator.clipboard.writeText(plan?.musicXml ?? "")}>Copy XML</Button>
            <Button type="button" onClick={() => {
              if (!plan) return;
              const blob = new Blob([plan.musicXml], { type: "application/vnd.recordare.musicxml+xml" });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = `${plan.composer}-study.musicxml`;
              link.click();
              URL.revokeObjectURL(link.href);
            }}>Export MusicXML</Button>
          </div>
        </Card>
      </motion.div>

      <Card className="space-y-2 text-sm">
        <h2 className="text-lg">Analysis</h2>
        {plan && showAnalysis && <p>{plan.analysis.overview}</p>}
        {plan && showSchema && <ul className="list-disc space-y-1 pl-5">{plan.analysis.bassSchema.map((b) => <li key={b}>{b}</li>)}</ul>}
        {plan && <div>
          <div className="font-medium">Cadence</div>
          <div>{plan.analysis.cadenceType}</div>
        </div>}
        {plan && <div>
          <div className="font-medium">Modulation path</div>
          <div>{plan.analysis.modulationPath}</div>
        </div>}
        {plan && showWarnings && <ul className="list-disc pl-5">{plan.analysis.voiceLeadingWarnings.map((w) => <li key={w}>{w}</li>)}</ul>}
        {plan && <pre className="max-h-60 overflow-auto rounded bg-black/40 p-2 text-xs">{plan.musicXml}</pre>}
      </Card>
    </div>
  );
}
