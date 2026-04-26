"use client";

import { useEffect, useRef } from "react";

export function ScoreRenderer({ xml }: { xml: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let disposed = false;
    async function render() {
      if (!ref.current || !xml) return;
      const { OpenSheetMusicDisplay } = await import("opensheetmusicdisplay");
      const osmd = new OpenSheetMusicDisplay(ref.current, { autoResize: true, drawingParameters: "compact" });
      await osmd.load(xml);
      if (!disposed) osmd.render();
    }
    render();
    return () => {
      disposed = true;
    };
  }, [xml]);

  return <div ref={ref} className="min-h-[360px] overflow-auto rounded-lg bg-white p-4 text-black" />;
}
