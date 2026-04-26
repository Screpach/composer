/// <reference lib="webworker" />
import { generateStudy } from "@/lib/harmony/generator";
import type { GenerateOptions } from "@/types/music";

self.onmessage = (event: MessageEvent<GenerateOptions>) => {
  const result = generateStudy(event.data);
  self.postMessage(result);
};

export {};
