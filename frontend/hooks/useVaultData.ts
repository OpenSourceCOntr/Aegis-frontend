"use client";

import { useState, useEffect } from "react";

export type Timeframe = "1D" | "1W" | "1M" | "1Y";

export interface ChartDataPoint {
  date: string;
  price: number;
}

export function useVaultData(vaultId: string, timeframe: Timeframe = "1M") {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      const mockData: ChartDataPoint[] = generateMockData(timeframe);
      setData(mockData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [vaultId, timeframe]);

  return { data, loading };
}

function generateMockData(timeframe: Timeframe): ChartDataPoint[] {
  const points: ChartDataPoint[] = [];
  const now = new Date();
  
  let numPoints = 30;
  let timeStepHours = 24; // Default to daily

  switch (timeframe) {
    case "1D":
      numPoints = 24;
      timeStepHours = 1; // Hourly
      break;
    case "1W":
      numPoints = 7;
      timeStepHours = 24; // Daily
      break;
    case "1M":
      numPoints = 30;
      timeStepHours = 24; // Daily
      break;
    case "1Y":
      numPoints = 12;
      timeStepHours = 24 * 30; // Roughly monthly
      break;
  }
  
  for (let i = numPoints; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(d.getHours() - (i * timeStepHours));
    
    const basePrice = 1.0;
    const growth = (numPoints - i) * 0.005;
    const volatility = (Math.random() - 0.4) * 0.02;
    
    points.push({
      date: d.toISOString(),
      price: parseFloat((basePrice + growth + volatility).toFixed(4)),
    });
  }
  
  return points;
}
