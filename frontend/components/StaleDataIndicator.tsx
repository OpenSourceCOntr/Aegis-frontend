"use client";

import { type ReactNode } from "react";
import { Clock, AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { type FreshnessLevel } from "@/hooks/useStaleData";

interface StaleDataIndicatorProps {
  freshnessLevel: FreshnessLevel;
  lastUpdatedLabel: string;
  className?: string;
}

const freshnessConfig: Record<FreshnessLevel, { bg: string; text: string; dot: string; label: string }> = {
  fresh: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    dot: "bg-emerald-500",
    label: "Live",
  },
  aging: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-600 dark:text-yellow-400",
    dot: "bg-yellow-500",
    label: "Aging",
  },
  stale: {
    bg: "bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    dot: "bg-red-500",
    label: "Stale",
  },
};

export function StaleDataIndicator({
  freshnessLevel,
  lastUpdatedLabel,
  className,
}: StaleDataIndicatorProps) {
  const config = freshnessConfig[freshnessLevel];
  const Icon = freshnessLevel === "stale" ? AlertTriangle : Clock;

  if (!lastUpdatedLabel) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bg,
        config.text,
        className,
      )}
      role="status"
      aria-label={`Data freshness: ${config.label}. ${lastUpdatedLabel}`}
    >
      <div className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      <Icon className="h-3 w-3" />
      <span>{lastUpdatedLabel}</span>
    </div>
  );
}
