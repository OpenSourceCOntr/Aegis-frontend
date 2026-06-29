"use client";

import { useState, useRef, useCallback } from "react";

/**
 * Tracks when data was last fetched and whether it is considered stale.
 *
 * @example
 * const { lastFetchedAt, isStale, freshnessLevel, markFetched } = useStaleData();
 * // After a successful fetch:
 * markFetched();
 */
export type FreshnessLevel = "fresh" | "aging" | "stale";

const STALE_AGING_THRESHOLD_MS = 60_000; // 60 seconds → yellow
const STALE_THRESHOLD_MS = 300_000; // 300 seconds (5 min) → red

export interface UseStaleDataResult {
  lastFetchedAt: Date | null;
  /** Milliseconds since last fetch, or null if never fetched. */
  msSinceLastFetch: number | null;
  isStale: boolean;
  isAging: boolean;
  freshnessLevel: FreshnessLevel;
  /** Call after a successful data fetch. */
  markFetched: () => void;
  /** Format "Last updated X minutes ago" or empty string if never fetched. */
  lastUpdatedLabel: string;
}

export function useStaleData(): UseStaleDataResult {
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [, forceRerender] = useState(0);

  const markFetched = useCallback(() => {
    const now = new Date();
    setLastFetchedAt(now);
  }, []);

  // Poll every 10 seconds to update the "X minutes ago" label
  const startTicking = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      forceRerender((n) => n + 1);
    }, 10_000);
  }, []);

  if (lastFetchedAt !== null && !intervalRef.current) {
    startTicking();
  }

  const msSinceLastFetch =
    lastFetchedAt !== null ? Date.now() - lastFetchedAt.getTime() : null;

  const isAging = msSinceLastFetch !== null && msSinceLastFetch > STALE_AGING_THRESHOLD_MS;
  const isStale = msSinceLastFetch !== null && msSinceLastFetch > STALE_THRESHOLD_MS;

  const freshnessLevel: FreshnessLevel = isStale
    ? "stale"
    : isAging
      ? "aging"
      : "fresh";

  const lastUpdatedLabel = lastFetchedAt
    ? formatRelativeTime(lastFetchedAt)
    : "";

  return {
    lastFetchedAt,
    msSinceLastFetch,
    isStale,
    isAging,
    freshnessLevel,
    markFetched,
    lastUpdatedLabel,
  };
}

function formatRelativeTime(date: Date): string {
  const ms = Date.now() - date.getTime();
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 5) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours === 1) return "1 hour ago";
  return `${hours} hours ago`;
}
