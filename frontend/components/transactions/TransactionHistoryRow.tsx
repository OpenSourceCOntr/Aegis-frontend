"use client";

import { ArrowDownLeft, ArrowUpRight, RefreshCw } from "lucide-react";
import type { TransactionItem, TransactionKind } from "@/types/transactions";

const KIND_STYLE: Record<
  TransactionKind,
  { Icon: typeof ArrowDownLeft; label: string; iconBg: string; iconColor: string; amountColor: string; sign: string }
> = {
  DEPOSIT: {
    Icon: ArrowDownLeft,
    label: "Deposit",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
    amountColor: "text-green-500",
    sign: "+",
  },
  WITHDRAW: {
    Icon: ArrowUpRight,
    label: "Withdraw",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
    amountColor: "text-red-400",
    sign: "−",
  },
  REBALANCE: {
    Icon: RefreshCw,
    label: "Rebalance",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    amountColor: "text-muted-foreground",
    sign: "",
  },
};

interface TransactionHistoryRowProps {
  tx: TransactionItem;
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / 3_600_000);

  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function shortenHash(hash: string): string {
  if (hash.length <= 12) return hash;
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`;
}

function formatAmount(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function TransactionHistoryRow({ tx }: TransactionHistoryRowProps) {
  const { Icon, label, iconBg, iconColor, amountColor, sign } = KIND_STYLE[tx.kind];

  return (
    <div className="flex items-center gap-2 sm:gap-3 py-2.5 border-b border-border last:border-0">
      <div
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
      >
        <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${iconColor}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-semibold leading-tight">{label}</p>
        <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
          {shortenHash(tx.txHash)} &middot; {formatTimestamp(tx.timestampISO)}
        </p>
      </div>

      <p className={`text-xs sm:text-sm font-bold tabular-nums whitespace-nowrap shrink-0 ${amountColor}`}>
        {sign}{formatAmount(tx.amount)} {tx.asset}
      </p>
    </div>
  );
}
