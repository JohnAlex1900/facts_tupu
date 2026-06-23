import { useEffect, useState } from "react";
import { PoliticianProfile, LiveMetricUpdateMessage } from "../types";

const STREAM_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/stream/metrics`;

export function useLiveMetrics(initialProfiles: PoliticianProfile[]) {
  const [profiles, setProfiles] =
    useState<PoliticianProfile[]>(initialProfiles);
  const [lastAlert, setLastAlert] = useState<LiveMetricUpdateMessage | null>(
    null,
  );

  useEffect(() => {
    console.log("[SSE] Instantiating connection to live metrics stream...");
    const eventSource = new EventSource(STREAM_URL);

    // Listen specifically for the METRIC_UPDATE event dispatched by the backend broker
    eventSource.addEventListener("METRIC_UPDATE", (event: MessageEvent) => {
      try {
        const payload: LiveMetricUpdateMessage = JSON.parse(event.data);
        console.log("[SSE EVENT CAPTURED]", payload);

        setLastAlert(payload);

        // First-principles reactive state merge: locate the target and apply macro metric shifts
        setProfiles((prevProfiles) =>
          prevProfiles.map((prof) => {
            if (prof.id === payload.politician_id) {
              return {
                ...prof,
                integrity_score: payload.updated_vectors.integrity_score_pct,
                engagement_score: payload.updated_vectors.engagement_score_pct,
                overall_accountability_score:
                  payload.updated_vectors.overall_accountability_score_pct,
              };
            }
            return prof;
          }),
        );
      } catch (err) {
        console.error("Error parsing streaming event frame metrics:", err);
      }
    });

    eventSource.onerror = (error) => {
      console.error(
        "[SSE ERROR] Stream disconnected or encountered network fault:",
        error,
      );
      eventSource.close();
    };

    // Auto-teardown execution path to ensure no persistent leak loops remain in the browser
    return () => {
      console.log("[SSE] Closing active data stream connection channel.");
      eventSource.close();
    };
  }, []);

  return { profiles, lastAlert };
}
