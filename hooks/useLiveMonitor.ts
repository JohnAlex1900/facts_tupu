/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";

export interface AlertRecord {
  id: string;
  politicianName: string;
  slug: string;
  tier: string;
  textStream: string;
  flaggedVectors: string[];
  severity: "HIGH" | "MEDIUM" | "NONE";
  riskDelta: number;
  timestamp: string;
  integrityScore: number;
  engagementScore: number;
  accountabilityScore: number;
}

export interface WatchlistItem {
  id: string;
  name: string;
  accountabilityScore: number;
  risk_radar_index: number;
}

export function useLiveMonitor(filters: { tier: string; severity: string }) {
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Hydrated Snapshot State based on current active filters
  const fetchSnapshot = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.tier) queryParams.append("tier", filters.tier);
      if (filters.severity) queryParams.append("severity", filters.severity);

      const res = await fetch(`/api/monitor?${queryParams.toString()}`);
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setAlerts(data.alerts || []);
      setWatchlist(data.watchlist || []);
      setError(null);
    } catch (err: unknown | Error) {
      setError(`Snapshot Synchronization Failure: ${err?.toString() || err}`);
      console.error(
        `Snapshot Synchronization Failure: ${err?.toString() || err}`,
      );
    }
  }, [filters]);

  // 2. Wire Up Persistent SSE Event Channel
  useEffect(() => {
    fetchSnapshot();

    // Instantiate native EventSource gateway pointing to the FastAPI proxy target
    const eventSource = new EventSource("/api/monitor/stream");
    setIsStreaming(true);

    eventSource.onmessage = (event) => {
      try {
        const rawPayload = JSON.parse(event.data);

        // Skip the registration handshake verification ping
        if (rawPayload.status === "CONNECTED") return;

        // Hot merge incoming hot events into the feed state
        setAlerts((prevAlerts) => {
          // Prevent duplicates if an event gets double-emitted
          if (prevAlerts.some((a) => a.id === rawPayload.id)) return prevAlerts;

          // Apply basic client-side filter validation check
          if (filters.tier && rawPayload.tier !== filters.tier)
            return prevAlerts;
          if (filters.severity && rawPayload.severity !== filters.severity)
            return prevAlerts;

          return [rawPayload, ...prevAlerts];
        });
      } catch (parseErr) {
        console.error("Stream payload structural parsing glitch:", parseErr);
      }
    };

    eventSource.onerror = () => {
      setError(
        "Live streaming stream interrupted. Attempting hot reconnection...",
      );
      setIsStreaming(false);
    };

    return () => {
      eventSource.close();
    };
  }, [filters, fetchSnapshot]);

  return { alerts, watchlist, isStreaming, error, refetch: fetchSnapshot };
}
