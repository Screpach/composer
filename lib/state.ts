import { atom } from "jotai";
import type { HarmonyPlan } from "@/types/music";

export const planAtom = atom<HarmonyPlan | null>(null);
export const showAnalysisAtom = atom(true);
export const showSchemaAtom = atom(true);
export const showWarningsAtom = atom(true);
