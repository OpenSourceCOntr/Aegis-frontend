"use client";

import { type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataFetchBoundaryProps {
  children: ReactNode;
  isLoading: boolean;
  error: string | null;
  hasData: boolean;
  onRetry?: () => void;
  skeleton?: ReactNode;
  className?: string;
}

export function DataFetchBoundary({
  children,
  isLoading,
  error,
  hasData,
  onRetry,
  skeleton,
  className,
}: DataFetchBoundaryProps) {
  if (isLoading && !hasData) {
    if (skeleton) {
      return <>{skeleton}</>;
    }
    return <DefaultSkeleton className={className} />;
  }

  if (error && !hasData) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-8",
          className,
        )}
        role="alert"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Failed to load data</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

function DefaultSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-border bg-card p-6",
        className,
      )}
      aria-busy="true"
      aria-label="Loading data"
    >
      <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
      <div className="h-8 w-1/2 animate-pulse rounded bg-muted" />
      <div className="h-3 w-full animate-pulse rounded bg-muted" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
    </div>
  );
}
