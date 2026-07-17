const CACHE_VERSION = "v1";
export function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

type CacheEnvelope<T> = {
  version: string;
  storedAt: number;
  data: T;
};

export function getCached<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CacheEnvelope<T>;
    if (parsed.version !== CACHE_VERSION) return null;

    return parsed.data;
  } catch {
    return null;
  }
}

/** Menulis value JSON ke localStorage, dibungkus dengan tag versi. */
export function setCached<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;

  const envelope: CacheEnvelope<T> = {
    version: CACHE_VERSION,
    storedAt: Date.now(),
    data,
  };

  try {
    localStorage.setItem(key, JSON.stringify(envelope));
  } catch {
    // Quota localStorage penuh atau tidak tersedia (mis. private browsing).
    // Sort tetap jalan tanpa cache, hanya lebih lambat di pemanggilan berikutnya.
  }
}

export async function fetchInBatches<T, R>(
  items: T[],
  task: (item: T) => Promise<R>,
  concurrency: number = 50
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function worker(): Promise<void> {
    while (cursor < items.length) {
      const currentIndex = cursor++;
      results[currentIndex] = await task(items[currentIndex]);
    }
  }

  const workerCount = Math.min(concurrency, items.length) || 1;
  const workers = Array.from({ length: workerCount }, () => worker());
  await Promise.all(workers);

  return results;
}