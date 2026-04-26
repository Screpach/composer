export function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function weightedChoice<T>(items: Array<{ item: T; weight: number }>, rand: () => number): T {
  const total = items.reduce((sum, current) => sum + current.weight, 0);
  let value = rand() * total;
  for (const candidate of items) {
    value -= candidate.weight;
    if (value <= 0) {
      return candidate.item;
    }
  }
  return items[items.length - 1].item;
}
